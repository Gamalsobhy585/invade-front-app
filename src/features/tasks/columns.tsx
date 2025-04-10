import { ColumnDef,Row } from "@tanstack/react-table";
import { Task } from "@/features/tasks/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {  SquarePen, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";




export const getPromoCodeColumns = (isRTL: boolean): ColumnDef<Task>[] => {
  const { t } = useTranslation();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="mx-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("common.select_all")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mx-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("common.select_row")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("promo_code.id_label"),
      cell: ({ row }) => (
        <div className={`capitalize ${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "promo_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("promo_code.name_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`lowercase ${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("promo_code")}
        </div>
      ),
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("promo_code.percentage_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`lowercase ${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("percentage")}%
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className={`text-center ${isRTL ? "text-center" : "text-center"}`}>
          {t("common.actions_label")}
        </div>
      ),
      enableHiding: false,
      cell: ({ row, table }: { row: Row<Task>; table: any }) => {
        const onDelete = table.options.meta?.onDelete;
        const onEdit = table.options.meta?.onEdit;
        return (
          <div className="flex items-center gap-2 justify-center text-primary">
            <SquarePen
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onEdit && onEdit(row.original)}
              aria-label={t("common.edit")}
            />
            <Eye
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => table.options.meta?.onShow(row.original)}
              aria-label={t("common.view")}
            />
            <Trash2
              size={24}
              className="cursor-pointer hover:text-red-500"
              onClick={() => onDelete && onDelete(row.original.id)}
              aria-label={t("common.delete")}
            />
          </div>
        );
      },
    },
  ];
};