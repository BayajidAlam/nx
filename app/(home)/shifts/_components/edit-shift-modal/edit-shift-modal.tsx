import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui/";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ShiftFormValues } from "../../schema/shift-schema";

interface IEditShiftModalProps {
  isModalOpen: boolean;
  isLoading: boolean;
  success?: string;
  error?: string;
  setIsModalOpen: (state: boolean) => void;

  form: UseFormReturn<ShiftFormValues>;
  handleSubmit: (data: ShiftFormValues) => void;
}

export default function EditShiftModal({
  isModalOpen,
  isLoading,
  error,
  success,
  setIsModalOpen,

  form,
  handleSubmit,
}: IEditShiftModalProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="mt-2 flex gap-2 items-center justify-start">
                      <FormLabel>Shift Name</FormLabel>
                    </div>

                    <FormControl>
                      <Input placeholder="Enter shift name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "Something went wrong"}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            <div className="w-full flex justify-center gap-4">
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Shift"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
