"use client";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Promocode } from '@/features/promocodes/type';
import { Input } from "@/components/ui/input";
import {Table,TableBody, TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { CirclePlus } from "lucide-react";
import { AddPromocode } from "./add-promocode";
import { z } from "zod";
import { promocodeSchema } from "./schemas";
import { getPromoCodeColumns } from "./columns";
import { useTranslation } from "react-i18next";



interface PromocodesTableProps {
  promocodes: Promocode[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDelete: (id: string) => void; 
  onShow: (params:{id: string}) => void;
  onUpdate: (params: { id: string; data: z.infer<typeof promocodeSchema> }) => void;
  selectedPromocode: Promocode | null; 
  setSelectedPromocode: (promocode: Promocode | null) => void; 
    
  onAdd: (promocodeData: {
    promo_code: string;
    percentage: number;
  }) => void;}

export function PromocodesTable({
  promocodes,
  isLoading,
  error,
  currentPage,
  onPageChange,
  searchQuery,
  onSearchChange,
  onDelete,
  onAdd,
  onShow,
  onUpdate,
}: PromocodesTableProps) {
    const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const columns = getPromoCodeColumns(isRTL);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(null);
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: promocodes || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onDelete, 
      onAdd,
      onShow: (promocode: Promocode) => {
        setSelectedPromocode(promocode);
        setIsViewDialogOpen(true);
        onShow({ id: promocode.id }); 
      }
      ,
      onEdit: (promocode: Promocode) => {
        setSelectedPromocode(promocode);
        setIsEditDialogOpen(true);
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
      <Input
          placeholder={t("promocode.search_placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`max-w-sm ${isRTL ? "text-right" : "text-left"}`}
        />
        <div className="flex items-center gap-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <CirclePlus
                stroke="#DF0612"
                size={30}
                className="cursor-pointer"
                aria-label={t("promocode.add_new")}
              />
            </DialogTrigger>
            <DialogContent className="w-1/3 md:rounded-3xl">
              <AddPromocode onAdd={onAdd} />
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>

        <DialogContent className="w-1/3 md:rounded-3xl">
          <AddPromocode 
            isViewMode={true} 
            initialData={selectedPromocode} 
            onShow={onShow}
          />
        </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>

        <DialogContent className="w-1/3 md:rounded-3xl">
          <AddPromocode
          isEditMode={true}
          initialData={selectedPromocode}
          onSubmit={(data) =>
            selectedPromocode && onUpdate({ id: selectedPromocode.id, data })
           }
           />
        </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-2xl border bg-background">
        <Table>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {error}
                </TableCell>
              </TableRow>
            ) : promocodes.length ? (
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
    
      <div
        className={`flex fixed ${isRTL ? "left-[4%]" : "right-[4%]"} bottom-[2%] items-center justify-end space-x-2 py-4`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t("common.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
}
