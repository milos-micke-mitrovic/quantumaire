import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/seo";

export default function Root() {
  redirect(`/${DEFAULT_LOCALE}`);
}
