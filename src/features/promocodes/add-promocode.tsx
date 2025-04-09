import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { promocodeSchema} from "./schemas";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { z } from "zod";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { toast } from "react-toastify";
  import { Promocode } from "./type";
  import { useEffect } from "react";
  import { useTranslation } from "react-i18next";

  
  interface AddPromocodeProps {
    onAdd?: (promocode: z.infer<typeof promocodeSchema>) => void; 
    onSubmit?: (promocode: z.infer<typeof promocodeSchema>) => void;
    onShow?: (params: { id: string }) => void;
    isViewMode?: boolean;
    isEditMode?: boolean;
    initialData?: Promocode | null;
  }
  export function AddPromocode({ onAdd, onSubmit, 
    isViewMode = false, 
    isEditMode = false, 
    initialData  }: AddPromocodeProps) {
      const { t, i18n } = useTranslation();
      const isRTL = i18n.language === "ar";

      const form = useForm<z.infer<typeof promocodeSchema>>({
        resolver: zodResolver(isEditMode ? promocodeSchema : promocodeSchema),
        defaultValues: {
          promo_code: initialData?.promo_code || "",
          percentage: initialData?.percentage || 0,
        },
      });
    
      useEffect(() => {
        if (initialData) {
          form.reset({
            promo_code: initialData.promo_code,
            percentage: parseFloat(String(initialData.percentage)),
          });
        }
      }, [initialData, form]);
  
      async function onSubmitHandler(values: z.infer<typeof promocodeSchema>) {
        try {
          if (isEditMode && onSubmit) {
            await onSubmit(values);
          } else if (onAdd) {
            await onAdd(values);
          }
          toast.success(`Promocode ${isEditMode ? 'updated' : 'added'} successfully`);
          if (!isEditMode) form.reset();
        } catch (error) {
          toast.error((error as Error).message);
        }
      }

    return (
      <Form {...form} >
  <form className="space-y-2 mt-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
    {/* Promocode Field */}
    <FormField
  name="promo_code"
  control={form.control}
  render={({ field }) => (
    <FormItem className={`${isRTL ? "text-right" : "text-left"} w-full`}>
      <FormLabel className="w-full block">
        {t("promocode.promo_code_label")}
      </FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder={t("promocode.promo_code_placeholder")}
          className={`w-full rounded-lg py-6 ${isRTL ? "text-right" : "text-left"}`}
          disabled={isViewMode}
          dir={isRTL ? "rtl" : "ltr"}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

    {/* Percentage Field */}
    <FormField
  name="percentage"
  control={form.control}
  render={({ field }) => (
    <FormItem className={`${isRTL ? "text-right" : "text-left"} w-full`}>
      <FormLabel className="w-full block">
        {t("promocode.percentage_label")}
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder={t("promocode.percentage_placeholder")}
          className={`w-full rounded-lg py-6 ${isRTL ? "text-right" : "text-left"}`}
          disabled={isViewMode}
          dir={isRTL ? "rtl" : "ltr"}
          onFocus={(e) => e.target.select()}
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

    {/* Submit Button */}
    {!isViewMode && (
      <Button type="submit" className="mt-4">
        {isEditMode ? t("promocode.update_button") : t("promocode.add_button")}
      </Button>
    )}
  </form>
      </Form>

    );
  }