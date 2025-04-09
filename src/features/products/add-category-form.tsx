import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addCategorySchema } from "./schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addCategory, editCategory, getCategory } from "./api";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

function AddCategoryForm({
  close,
  success,
  type,
  id,
}: {
  close(): void;
  success(): void;
  type?: string;
  id?: number;
}) {
  const { t , i18n } = useTranslation();
  const [imageName, setImageName] = useState("");
  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
  });

  function onSubmit(data: z.infer<typeof addCategorySchema>) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }
    if (type === "add") {
      addCategory(formData).then(() => {
        toast.success(t("category_added"));
        success();
      }).catch((err) => {
        toast.error(err.response.data.error.message || err.response?.data || err.message);
      });
    }
    if (type === "edit") {
      if (id !== undefined) {
        formData.append("_method", "Patch");
        editCategory(formData, id).then(() => {
          toast.success(t("category_updated"));
          success();
          refetchCategory()
        }).catch((err) => {
          toast.error(err.response.data.error.message || err.response?.data || err.message);
        });
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      form.setValue("image", file);
    }
  };

  const {
    data: category,
    isSuccess: successfull,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: ["getCategory", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (id === undefined || id === null) {
        return;
      }
      return getCategory(Number(id));
    },
  });

  useEffect(() => {
    if (type !== "add" && successfull) {
      form.setValue("name", category?.data.data.name);
      setImageName(category?.data.data.image.slice(22));
    }
  }, [type, successfull, form, category]);

  return (
    <Form {...form}>
      <form className="pb-4" onSubmit={form.handleSubmit(onSubmit)} dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div>
          <div className="flex justify-between pt-5">
            <div className="grid gap-2 w-full">
              <Label className="font-normal text-md">{t("category_name")}</Label>
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl {...field}>
                      <Input
                        id="name"
                        placeholder={t("category_name")}
                        disabled={type === "view"}
                        required
                        className="rounded-2xl border-[#595959] py-6 focus-visible:ring-0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Label className="font-normal text-md inline-block pt-5">{t("categoryImage")}</Label>
          <div className="border p-2 rounded-xl mt-4 flex justify-between items-center">
            <div className="py-2">
              <label
                htmlFor="image"
                className={`px-6 cursor-pointer py-2 ${
                  type === "view" ? "bg-primary/20" : "bg-primary"
                } text-white rounded-lg`}
                onClick={(e) => type === "view" && e.preventDefault()}
              >
                {t("upload")}
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <h2 className="text-[#CDCFCE] font-medium text-base">
              {imageName || t("choose_image")}
            </h2>
          </div>
          <div
            className={`${
              type === "view" && "hidden"
            } pt-9 flex justify-between`}
          >
            <Button
              type="submit"
              className="w-[48%] rounded-lg hover:bg-white border border-primary hover:text-primary"
            >
              {type == "add" ? t("add") : t("edit")}
            </Button>

            <Button
              onClick={() => close()}
              type="button"
              className="w-[48%] rounded-lg bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default AddCategoryForm;