import fpPromise from '@fingerprintjs/fingerprintjs';

// Singleton instance of the FingerprintJS agent
let fingerprintAgent: any = null;

/**
  Initializes and retrieves the unique browser fingerprint ID
  @returns {Promise<string>} The unique visitor ID
 */
export async function getFingerprintId(): Promise<string> {
  try {
    // Check localStorage cache first for 0ms instant retrieval
    if (typeof window !== 'undefined') {
      const cachedId = localStorage.getItem('hd_fp_visitor_id');
      if (cachedId) {
        return cachedId;
      }
    }

    if (!fingerprintAgent) {
      fingerprintAgent = await fpPromise.load();
    }
    const result = await fingerprintAgent.get();
    const visitorId = result.visitorId;

    if (typeof window !== 'undefined' && visitorId) {
      localStorage.setItem('hd_fp_visitor_id', visitorId);
    }

    return visitorId;
  } catch (error) {
    console.warn('[Fingerprint] Could not generate browser fingerprint, using fallback token:', error instanceof Error ? error.message : error);
    // Fallback ID if fingerprinting fails (e.g. strict privacy blockers)
    return 'fallback-' + Math.random().toString(36).substring(2, 15);
  }
}
