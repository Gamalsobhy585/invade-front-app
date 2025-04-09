import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addBrandSchema } from "./schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { addBrand, editBrand, getBrand } from "./api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "@/components/loader";

function AddBrandForm({
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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const form = useForm<z.infer<typeof addBrandSchema>>({
    resolver: zodResolver(addBrandSchema),
  });

  function onSubmit(data: z.infer<typeof addBrandSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }
    if (type === "add") {
      addBrand(formData).then(() => {
        toast.success(t("brand_added"));
        success();
      }).finally(() => {
        setLoading(false);
      }).catch((err) => {
        toast.error(err.response.data.error.message || err.response?.data || err.message);
      });
    }
    if (type === "edit") {
      if (id !== undefined) {
        formData.append("_method", "Patch");
        editBrand(formData, id).then(() => {
          toast.success(t("brand_updated"));
          success();
          refetchBrand();
        }).finally(() => {
          setLoading(false);
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
    data: brand,
    isSuccess: successfull,
    refetch: refetchBrand,
  } = useQuery({
    queryKey: ["getBrand", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (id === undefined || id === null) {
        return;
      }
      return getBrand(Number(id));
    },
  });

  useEffect(() => {
    if (type !== "add" && successfull) {
      form.setValue("name", brand?.data.data.name);
      setImageName(brand?.data.data.image.slice(22));
    }
  }, [type, successfull, form, brand]);

  return (
    <>
      {type == "add" || brand ? (
        <Form {...form}>
          <form
            className=" pt-6 pb-4"
            onSubmit={form.handleSubmit(onSubmit)}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <div>
              <div className="flex justify-between pt-5">
                <div className="grid gap-2 w-full">
                  <Label className="font-normal text-md">
                    {t("brand_name")}
                  </Label>
                  <FormField
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl {...field}>
                          <Input
                            id="name"
                            disabled={type === "view"}
                            placeholder={t("brand_name")}
                            required
                            className="rounded-2xl border-[#595959] py-6 focus-visible:ring-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Label className="font-normal text-md inline-block pt-5">{t("brandImage")}</Label>
              <div className="border p-2 rounded-xl mt-4 flex justify-between items-center">
                <div className="pb-2">
                  <label
                    htmlFor="image"
                    className={`px-6 cursor-pointer py-2 ${
                      type === "view" ? "bg-primary/20" : "bg-primary"
                    } text-white rounded-lg`}
                    onClick={(e) => type === "view" && e.preventDefault()}
                  >
                    {t("upload")}
                  </label>
                  <input
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
                  disabled={loading}
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
      ) : (
        <Loader size="w-24 h-24" color="border-t-primary" />
      )}
    </>
  );
}

export default AddBrandForm;
