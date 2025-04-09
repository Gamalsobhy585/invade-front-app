import { z } from "zod";
import i18next from "i18next";

const getMessage = (key: string) => i18next.t(key);

export const promocodeSchema = z.object({
  promo_code: z.string().min(1, getMessage("promocode_validation.promo_code_required")),
  percentage: z
    .number()
    .positive(getMessage("promocode_validation.percentage_positive"))
    .max(100, getMessage("promocode_validation.percentage_max")),
});
