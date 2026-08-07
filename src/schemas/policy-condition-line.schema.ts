import { z } from "zod";

const lineText = () => z.string().optional().nullable();
const lineNumber = () => z.coerce.number().optional().nullable();
const lineBool = () => z.boolean().optional().nullable();

export const policyConditionLineSchema = z.object({
  policy_condition_header_id: z.string().uuid("Selecciona una cabecera de condicion."),
  coverage_type_id: z.string().uuid().optional().nullable(),
  service_group_id: z.string().uuid().optional().nullable(),
  service_subgroup_id: z.string().uuid().optional().nullable(),
  service_item_id: z.string().uuid().optional().nullable(),
  classification: lineText(),
  status: lineText(),
  sub_policy: lineText(),
  sub_endorsement: lineText(),
  associated_balance: lineText(),
  catastrophic: lineBool(),
  cat_extension: lineText(),
  branch: lineText(),
  fld: lineNumber(),
  fsl: lineNumber(),
  free_doctor: lineBool(),
  franchise: lineNumber(),
  imed_range: lineText(),
  medipass_range: lineText(),
  web_reimbursement_range: lineText(),
  financier_range: lineText(),
  premium_currency: lineText(),
  capita: lineNumber(),
  premium: lineNumber(),
  loads: lineNumber(),
  evaluate_by: lineText(),
  isapre_bm_amount: lineNumber(),
  isapre_bm_percentage: lineNumber(),
  isapre_bm_code: lineText(),
  fonasa_bm_amount: lineNumber(),
  fonasa_bm_percentage: lineNumber(),
  fonasa_bm_code: lineText(),
  pharmacy_limit: lineNumber(),
  preferential_provider: lineBool(),
  limit_and_deductible: lineText(),
  is_active: z.boolean().default(true),
});

export type PolicyConditionLineInput = z.input<typeof policyConditionLineSchema>;
