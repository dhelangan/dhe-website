import Link from "next/link";
import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Blog",
};

const posts = [
  {
    title: "Balancing First Turns",
    excerpt: "A playtest-driven approach to opening momentum.",
    href: "/blog",
    tag: "Board",
  },
  {
    title: "Controller Feel Checklist",
    excerpt: "Input buffering, anticipation, and moment-to-moment juice.",
    href: "/blog",
    tag: "Digital",
  },
  {
    title: "Onboarding That Teaches",
    excerpt: "Designing tutorials and rulebooks that respect players.",
    href: "/blog",
    tag: "UX",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10">
          <PageHeader
            title="Blog"
            description="Notes from the studio: playtests, production tips, and behind-the-scenes progress."
          />

          <div className="grid gap-4">
            {posts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className="rounded-3xl border border-black/10 bg-surface p-7 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10  dark:hover:bg-zinc-900/30"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight">{post.title}</h2>
                  <span className="rounded-full border border-black/10 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
                    {post.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


