import { supabase } from './supabase';

export type VoteType = 'up' | 'down' | null;

export interface VoteStats {
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
}

// Retrieves the current total votes for a proposal and the user's specific vote in parallel
export async function getProposalVotes(proposalId: string, fingerprintId: string): Promise<VoteStats> {
  const stats: VoteStats = { upvotes: 0, downvotes: 0, userVote: null };

  try {
    // Run both queries concurrently to minimize latency
    const [summaryRes, userVoteRes] = await Promise.all([
      supabase
        .from('proposal_votes_summary')
        .select('upvotes, downvotes')
        .eq('proposal_id', proposalId)
        .maybeSingle(),
      fingerprintId
        ? supabase
            .from('votes_log')
            .select('vote_type')
            .eq('proposal_id', proposalId)
            .eq('fingerprint_id', fingerprintId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null })
    ]);

    if (summaryRes.error) {
      console.error('[VoteService] Failed to load vote summary:', summaryRes.error.message);
    } else if (summaryRes.data) {
      stats.upvotes = summaryRes.data.upvotes || 0;
      stats.downvotes = summaryRes.data.downvotes || 0;
    }

    if (userVoteRes.error) {
      console.error('[VoteService] Failed to load user vote:', userVoteRes.error.message);
    } else if (userVoteRes.data) {
      stats.userVote = userVoteRes.data.vote_type as VoteType;
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
