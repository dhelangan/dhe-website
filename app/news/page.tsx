import { redirect } from "next/navigation";

export const metadata = {
  title: "News",
};

export default function NewsIndexPage() {
  redirect("/news/page/1");
}

