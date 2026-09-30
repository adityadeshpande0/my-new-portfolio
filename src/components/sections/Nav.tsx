"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { SocialPill } from "@/components/ui/SocialPill";
import { navLinks, profile, socials } from "@/content/profile";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160 && !open);
  });

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  const goMobile = (hash: string) => {
    setOpen(false);
    if (!onHome) return;
    requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -64 });
      else el.scrollIntoView();
    });
  };

  return (
    <>
      <m.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
          scrolled && !open ? "border-b border-line bg-bg/70 backdrop-blur-[12px]" : "border-b border-transparent",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[var(--container)] items-center justify-between px-[var(--gutter)]"
        >
          <Link
            href="/"
            className="type-label text-[15px] font-bold tracking-tight"
            aria-label={`${profile.shortName} — home`}
          >
            {profile.wordmark.split(".")[0]}
            <span className="text-accent">.</span>
            {profile.wordmark.split(".")[1]}
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={hrefFor(l.href)}
                  className="type-label group relative flex items-baseline gap-1.5 rounded-pill px-4 py-2 text-muted transition-colors hover:text-text"
                >
                  <span className="text-[10px] text-accent/80">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </nav>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-[var(--gutter)] pt-28 pb-10 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 42px) 32px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 42px) 32px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 42px) 32px)" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <m.a
                    href={hrefFor(l.href)}
                    onClick={(e) => {
                      if (onHome) e.preventDefault();
                      goMobile(l.href);
                    }}
                    className="type-h2 flex items-baseline gap-4"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
                  >
                    <span className="type-label text-accent">0{i + 1}</span>
                    {l.label}
                  </m.a>
                </li>
              ))}
            </ul>
            <m.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {socials.map((s) => (
                <SocialPill key={s.label} link={s} />
              ))}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
