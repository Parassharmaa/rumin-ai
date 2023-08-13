import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDisclosure } from "react-use-disclosure";
import { PlusIcon } from "lucide-react";

import { ProjectType } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { api } from "~/utils/api";
import { Icons } from "../ui/icons";

const formSchema = z.object({
  title: z.string().min(3, "Must be at least 3 characters"),
  description: z.string().min(3, "Must be at least 3 characters"),
  projectType: z.nativeEnum(ProjectType),
});

const NewProjectDialog = () => {
  const { isOpen, open, toggle, close } = useDisclosure();
  const utils = api.useContext();

  const { mutate, isLoading } = api.project.new.useMutation({
    onSuccess: async () => {
      await utils.project.userProjects.refetch();
      close();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <div>
      <Button variant="outline" className="space-x-1" onClick={open}>
        <PlusIcon size="18px" />
        <div>New Project</div>
      </Button>
      <Dialog
        modal
        open={isOpen}
        onOpenChange={(value) => {
          form.reset();
          toggle(value);
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogContent forceMount className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
                <DialogDescription>
                  Tell us about about your next research project.
                </DialogDescription>
              </DialogHeader>

              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Project Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ProjectType.FocusGroup}>
                            Focus Group
                          </SelectItem>
                          <SelectItem value="soon" disabled>
                            Survey Simulator (Coming Soon)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add purpose or objective"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" gap-2">
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading && <Icons.spinner className="h-4 animate-spin" />}
                  <div>Create</div>
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>
    </div>
  );
};

export default NewProjectDialog;
