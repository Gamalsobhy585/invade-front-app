"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTable from "./products-table";
import BrandsTable from "./brands-table";
import CategoriesTable from "./categories-table";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddProduct from "./add-product";
import { useTranslation } from "react-i18next";

export function Product() {
  const [activeTab, setActiveTab] = useState("products");
  const [openDialog, setOpenDialog] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updateBrand, setUpdateBrand] = useState(false);
  const [updateCategories, setUpdateCategories] = useState(false);
  const { t , i18n } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl pb-3">{t("products.title")}</h2>
      <div className="flex justify-between items-center py-4">
        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className={`flex justify-between ${i18n.language == "ar"? "flex-row-reverse" : "flex-row"} items-start pb-2`}>
            <TabsList className={`flex gap-x-2 justify-start ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"}`}>
              <TabsTrigger
                className="bg-white border border-primary text-primary sm:px-10 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="products"
              >
                {t("products.title")}
              </TabsTrigger>
              <TabsTrigger
                className="bg-white border border-primary text-primary sm:px-10 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="brands"
              >
                {t("brands")}
              </TabsTrigger>
              <TabsTrigger
                className="bg-white border border-primary text-primary sm:px-10 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="categories"
              >
                {t("categories")}
              </TabsTrigger>
            </TabsList>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <CirclePlus
                  stroke="#DF0612"
                  size={30}
                  className="cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="w-[37.5rem] sm:rounded-2xl max-h-[90vh] scrollbar-hidden overflow-auto">
                <AddProduct
                  type="add"
                  tab={activeTab}
                  close={() => setOpenDialog(false)}
                  success={() => {
                    setOpenDialog(false);
                    setUpdate(!update);
                    setUpdateBrand(!updateBrand);
                    setUpdateCategories(!updateCategories);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <TabsContent value="products">
            <ProductsTable update={update} />
          </TabsContent>
          <TabsContent value="brands">
            <BrandsTable update={updateBrand} />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTable update={updateCategories} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
