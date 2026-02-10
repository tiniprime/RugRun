import { clusterApiUrl } from "@solana/web3.js";

export const TOKEN_MINT = "BxThE9mZyYCgHuaCSKw5Az4pUzhspUcG8fiYr4AWpump";

export const SOLSCAN_TOKEN_URL = `https://solscan.io/token/${TOKEN_MINT}`;
export const DEXSCREENER_URL = `https://dexscreener.com/solana/${TOKEN_MINT}`;
export const X_COMMUNITY_URL = "https://x.com/i/communities/2021322872828878918";

export function getRpcEndpoint(): string {
  return import.meta.env.VITE_SOLANA_RPC || clusterApiUrl("mainnet-beta");
}
