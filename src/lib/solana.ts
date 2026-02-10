import { clusterApiUrl } from "@solana/web3.js";

export const TOKEN_MINT = "PASTE_TOKEN_ADDRESS_HERE";

export const SOLSCAN_TOKEN_URL = `https://solscan.io/token/${TOKEN_MINT}`;
export const DEXSCREENER_URL = `https://dexscreener.com/solana/${TOKEN_MINT}`;

export function getRpcEndpoint(): string {
  return import.meta.env.VITE_SOLANA_RPC || clusterApiUrl("mainnet-beta");
}
