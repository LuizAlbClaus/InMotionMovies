import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaseContent } from "@/components/CaseContent";
import { cases, getCase } from "@/lib/cases";

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return { title: "Case | InMotion Movies" };
  return {
    title: `${c.client} — ${c.title} | InMotion Movies`,
    description: c.summary,
    openGraph: {
      title: `${c.client} — ${c.title} | InMotion Movies`,
      description: c.summary,
      type: "article",
      locale: "pt_BR",
      images: [{ url: c.poster }],
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1 w-full flex flex-col bg-ink-base">
        <CaseContent caseStudy={c} />
      </main>
      <Footer />
    </>
  );
}
