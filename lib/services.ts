export type ServiceItem = {
  id: number;
  illustration?: string | null;
  category?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
};

export type ServicesApiResponse = {
  services: ServiceItem[];
  projects: unknown[];
  qna: unknown[];
  reviews: unknown[];
};

export function slugifyServiceTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

