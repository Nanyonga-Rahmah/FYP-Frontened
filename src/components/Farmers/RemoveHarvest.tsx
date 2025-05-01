import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

// interface RemoveHarvestProps {
//   harvestId?: string;

// }

const formSchema = z.object({
  reason: z.string().min(2, {
    message: "Field is required.",
  }),
});

export function RemoveHarvest() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-[#EE443F] cursor-pointer">Delete </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold">
            Delete Harvest?
          </DialogTitle>
          <DialogDescription>
            This harvest can’t be deleted. It will be marked as cancelled if
            approved.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for deletion</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write here" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="flex  justify-between gap-5">
          <Button className="border grow text-black" variant={"outline"}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#112D3E] grow text-white">
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
