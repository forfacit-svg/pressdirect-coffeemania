import { notFound } from "next/navigation";
import { IntegrationPage } from "@/components/integration-page";
import { integrations } from "@/content/integrations";
export function generateStaticParams() {
  return integrations.map((x) => ({ slug: x.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = integrations.find((x) => x.slug === slug);
  return { title: x?.title, description: x?.description };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = integrations.find((x) => x.slug === slug);
  if (!item) notFound();
  return <IntegrationPage item={item} />;
}
