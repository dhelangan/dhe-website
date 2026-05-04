"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Carousel from "./Carousel";

type TeamLink = {
  label: string;
  href: string;
  detailTitle?: string;
  detailBody?: string;
};

type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  bio?: string;
  highlights?: string[];
  links?: TeamLink[];
};

type TeamCarouselProps = {
  members: TeamMember[];
};

type ModalState =
  | {
      open: false;
    }
  | {
      open: true;
      member: TeamMember;
      link?: TeamLink;
    };

export default function TeamCarousel({ members }: TeamCarouselProps) {
  const [modal, setModal] = useState<ModalState>({ open: false });

  const slides = useMemo(() => {
    const chunkSize = 4;
    const chunks: TeamMember[][] = [];
    for (let i = 0; i < members.length; i += chunkSize) {
      chunks.push(members.slice(i, i + chunkSize));
    }

    return chunks.map((chunk, chunkIndex) => (
      <div key={`team-slide-${chunkIndex}`} className="p-6 sm:p-8">
        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4">
          {chunk.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-black/10 bg-surface p-5 shadow-sm dark:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
                  <Image
                    src={member.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold tracking-tight">
                    {member.name}
                  </div>
                  <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                    {member.role}
                  </div>
                </div>
              </div>

              {member.highlights?.length ? (
                <ul className="mt-4 grid gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                  {member.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-orange" />
                      <span className="line-clamp-2">{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {(member.links ?? []).map((link) => (
                  <button
                    key={`${member.name}-${link.href}-${link.label}`}
                    type="button"
                    className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                    onClick={() => setModal({ open: true, member, link })}
                  >
                    {link.label}
                  </button>
                ))}

                <button
                  type="button"
                  className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                  onClick={() => setModal({ open: true, member })}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  }, [members]);

  return (
    <>
      <Carousel label="Team members" slides={slides} />
      <MemberModal modal={modal} onClose={() => setModal({ open: false })} />
    </>
  );
}

function MemberModal({
  modal,
  onClose,
}: {
  modal: ModalState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!modal.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal.open, onClose]);

  if (!modal.open) return null;

  const { member, link } = modal;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-black/10 bg-surface shadow-xl dark:border-white/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
                <Image
                  src={member.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold tracking-tight">
                  {member.name}
                </div>
                <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {member.role}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-background px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {link ? (
              <div className="rounded-2xl border border-black/10 bg-background p-4 text-sm dark:border-white/10">
                <div className="font-semibold tracking-tight">
                  {link.detailTitle ?? link.label}
                </div>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {link.detailBody ??
                    "Details for this link can go here (role, responsibilities, credits, etc.)."}
                </p>
                <div className="mt-3">
                  <Link
                    href={link.href}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-accent-orange px-5 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                    onClick={onClose}
                  >
                    Open page
                  </Link>
                </div>
              </div>
            ) : null}

            {member.bio ? (
              <div className="rounded-2xl border border-black/10 bg-background p-4 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                {member.bio}
              </div>
            ) : null}

            {member.highlights?.length ? (
              <div className="rounded-2xl border border-black/10 bg-background p-4 dark:border-white/10">
                <div className="text-sm font-semibold tracking-tight">Highlights</div>
                <ul className="mt-2 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  {member.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-orange" />
                      <span className="break-words">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}




