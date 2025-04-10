import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../../components/ui/form";
  import { taskSchema} from "./schemas";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { z } from "zod";
  import { Input } from "../../components/ui/input";
  import { Button } from "../../components/ui/button";
  import { toast } from "react-toastify";
  import { Task } from "./type";
  import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Textarea } from "../../components/ui/textarea";

  
  interface AddTaskProps {
    onAdd?: (task: z.infer<typeof taskSchema>) => void; 
    onSubmit?: (task: z.infer<typeof taskSchema>) => void;
    onShow?: (params: { id: string }) => void;
    isViewMode?: boolean;
    isEditMode?: boolean;
    initialData?: Task | null;
  }
  export function AddTask({ onAdd, onSubmit, 
    isViewMode = false, 
    isEditMode = false, 
    initialData  }: AddTaskProps) {

      const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
          title: initialData?.title || "",
          description: initialData?.description || "",
          status: initialData?.status || "1", 
          due_date: initialData?.due_date || "",
          category_id: initialData?.category_id || "",
        },
      });


      

    
      useEffect(() => {
        if (initialData) {
          form.reset({
            title: initialData.title,
            description: initialData.description,
            status: initialData.status,
            due_date: initialData.due_date,
            category_id: initialData.category_id,
          });
        }
      }, [initialData, form]);

      async function onSubmitHandler(values: z.infer<typeof taskSchema>) {
        try {
          if (isEditMode && onSubmit) {
            await onSubmit(values);
          } else if (onAdd) {
            await onAdd(values);
          }
          toast.success(`Task ${isEditMode ? 'updated' : 'added'} successfully`);
          if (!isEditMode) form.reset();
        } catch (error) {
          toast.error((error as Error).message);
        }
      }

    return (
      <Form {...form}>
      <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmitHandler)}>
        {/* Title Field */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full block">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full rounded-lg py-6"
                  disabled={isViewMode}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Description Field */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full block">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  className="w-full rounded-lg min-h-24"
                  disabled={isViewMode}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Status Field */}
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full block">
                Status
              </FormLabel>
              <FormControl>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full rounded-lg py-6">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Due Date Field */}
        <FormField
          name="due_date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full block">
                Due Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="w-full rounded-lg py-6"
                  disabled={isViewMode}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Category Field */}
        <FormField
          name="category_id"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="w-full block">
                Category
              </FormLabel>
              <FormControl>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full rounded-lg py-6">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Submit Button */}
        {!isViewMode && (
          <Button type="submit" className="mt-4">
            {isEditMode ? "Update Task" : "Add Task"}
          </Button>
        )}
      </form>
    </Form>

    );
  }