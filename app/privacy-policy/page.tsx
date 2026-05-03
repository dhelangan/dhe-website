import PageHeader from "../_components/PageHeader";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <div className="grid gap-8">
          <PageHeader
            title="Privacy Policy"
            description="This is a starter policy page. Replace it with your legal text."
          />

          <div className="prose max-w-full break-words overflow-hidden rounded-3xl border border-black/10 bg-surface p-8 text-sm leading-7 text-zinc-700 shadow-sm dark:border-white/10 dark:text-zinc-300">
            <h2>Overview</h2>
            <p>
              We only collect the minimum information needed to respond to
              messages and improve the site.
            </p>
            <h2>Contact</h2>
            <p>If you have questions, email hello@dhelangan.studio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}



