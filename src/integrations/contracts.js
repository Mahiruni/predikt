// Predikt integration contracts
// These adapters intentionally contain no database schema assumptions.
// Replace each mock implementation when your backend/database schemas are ready.

export const adapters = {
  auth: {
    signIn: async ({ phone, email }) => ({ ok: true, user: { id: 'demo-user', phone, email } }),
    verifyOtp: async ({ code }) => ({ ok: code?.length >= 4 }),
    signOut: async () => ({ ok: true }),
  },
  kyc: {
    submit: async ({ fullName, dob, idType, idNumber }) => ({
      ok: true,
      status: 'pending',
      reference: `KYC-${Date.now()}`,
      payload: { fullName, dob, idType, idNumber },
    }),
    getStatus: async () => ({ status: 'not_started' }),
  },
  fixtures: {
    list: async () => ({ source: 'mock', fixtures: [] }),
    results: async () => ({ source: 'mock', results: [] }),
  },
  odds: {
    listMarkets: async () => ({ source: 'sandbox', markets: [] }),
  },
  wallet: {
    getBalance: async () => ({ currency: 'ETB', available: 1250, sandbox: true }),
    listLedger: async () => ({ entries: [] }),
    createDepositIntent: async ({ method, amount, asset, network }) => ({
      status: 'sandbox',
      reference: `DEMO-${Date.now()}`,
      method,
      amount,
      asset,
      network,
    }),
  },
  notifications: {
    list: async () => ({ items: [] }),
    markRead: async () => ({ ok: true }),
  },
  admin: {
    dashboard: async () => ({
      users: 18402,
      activeToday: 2318,
      flaggedAccounts: 7,
      pendingKyc: 19,
      sandboxVolumeEtb: 386450,
    }),
  },
};
