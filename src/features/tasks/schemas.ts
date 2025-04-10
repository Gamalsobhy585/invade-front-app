import { z } from "zod";
import i18next from "i18next";

const getMessage = (key: string) => i18next.t(key);

export const taskSchema = z.object({
  promo_code: z.string().min(1, getMessage("task_validation.promo_code_required")),
  percentage: z
    .number()
    .positive(getMessage("task_validation.percentage_positive"))
    .max(100, getMessage("task_validation.percentage_max")),
});
