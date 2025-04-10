import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { taskSchema} from "./schemas";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { z } from "zod";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { toast } from "react-toastify";
  import { Task } from "./type";
  import { useEffect } from "react";
  import { useTranslation } from "react-i18next";

  
  interface AddTaskProps {
    onAdd?: (task: z.infer<typeof taskSchema>) => void; 
    onSubmit?: (task: z.infer<typeof taskSchema>) => void;
    onShow?: (params: { id: string }) => void;
    isViewMode?: boolean;
    isEditMode?: boolean;
    initialData?: Task | null;
  }
  export function AddTask({ onAdd, onSubmit, 
    isViewMode = false, 
    isEditMode = false, 
    initialData  }: AddTaskProps) {
      const { t, i18n } = useTranslation();
      const isRTL = i18n.language === "ar";

      const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(isEditMode ? taskSchema : taskSchema),
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
  
      async function onSubmitHandler(values: z.infer<typeof taskSchema>) {
        try {
          if (isEditMode && onSubmit) {
            await onSubmit(values);
          } else if (onAdd) {
            await onAdd(values);
          }
          toast.success(`Task ${isEditMode ? 'updated' : 'added'} successfully`);
          if (!isEditMode) form.reset();
        } catch (error) {
          toast.error((error as Error).message);
        }
      }

    return (
      <Form {...form} >
  <form className="space-y-2 mt-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
    {/* Task Field */}
    <FormField
  name="promo_code"
  control={form.control}
  render={({ field }) => (
    <FormItem className={`${isRTL ? "text-right" : "text-left"} w-full`}>
      <FormLabel className="w-full block">
        {t("task.promo_code_label")}
      </FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder={t("task.promo_code_placeholder")}
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
        {t("task.percentage_label")}
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder={t("task.percentage_placeholder")}
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
        {isEditMode ? t("task.update_button") : t("task.add_button")}
      </Button>
    )}
  </form>
      </Form>

    );
  }