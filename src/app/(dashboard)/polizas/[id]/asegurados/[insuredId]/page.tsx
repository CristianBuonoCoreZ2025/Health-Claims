import { InsuredDetailPage } from "@/modules/polizas/policies/insured-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; insuredId: string }>;
}) {
  const { id, insuredId } = await params;
  return <InsuredDetailPage policyId={id} insuredId={insuredId} />;
}
