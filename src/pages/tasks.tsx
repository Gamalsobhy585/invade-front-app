import { TasksTable } from "../features/tasks/tasks-table";
import { Helmet } from "react-helmet";
import {
  searchTasks,
  deleteTask,
  createTask,
  getTask,
  updateTask,
} from "../features/tasks/api";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdateTaskVariables } from "../features/tasks/type";
import { Task } from "../features/tasks/type";
import { useTranslation } from "react-i18next";

const PromoCodes = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", currentPage, searchQuery],
    queryFn: () =>
      searchTasks({
        page: currentPage,
        query: searchQuery,
      }),
  });

  const showMutation = useMutation({
    mutationFn: getTask,
    onSuccess: (data) => {
      setSelectedTask({
        id: data.id,
        promo_code: data.promo_code,
        percentage: parseFloat(data.percentage),
      });
    },
    onError: (error) => {
      toast.error(`Error fetching task details ${error}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTaskVariables) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(`Error Update task details ${error}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentPage, searchQuery],
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentPage, searchQuery],
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
  <title>{t("tasks")}</title>
  </Helmet>
      <TasksTable
        tasks={data?.data || []}
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
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </>
  );
};

export default PromoCodes;
