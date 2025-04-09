import { useEffect, useState } from "react";
import { Categories } from "../interfaces";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { deleteCategory, getCategories } from "./api";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddProduct from "./add-product";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import DeleteMessage from "@/components/delete-message";

const BASE_URL = import.meta.env.VITE_BASE_Image_URL.replace(/\/+$/, "");

function CategoriesTable({ update }: { update: boolean }) {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<number | null>(null);
  const [deleteMessageForId, setDeleteMessageForId] = useState<number | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Categories>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("select_all")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("select_row")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => t("id"),
      cell: ({ row }) => (
        <div className="text-center capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => t("name"),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.getValue("name")}</div>
        );
      },
    },
    {
      accessorKey: "image",
      header: () => t("image"),
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
      header: () => t("actions"),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 justify-center text-primary">
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
                  tab="categories"
                  close={() => setOpenDialog(null)}
                  success={() => {
                    setOpenDialog(null);
                    refetchCategories();
                  }}
                />
              </DialogContent>
            </Dialog>
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
                  tab="categories"
                  close={() => setOpenEditDialog(null)}
                  success={() => {
                    setOpenEditDialog(null);
                    refetchCategories();
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
                  thing={t("category")}
                  close={() => setDeleteMessageForId(null)}
                  onDelete={() => {
                    deleteCategory(row.getValue("id")).then(() => {
                      refetchCategories();
                      toast.success(t("category_deleted"));
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

  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ["getCategories", searchQuery],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;
      return getCategories({
        searchQuery: query as string,
      });
    },
  });

  const paginatedData = categories?.data.data.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  useEffect(() => {
    refetchCategories();
  }, [update, refetchCategories]);

  const table = useReactTable({
    data: paginatedData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <div
        className="flex justify-start items-center pb-10"
        dir={i18n.language == "ar" ? "rtl" : "ltr"}
      >
        <Input
          placeholder={t("search")}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          className="sm:w-[430px] w-[265px] rounded-lg"
        />
      </div>
      {categories ? (
        <div className="rounded-2xl border bg-background">
          <Table dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
      {categories?.data.data.length > 0 && (
        <div
          className="flex items-center justify-end space-x-2 py-4"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("rows_per_page")}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))
              }
              disabled={pagination.pageIndex === 0}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  pageIndex: p.pageIndex + 1,
                }))
              }
              disabled={
                (pagination.pageIndex + 1) * pagination.pageSize >=
                categories?.data.data.length
              }
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesTable;
