import { useState } from "react";
import { X_COMMUNITY_URL } from "../lib/solana";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Buy", href: "#buy" },
  { label: "Rewards", href: "#rewards" },
  { label: "Token", href: "#token" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="section-container flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-black text-sm font-black">
            $
          </span>
          <span className="text-gradient">GetRichQuick</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Wallet + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={X_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-2 text-xs font-semibold text-brand-400 hover:bg-brand-500/20 transition-colors"
          >
            Join X Community
          </a>
          <div className="hidden sm:block">
            <WalletMultiButton className="!rounded-xl !bg-brand-500 !text-black !font-semibold !text-sm !h-10" />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-surface/95 backdrop-blur-xl pb-4">
          <div className="section-container flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-white hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href={X_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-2.5 text-xs font-semibold text-brand-400 hover:bg-brand-500/20 transition-colors"
            >
              Join X Community
            </a>
            <div className="pt-2 sm:hidden">
              <WalletMultiButton className="!rounded-xl !bg-brand-500 !text-black !font-semibold !text-sm !h-10 !w-full !justify-center" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
