import { ClaimDetailPage } from "@/modules/liquidacion/claims/claim-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClaimDetailPage claimId={id} />;
}
