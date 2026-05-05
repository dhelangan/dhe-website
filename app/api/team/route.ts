import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parseJsonIfString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed.length === 0) return value;
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function asStringArray(value: unknown): string[] | undefined {
  value = parseJsonIfString(value);
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item) => typeof item === "string") as string[];
  return strings.length ? strings : undefined;
}

function asStringArrayLoose(value: unknown): string[] | undefined {
  const array = asStringArray(value);
  if (array) return array;

  const str = asString(value);
  if (!str) return undefined;

  const parts = str
    .split(/[\n,]/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.length ? parts : undefined;
}

type TeamApiMember = {
  id?: string;
  active?: boolean;
  name: string;
  role: string;
  imageSrc: string | null;
  bio?: string;
  highlights?: string[];
  links?: string[];
  division?: string[];
};

function toTeamApiMember(row: UnknownRecord): TeamApiMember | null {
  const id = asString(row.id);
  const active = asBoolean(row.active);
  const name = asString(row.name ?? row.full_name ?? row.display_name);
  const role = asString(row.role ?? row.title ?? row.position);
  const imageSrc = asString(row.imageSrc ?? row.image_src ?? row.avatar_url ?? row.photo_url) ?? null;

  if (!name || !role) return null;

  const highlights = asStringArray(row.highlights);
  const links = asStringArrayLoose(row.links);
  const division = asStringArrayLoose(row.division ?? row.divisions ?? row.department ?? row.departments);
  const bio = asString(row.bio ?? row.about);

  return { id, active, name, role, imageSrc, bio, highlights, links, division };
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.from("team").select("*").eq("active", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const members = (data ?? [])
    .map((row) => toTeamApiMember(row as UnknownRecord))
    .filter((member): member is TeamApiMember => Boolean(member));

  return NextResponse.json(members);
}
