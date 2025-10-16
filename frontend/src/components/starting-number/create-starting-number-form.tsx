import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createStartingNumber } from "@/services/startingNumbers";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  value: z.string().min(1, "Starting number is required"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateStartingNumberFormProps {
  onSuccess?: () => void;
}

const CreateStartingNumberForm = ({
  onSuccess,
}: CreateStartingNumberFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);

      // Convert string to number and validate
      const numValue = parseFloat(values.value);
      if (isNaN(numValue) || numValue <= 0) {
        toast.error("Please enter a valid positive number");
        return;
      }

      const response = await createStartingNumber(numValue);

      toast[response.type](response.message);
      if (response.success) {
        form.reset();
        onSuccess?.();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      let errorMessage =
        "An unknown error occurred while creating the starting number.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Starting Number</DialogTitle>
        <DialogDescription>
          Enter a number to start building your calculation tree.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter a number (e.g., 42)"
                    {...field}
                    min={1}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default CreateStartingNumberForm;
