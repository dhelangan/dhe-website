"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Carousel from "./Carousel";
import LazyImage from "./LazyImage";
import Portal from "./Portal";

import type { TeamLink, TeamMember } from "@/lib/team";

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
      <div key={`team-slide-${chunkIndex}`} className="p-4 bg-[#d3d3d3] dark:bg-[#211f27]">
        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4">
          {chunk.map((member) => (
            
            <div
                        key={member.name}
                        className=""
                      >
                        <button
                            type="button"
                            onClick={() => setModal({ open: true, member })}
                            className="group p-4 w-full overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-sm transition-colors hover:bg-black/[.03] dark:border-white/10"
                            >
                        <div className="mb-5 grid gap-3">
                          {member.division?.length ? (
                            <div className="flex gap-2 ">
                              {member.division.map((division) => (
                                <span
                                  key={division}
                                  className="inline-flex text-center rounded-full border border-black/10 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-700 dark:border-white/10 dark:text-zinc-200"
                                >
                                  {division}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="block space-y-4 mx-auto items-center gap-4">
                          <div className="mx-auto relative size-25 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
                            <LazyImage
                              src={member.imageSrc}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                              loading="lazy"
                            />
                          </div>
                          <div className="text-center">
                            <div className="truncate font-semibold tracking-tight">{member.name}</div>
                            <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">{member.role}</div>
                          </div>
                        </div>
            
                        {member.highlights?.length ? (
                          <ul className="mt-4 grid gap-3 text-xs text-zinc-800 dark:text-zinc-200 border-t-1 border-black/10 pt-4 dark:border-white/10">
                            {member.highlights.slice(0, 3).map((h) => (
                              <li key={h} className="flex gap-2">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-orange" />
                                <span className="line-clamp-2 font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-200">{h}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        </button>
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
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!modal.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal.open, onClose]);

  useEffect(() => {
    if (!modal.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal.open]);

  useEffect(() => {
    if (!modal.open) return;
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [modal.open]);

  if (!modal.open) return null;

  const { member } = modal;
  const socialLinks = (member.links ?? []).filter((l) => isSocialLink(l));
  const otherLinks = (member.links ?? []).filter((l) => !isSocialLink(l));

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-black/10 bg-surface shadow-xl dark:border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  
                
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/[.06] dark:border-white/10 dark:bg-white/[.06]">
                    <LazyImage
                      src={member.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold tracking-tight">{member.name}</div>
                    <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">{member.role}</div>
                  </div>
                </div>
    
                <button
                  type="button"
                  ref={closeButtonRef}
                  className="touch-manipulation inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-accent-orange px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.06]"
                  onClick={onClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
</svg>
                </button>
              </div>
    
              <div className="mt-5 grid gap-3">
                {member.division?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {member.division.map((division) => (
                      <span
                        key={division}
                        className="inline-flex items-center rounded-full border border-black/10 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-700 dark:border-white/10 dark:text-zinc-200"
                      >
                        {division}
                      </span>
                    ))}
                  </div>
                ) : null}
    
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
    
              {socialLinks.length ? (
                <div className="rounded-2xl mt-4 border border-black/10 bg-background p-4 text-sm dark:border-white/10">
                  <div className="font-semibold tracking-tight">Social</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {socialLinks.map((teamLink) => (
                      <Link
                        key={`${member.name}-${teamLink.href}-${teamLink.label}`}
                        href={teamLink.href}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent-orange px-5 text-sm font-semibold text-black transition-colors hover:bg-[#ff6f10]"
                        onClick={onClose}
                      >
                        <LinkIcon label={teamLink.label} href={teamLink.href} />
                        <span>{teamLink.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
    
              {otherLinks.length ? (
                <div className="rounded-2xl mt-3 border border-black/10 bg-background p-4 text-sm dark:border-white/10">
                  <div className="font-semibold tracking-tight">Links</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {otherLinks.map((teamLink) => (
                      <Link
                        key={`${member.name}-${teamLink.href}-${teamLink.label}`}
                        href={teamLink.href}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-background px-5 text-sm font-semibold text-black transition-colors hover:bg-black/[.04] dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/[.06]"
                        onClick={onClose}
                      >
                        <LinkIcon label={teamLink.label} href={teamLink.href} />
                        <span>{teamLink.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
    
            </div>
          </div>
        </div>
      </Portal>
  );
}

function isSocialLink(teamLink: TeamLink): boolean {
  const label = teamLink.label.toLowerCase();
  const href = teamLink.href.toLowerCase();
  if (href.startsWith("mailto:")) return true;

  return (
    label.includes("instagram") ||
    label === "x" ||
    label.includes("twitter") ||
    label.includes("linkedin") ||
    label.includes("facebook") ||
    label.includes("tiktok") ||
    label.includes("youtube") ||
    label.includes("discord")
  );
}

function LinkIcon({ label, href }: { label: string; href: string }) {
  const l = label.toLowerCase();
  const h = href.toLowerCase();

  if (l.includes("email") || h.startsWith("mailto:")) return <EnvelopeIcon />;
  if (l.includes("instagram")) return <InstagramIcon />;
  if (l === "x" || l.includes("twitter") || h.includes("x.com") || h.includes("twitter.com")) return <XIcon />;
  if (l.includes("linkedin") || h.includes("linkedin.com")) return <LinkedInIcon />;

  return <GlobeIcon />;
}

function EnvelopeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16v16H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l16 16" />
      <path d="M20 4 4 20" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2a4 4 0 0 1 2-3z" />
      <path d="M2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
