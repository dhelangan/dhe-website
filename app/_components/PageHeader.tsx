type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className={`banner ${title.replace(/\s+/g, '-').toLowerCase()} grid gap-2 px-4 lg:h-[15vw] md:h-[20vw] sm:h-[30vw] h-[15vw] items-end`}>
      <div className="mx-auto w-full h-full max-w-6xl">
      <h1 className="tracking-tight font-extrabold text-background absolute bottom-[-5px] text-5xl lg:bottom-[-11px] md:bottom-[-7px] sm:bottom-[-5px] lg:text-8xl md:text-6xl sm:text-5xl">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {description}
        </p>
      ) : null}
      </div>
    </header>
  );
}
