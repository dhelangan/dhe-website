type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="grid gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {description}
        </p>
      ) : null}
    </header>
  );
}
