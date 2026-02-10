export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-50">
      <div className="section-container py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-black text-xs font-black">
              R
            </span>
            <span className="font-bold text-gradient">RugRun</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/RugRun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors"
              aria-label="Follow us on X"
            >
              X / Twitter
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
            &copy; {new Date().getFullYear()} RugRun. All rights reserved.
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-700 max-w-xl mx-auto leading-relaxed">
          RugRun is a community project built to raise awareness about rugpulls on Solana.
          Nothing on this site constitutes financial advice. Always DYOR. Stay safe out there.
        </p>
      </div>
    </footer>
  );
}
