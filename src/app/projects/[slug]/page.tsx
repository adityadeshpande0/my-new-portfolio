import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/components/sections/ProjectHero";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { Tag } from "@/components/ui/Tag";
import { projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary.replace(/\*/g, ""),
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const { default: Body } = await import(`@/content/projects/${slug}.mdx`);

  return (
    <article className="pt-32 pb-24 sm:pt-40">
      <Container>
        <Link
          href="/#projects"
          className="type-label inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> All projects
        </Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="type-label text-muted">
              …/<span className="text-text">Case study</span>… <span className="ml-2">{project.year}</span>
            </p>
            <h1 className="type-display mt-5 text-[clamp(40px,6.5vw,88px)]">{project.title}</h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-muted">
              <Emphasis text={project.summary} />
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
              {project.tags.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <ProjectHero slug={project.slug} motif={project.motif} />
        </div>
      </Container>

      <Container className="mt-24 sm:mt-32">
        <div className="mx-auto max-w-[44rem]">
          <Body />
        </div>
      </Container>

      <Container className="mt-24">
        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-center justify-between gap-6 rounded-card border border-line bg-bg-elevated p-6 transition-colors hover:border-line-strong sm:p-10"
        >
          <span>
            <span className="type-label text-muted">Next project</span>
            <span className="type-h2 mt-2 block text-[clamp(26px,4vw,44px)]">{next.title}</span>
          </span>
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-text-inverse transition-transform duration-500 ease-out-expo group-hover:rotate-45"
          >
            ↗
          </span>
        </Link>
      </Container>
    </article>
  );
}
