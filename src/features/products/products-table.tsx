import React, { useEffect, useState } from "react";
import { Products } from "../interfaces";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { changeProductStatus, deleteProduct, getProducts } from "./api";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddProduct from "./add-product";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "@/components/loader";
import DeleteMessage from "@/components/delete-message";

const BASE_URL = import.meta.env.VITE_BASE_Image_URL.replace(/\/+$/, "");

function ProductsTable({ update }: { update: boolean }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 1,
      pageSize: 10,
    });
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<number | null>(null);
  const [deleteMessageForId, setDeleteMessageForId] = useState<number | null>(
    null
  );
  const { t, i18n } = useTranslation();

  const columns: ColumnDef<Products>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => (
        <div className="text-center capitalize">{row.getValue("id")}</div>
      ),
    },

    {
      accessorKey: "name",
      header: () => <div className="text-center">{t("name")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.getValue("name")}</div>
        );
      },
    },
    {
      accessorKey: "commercial_sign_name",
      header: () => <div className="text-center">{t("brand")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("commercial_sign_name")}
          </div>
        );
      },
    },
    {
      accessorKey: "category_name",
      header: () => <div className="text-center">{t("category")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("category_name")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">{t("price")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.getValue("price")}</div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">{t("quantity")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("quantity")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center">
          {t("enable")}/{t("disable")}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Switch
              onCheckedChange={(e) =>
                changeProductStatus(e ? 1 : 0, row.getValue("id")).then(() =>
                  toast.success("status Changed Successfully")
                )
              }
              defaultChecked={row.getValue("status")}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: () => <div className="text-center">{t("image")}</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <img
              className="w-[50px] h-[50px] rounded-full"
              src={BASE_URL + "/storage/" + row.getValue("image")}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "/products.webp";
              }}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div>{t("actions")}</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 justify-center text-primary">
            <Dialog
              open={openEditDialog === row.getValue("id")}
              onOpenChange={(open) =>
                setOpenEditDialog(open ? row.getValue("id") : null)
              }
            >
              <DialogTrigger asChild>
                <SquarePen size={24} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="w-[37.5rem] sm:rounded-2xl max-h-[90vh] scrollbar-hidden overflow-auto">
                <AddProduct
                  id={row.getValue("id")}
                  type="edit"
                  tab="products"
                  close={() => setOpenEditDialog(null)}
                  success={() => {
                    setOpenEditDialog(null);
                    refetchProducts();
                  }}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDialog === row.getValue("id")}
              onOpenChange={(open) =>
                setOpenDialog(open ? row.getValue("id") : null)
              }
            >
              <DialogTrigger asChild>
                <Eye size={24} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="w-[37.5rem] sm:rounded-2xl max-h-[90vh] scrollbar-hidden overflow-auto">
                <AddProduct
                  id={row.getValue("id")}
                  type="view"
                  tab="products"
                  close={() => setOpenDialog(null)}
                  success={() => {
                    setOpenDialog(null);
                    refetchProducts();
                  }}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={deleteMessageForId === row.getValue("id")}
              onOpenChange={(open) =>
                setDeleteMessageForId(open ? row.getValue("id") : null)
              }
            >
              <DialogTrigger asChild>
                <Trash2 size={24} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="w-[580px] sm:rounded-2xl max-h-[90vh] scrollbar-hidden overflow-auto">
                <DeleteMessage
                  thing={t("product")}
                  close={() => setDeleteMessageForId(null)}
                  onDelete={() => {
                    deleteProduct(row.getValue("id")).then(() => {
                      refetchProducts();
                      toast.success("Product Deleted");
                      setDeleteMessageForId(null)
                    })
                  }}
                />
                
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["getProducts", pageIndex, searchQuery],
    queryFn: ({ queryKey }) => {
      const [, page, query] = queryKey;
      return getProducts({
        page: page as number,
        searchQuery: query as string,
      });
    },
  });
  useEffect(() => {
    refetchProducts();
  }, [update, refetchProducts]);

  useEffect(() => {
    if (products?.data.current_page !== products?.data.last_page) {
      const nextPage = pageIndex + 1;
      queryClient.prefetchQuery({
        queryKey: ["getProducts", nextPage, searchQuery],
        queryFn: () =>
          getProducts({
            page: nextPage,
            searchQuery,
          }),
      });
    }
  }, [
    pageIndex,
    products?.data.current_page,
    products?.data.last_page,
    queryClient,
    searchQuery,
  ]);

  const table = useReactTable({
    data: products?.data.data ?? [],
    columns,
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
  });

  return (
    <>
      <div
        className="flex justify-start items-center pb-10"
        dir={i18n.language == "ar" ? "rtl" : "ltr"}
      >
        <Input
          placeholder={t("products.filterProducts")}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          className="sm:w-[430px] w-[265px] rounded-lg"
        />
      </div>
      {products ? (
        <div className="rounded-2xl border bg-background">
          <Table dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Loader size="w-24 h-24" color="border-t-primary" />
      )}

      {products?.data.data.length > 0 && (
        <div
          className="flex items-center justify-end space-x-2 py-4"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("rows_per_page")}
          </div>
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={products?.data.current_page === 1}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={
                products?.data.last_page === products?.data.current_page
              }
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsTable;
