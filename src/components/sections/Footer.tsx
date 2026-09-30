import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SocialPill } from "@/components/ui/SocialPill";
import { navLinks, profile, socials } from "@/content/profile";

export function Footer() {
  return (
    <footer className="relative border-t border-line pt-16 pb-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-start lg:gap-16">
          <div>
            <Link href="/" className="type-label text-[15px] font-bold">
              {profile.wordmark.split(".")[0]}
              <span className="text-accent">.</span>
              {profile.wordmark.split(".")[1]}
            </Link>
            <p className="type-label mt-3 text-muted">
              {profile.role} · {profile.location}
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={`/${l.href}`} className="type-label text-muted transition-colors hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-2" aria-label="Links">
            {socials.map((s) => (
              <li key={s.label}>
                <SocialPill link={s} />
              </li>
            ))}
          </ul>
        </div>
        <div className="type-label mt-14 flex flex-col gap-2 text-[12px] text-muted sm:flex-row sm:justify-between">
          <p>Designed &amp; built by {profile.shortName}</p>
          <p>Powered by Next.js &amp; Three.js</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </Container>
    </footer>
  );
}
