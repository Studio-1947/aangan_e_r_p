import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passcode } = req.body;
  const MASTER_PASS = process.env.GATE_PASS || "aangan2024";

  if (passcode === MASTER_PASS) {
    // Set cookie via header since we're in a serverless function
    res.setHeader('Set-Cookie', `lokmap_gate=${MASTER_PASS}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, error: "Invalid Passcode. Access Denied." });
}
