import { DialogTitle } from "@/components/ui/dialog";
import AddProductForm from "./add-product-form";
import AddBrandForm from "./add-brand-form";
import AddCategoryForm from "./add-category-form";
import { useTranslation } from "react-i18next";

function AddProduct({
  tab,
  close,
  success,
  type,
  id,
}: {
  tab: string;
  close(): void;
  success(): void;
  type: string;
  id?: number;
}) {
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle className="text-primary text-center text-3xl font-semibold">
        {tab == "products" && type === "add"
          ? t("addProduct")
          : tab == "products" && type === "edit"
          ? t("editProduct")
          : tab == "products" && type === "view"
          ? t("viewProduct")
          : tab === "brands" && type === "add"
          ? t("addBrand")
          : tab === "brands" && type === "edit"
          ? t("editBrand")
          : tab === "brands" && type === "view"
          ? t("viewBrand")
          : tab === "Categories" && type === "add"
          ? t("addCategory")
          : tab === "Categories" && type === "edit"
          ? t("editCategory")
          : t("viewCategory")}
      </DialogTitle>
      <div>
        {tab === "products" ? (
          <AddProductForm
            close={() => close()}
            success={() => success()}
            type={type}
            id={id}
          />
        ) : tab === "brands" ? (
          <AddBrandForm
            close={() => close()}
            success={() => success()}
            type={type}
            id={id}
          />
        ) : (
          <AddCategoryForm
            close={() => close()}
            success={() => success()}
            type={type}
            id={id}
          />
        )}
      </div>
    </>
  );
}

export default AddProduct;
