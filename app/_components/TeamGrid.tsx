"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import type { TeamLink, TeamMember } from "@/lib/team";

type TeamGridProps = {
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

export default function TeamGrid({ members }: TeamGridProps) {
  const [modal, setModal] = useState<ModalState>({ open: false });

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <div
            key={member.name}
            className="rounded-3xl border border-black/10 bg-surface p-5 shadow-sm dark:border-white/10"
          >
            <div className="block space-y-4 mx-auto items-center gap-4">
              <div className="mx-auto relative size-25 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
                <Image src={member.imageSrc} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="text-center">
                <div className="truncate font-semibold tracking-tight">{member.name}</div>
                <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">{member.role}</div>
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
              {/* {(member.links ?? []).map((link) => (
                <button
                  key={`${member.name}-${link.href}-${link.label}`}
                  type="button"
                  className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full bg-accent-orange px-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                  onClick={() => setModal({ open: true, member, link })}
                >
                  {link.label}
                </button>
              ))} */}

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
                <Image src={member.imageSrc} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold tracking-tight">{member.name}</div>
                <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">{member.role}</div>
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
            {member.bio ? (
              <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200">{member.bio}</p>
            ) : null}

            {member.highlights?.length ? (
              <ul className="grid gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                {member.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-orange" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div  className="rounded-2xl mt-4 border border-black/10 bg-background p-4 text-sm dark:border-white/10">
                <div className="font-semibold tracking-tight">Social</div>
                
                <div className="mt-3">
                   {(member.links ?? []).map((link) => (
                  <Link
                    key={`${member.name}-${link.href}-${link.label}`}
                    href={link.href}
                    className="inline-flex h-10 m-1 items-center justify-center rounded-full bg-accent-orange px-5 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                    onClick={onClose}
                  >
                    {link.detailTitle ?? link.label}
                  </Link>
              ))}
                </div>
              </div>

        </div>
      </div>
    </div>
  );
}

