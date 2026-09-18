import { supabase } from './supabase';

export type VoteType = 'up' | 'down' | null;

export interface VoteStats {
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
}

// Retrieves the current total votes for a proposal and the user's specific vote
export async function getProposalVotes(proposalId: string, fingerprintId: string): Promise<VoteStats> {
  const stats: VoteStats = { upvotes: 0, downvotes: 0, userVote: null };

  try {
    // Get totals from the view
    const { data: viewData, error: viewError } = await supabase
      .from('proposal_votes_summary')
      .select('upvotes, downvotes')
      .eq('proposal_id', proposalId)
      .maybeSingle();

    if (viewError) {
      console.error('[VoteService] Failed to load vote summary:', viewError.message);
    } else if (viewData) {
      stats.upvotes = viewData.upvotes || 0;
      stats.downvotes = viewData.downvotes || 0;
    }

    // Get the specific user's vote if they already voted
    const { data: userVoteData, error: userVoteError } = await supabase
      .from('votes_log')
      .select('vote_type')
      .eq('proposal_id', proposalId)
      .eq('fingerprint_id', fingerprintId)
      .maybeSingle();

    if (userVoteError) {
      console.error('[VoteService] Failed to load user vote:', userVoteError.message);
    } else if (userVoteData) {
      stats.userVote = userVoteData.vote_type as VoteType;
    }
  } catch (err) {
    console.error('[VoteService] Unexpected error retrieving proposal votes:', err instanceof Error ? err.message : err);
  }

  return stats;
}

/**
  Submits a user is vote for a proposal
  Uses an upsert mechanism based on the (proposal_id, fingerprint_id) unique constraint*/
export async function submitVote(proposalId: string, fingerprintId: string, voteType: VoteType): Promise<void> {
  try {
    if (voteType === null) {
      // If voteType is null, the user is removing their vote
      const { error } = await supabase
        .from('votes_log')
        .delete()
        .eq('proposal_id', proposalId)
        .eq('fingerprint_id', fingerprintId);

      if (error) {
        console.error('[VoteService] Failed to delete vote:', error.message);
      }
    } else {
      // Insert or update the user's vote
      const { error } = await supabase
        .from('votes_log')
        .upsert(
          {
            proposal_id: proposalId,
            fingerprint_id: fingerprintId,
            vote_type: voteType
          },
          { onConflict: 'proposal_id, fingerprint_id' }
        );

      if (error) {
        console.error('[VoteService] Failed to submit vote:', error.message);
      }
    }
  } catch (err) {
    console.error('[VoteService] Unexpected error submitting vote:', err instanceof Error ? err.message : err);
  }
}
