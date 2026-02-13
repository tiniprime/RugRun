import { clusterApiUrl } from "@solana/web3.js";

const DEFAULT_TOKEN_MINT = "BxThE9mZyYCgHuaCSKw5Az4pUzhspUcG8fiYr4AWpump";
const LS_TOKEN_KEY = "grq_token_mint";

export function getTokenMint(): string {
  try {
    return localStorage.getItem(LS_TOKEN_KEY) || DEFAULT_TOKEN_MINT;
  } catch {
    return DEFAULT_TOKEN_MINT;
  }
}

export function setTokenMint(mint: string): void {
  try {
    if (mint && mint.trim().length > 0) {
      localStorage.setItem(LS_TOKEN_KEY, mint.trim());
    } else {
      localStorage.removeItem(LS_TOKEN_KEY);
    }
  } catch { /* ignore */ }
}

export function getSolscanUrl(): string {
  return `https://solscan.io/token/${getTokenMint()}`;
}

export function getDexscreenerUrl(): string {
  return `https://dexscreener.com/solana/${getTokenMint()}`;
}

export const X_COMMUNITY_URL = "https://x.com/i/communities/2021322872828878918";

export function getRpcEndpoint(): string {
  return import.meta.env.VITE_SOLANA_RPC || "https://rpc.ankr.com/solana";
}
