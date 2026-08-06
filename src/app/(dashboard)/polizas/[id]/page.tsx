import { PolicyDetailPage } from "@/modules/polizas/policies/policy-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PolicyDetailPage policyId={id} />;
}
