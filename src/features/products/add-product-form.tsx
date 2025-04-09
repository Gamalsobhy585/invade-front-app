import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addProductSchema } from "./schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  addAttachment,
  addProuduct,
  deleteAttachment,
  editProuduct,
  getBrands,
  getCategories,
  getProduct,
} from "./api";
import { toast } from "react-toastify";
import { Brands, Categories } from "../interfaces";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import Loader from "@/components/loader";

const BASE_URL = import.meta.env.VITE_BASE_Image_URL.replace(/\/+$/, "");

function AddProductForm({
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
  const [imageMessage , setImageMessages] = useState("")
  const [loading, setLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState<{ url: string; id: number }[]>([]);
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
  });
  function onSubmit(data: z.infer<typeof addProductSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.product);
    formData.append("category_id", data.category);
    formData.append("shipping_description", data.shipping_description);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("commercial_signs", data.brand);
    formData.append("quantity", data.quantity.toString());
    if (data.image_url) {
      formData.append("image", data.image_url[0]);
      data.image_url.forEach((file, index) => {
        formData.append(`image_url[${index}]`, file);
      });
    }
    if (type === "add") {
      if(data?.image_url?.length == 0 || !data.image_url ){
        setImageMessages("Required")
      }
      addProuduct(formData)
        .then(() => {
          toast.success(t("products.form.messages.product_added"));
          success();
          setImageMessages("")
        })
        .finally(() => {
          setLoading(false);
        }).catch((err) => {
          toast.error(err.response.data.error.message || err.response?.data || err.message);
        });
    }
    if (type === "edit") {
      if (id !== undefined) {
        formData.append("_method", "Patch");
        editProuduct(formData, id).then(() => {
          toast.success(t("products.form.messages.product_updated"));
          success();
        }).catch((err) => {
          toast.error(err.response.data.error.message || err.response?.data || err.message);
        });
      }
    }
  }
  const { data: categories } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories({ searchQuery: "" }),
  });

  const { data: brands } = useQuery({
    queryKey: ["getBrands"],
    queryFn: () => getBrands({ searchQuery: "" }),
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageMessages("")
    if (files) {
      const newImages = Array.from(files);
      const newImageUrls = newImages.map((file, index) => ({
        url: URL.createObjectURL(file),
        id: Date.now() + index,
      }));

      setImagesUrl((prevUrls) => [...prevUrls, ...newImageUrls]);

      const currentLength = form.getValues("image_url")?.length || 0;
      newImages.forEach((file, index) => {
        form.setValue(`image_url.${currentLength + index}`, file);
      });
    }

    if (type === "edit" && files?.[0] && id) {
      const formData = new FormData();
      formData.append("image_url", files[0]);
      formData.append("product", id.toString());
      addAttachment(formData).then(() => {
        toast.success(t("products.form.messages.attachment_added"));
      });
    }
  };

  async function urlToFile(url: string, fileName: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

  const handleImageRemove = (index: number, id: number) => {
    setImagesUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
    const updatedImages = form
      .getValues("image_url")
      ?.filter((_, i) => i !== index);
    form.setValue("image_url", updatedImages);
    if (type === "edit" && id) {
      deleteAttachment(id).then(() => {
        toast.success(t("products.form.messages.attachment_deleted"));
      });
    }
  };

  const {
    data: product,
    isSuccess: successfull,
    isPending: pending,
  } = useQuery({
    queryKey: ["getProduct", id],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (id === undefined || id === null) {
        return;
      }
      return getProduct(Number(id));
    },
  });

  useEffect(() => {
    const fetchAndSetFile = async () => {
      if (type !== "add" && successfull && product) {
        form.setValue("product", product?.data.data.name);
        form.setValue("quantity", product?.data.data.quantity);
        form.setValue("price", product?.data.data.price);
        form.setValue(
          "shipping_description",
          product?.data.data.shipping_description
        );
        form.setValue("description", product?.data.data.description);
        form.setValue("category", product?.data.data.category_id);
        form.setValue("brand", product?.data.data.commercial_sign_id);

        try {
          const files = await Promise.all(
            product?.data.data.attachments.map(
              async (
                attachment: { image_url: string; attachment_id: number },
                index: number
              ) => ({
                url: await urlToFile(
                  `${BASE_URL}/storage/${attachment.image_url}`,
                  `image${index}`
                ),
                id: attachment.attachment_id,
              })
            )
          );

          const blobUrls = files.map((file) => ({
            url: URL.createObjectURL(file.url),
            id: file.id,
          }));
          setImagesUrl(blobUrls);
        } catch (error) {
          console.error("Error converting attachments to files:", error);
        }
      }
    };

    fetchAndSetFile();
  }, [type, successfull, form, product]);

  return (
    <div>
      {type == "add" || product ? (
        <Form {...form}>
          <form
            className="pb-4"
            onSubmit={form.handleSubmit(onSubmit)}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <div>
              <div className="pb-6">
                <Label className="mb-3 inline-block">{t("products.form.image")}</Label>
                <FormField
                  control={form.control}
                  name="image_url"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {imagesUrl.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="w-[30%] relative rounded-lg bg-[#DCDCDC] h-[100px] border p-1 flex items-center justify-center"
                            >
                              <img
                                src={imageUrl.url}
                                alt={`صورة مرفوعة ${index + 1}`}
                                width={100}
                                height={100}
                                className="object-contain rounded-lg max-h-full w-full"
                              />
                              {type !== "view" && (
                                <Trash2
                                  onClick={() =>
                                    handleImageRemove(index, imageUrl.id)
                                  }
                                  className="left-1 top-1 w-8 absolute h-8 p-2 bg-white rounded-full"
                                />
                              )}
                            </div>
                          ))}
                          {type !== "view" && (
                            <div className="w-[30%] rounded-lg bg-[#DCDCDC] h-[100px] border p-1 flex items-center justify-center">
                              <Input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleImagesChange}
                                accept="image/*"
                                id="image_url"
                              />

                              <Label
                                htmlFor="image_url"
                                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                              >
                                <Plus className="w-8 h-8" />
                                <span className="text-sm mt-2">
                                  {t("products.form.buttons.upload_image")}
                                </span>
                              </Label>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {
                        imageMessage && (
                          <h5 className="text-primary text-sm font-bold">{imageMessage}</h5>
                        )
                      }
                    </FormItem>
                  )}
                />
              </div>
              <FormItem className="mb-4">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("products.form.product_name")}</Label>
                      <FormControl>
                        <Input
                        disabled={type === "view"}
                          placeholder={t(
                            "products.form.placeholders.product_name"
                          )}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("products.form.category")}</Label>
                      <Select
                      disabled={type === "view"}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={form.watch("category")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "products.form.placeholders.category"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {categories?.data.data.map(
                              (category: Categories) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("products.form.brand")}</Label>
                      <Select
                      disabled={type === "view"}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={form.watch("brand")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "products.form.placeholders.brand"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {brands?.data.data.map((brand: Brands) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("products.form.quantity")}</Label>
                      <FormControl>
                        <Input
                        disabled={type === "view"}
                          placeholder={t("products.form.placeholders.quantity")}
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("products.form.price")}</Label>
                      <FormControl>
                        <Input
                        disabled={type === "view"}
                          placeholder={t("products.form.placeholders.price")}
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipping_description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <Label>{t("products.form.shipping_description")}</Label>
                      <FormControl>
                        <Textarea
                        disabled={type === "view"}
                          className="resize-none"
                          placeholder={t(
                            "products.form.placeholders.shipping_description"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <Label>{t("products.form.description")}</Label>
                      <FormControl>
                        <Textarea
                        disabled={type === "view"}
                          className="resize-none"
                          placeholder={t(
                            "products.form.placeholders.description"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {type !== "view" && (
                <div className="flex justify-end mt-4 gap-4">
                  <Button type="button" variant="outline" onClick={close}>
                    {t("products.form.buttons.cancel")}
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {pending ? (
                      <Loader size="w-4 h-4" color="border-t-white" />
                    ) : type === "add" ? (
                      t("products.form.buttons.add")
                    ) : (
                      t("products.form.buttons.edit")
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      ) : (
        <Loader size="w-24 h-24" color="border-t-primary" />
      )}
    </div>
  );
}

export default AddProductForm;
