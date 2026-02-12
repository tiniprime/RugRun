import { X_COMMUNITY_URL } from "../lib/solana";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-50">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-black text-xs font-black">
              $
            </span>
            <span className="font-bold text-gradient">GetRichQuick</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href={X_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors"
              aria-label="Join our X Community"
            >
              X Community
            </a>
            <a
              href="https://t.me/RugRun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors"
              aria-label="Join our Telegram"
            >
              Telegram
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GetRichQuick. All rights reserved.
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-700 max-w-xl mx-auto leading-relaxed">
          GetRichQuick is a community project on Solana. Stack bags, not regrets.
          Nothing on this site constitutes financial advice. Always DYOR. No pishman here.
        </p>
      </div>
    </footer>
  );
}
