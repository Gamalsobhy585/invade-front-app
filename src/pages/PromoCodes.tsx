import { PromocodesTable } from "@/features/promocodes/promocodes-table";
import { Helmet } from "react-helmet";
import {
  searchPromocodes,
  deletePromocode,
  createPromocode,
  getPromocode,
  updatePromocode,
} from "@/features/promocodes/api";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdatePromocodeVariables } from "@/features/promocodes/type";
import { Promocode } from "@/features/promocodes/type";
import { useTranslation } from "react-i18next";

const PromoCodes = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["promocodes", currentPage, searchQuery],
    queryFn: () =>
      searchPromocodes({
        page: currentPage,
        query: searchQuery,
      }),
  });

  const showMutation = useMutation({
    mutationFn: getPromocode,
    onSuccess: (data) => {
      setSelectedPromocode({
        id: data.id,
        promo_code: data.promo_code,
        percentage: parseFloat(data.percentage),
      });
    },
    onError: (error) => {
      toast.error(`Error fetching promocode details ${error}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdatePromocodeVariables) =>
      updatePromocode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
    onError: (error) => {
      toast.error(`Error Update promocode details ${error}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promocodes", currentPage, searchQuery],
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: createPromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promocodes", currentPage, searchQuery],
      });
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleShow = (id: string) => {
    showMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
  <Helmet>
  <title>{t("promocodes")}</title>
  </Helmet>
      <PromocodesTable
        promocodes={data?.data || []}
        isLoading={isLoading}
        error={isError ? error.message : null}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onDelete={handleDelete}
        onAdd={addMutation.mutate}
        onShow={(params) => handleShow(params.id)}
        onUpdate={(params) => updateMutation.mutate(params)}
        selectedPromocode={selectedPromocode}
        setSelectedPromocode={setSelectedPromocode}
      />
    </>
  );
};

export default PromoCodes;
