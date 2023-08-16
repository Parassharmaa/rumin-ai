import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import { useFieldArray, useForm } from "react-hook-form";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { useDisclosure } from "react-use-disclosure";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GenerateParticipantsForm from "./generateParticipantsForm";
import { Input } from "../ui/input";
import { PlusIcon, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { api } from "~/utils/api";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/router";

const formSchema = z.object({
  participants: z.array(
    z.object({
      name: z
        .string()
        .nonempty({
          message: "Name is required",
        })
        .max(50),
      age: z
        .string()
        .nonempty({
          message: "Age is required",
        })
        .max(5),
      gender: z
        .string()
        .nonempty({
          message: "Gender is required",
        })
        .max(10),
      background: z
        .string()
        .nonempty({
          message: "Background is required",
        })
        .max(50),
      bio: z.string().max(500),
    })
  ),
});

const defaultValue = {
  age: "",
  background: "",
  bio: "",
  name: "",
  gender: "",
};

interface Props {
  toggle: (value: boolean) => void;
  close: () => void;
  isOpen: boolean;
}

const NewParticipants = ({ close, isOpen, toggle }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participants: [defaultValue],
    },
  });

  const { mutate, isLoading } = api.focusGroup.addParticipant.useMutation({
    onSuccess: async () => {
      await utils.focusGroup.allParticipants.invalidate();
      handleClose();
    },
  });

  const utils = api.useContext();

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const handleClose = () => {
    close();
    form.reset({
      participants: [defaultValue],
    });
  };

  const router = useRouter();

  const submitParticipants = (data: z.infer<typeof formSchema>) => {
    mutate({
      projectId: router.query.id as string,
      participants: data.participants,
    });
  };

  return (
    <>
      <Dialog
        modal
        open={isOpen}
        onOpenChange={(value) => {
          toggle(value);
          form.reset({
            participants: [defaultValue],
          });
        }}
      >
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(submitParticipants)}
          >
            <ScrollArea>
              <DialogContent
                forceMount
                className="max-h-screen overflow-y-scroll sm:max-w-[600px]"
              >
                <DialogHeader>
                  <DialogTitle>Add Personas</DialogTitle>
                  <DialogDescription>
                    Auto generate or manually add participants to your focus
                    group
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                  <GenerateParticipantsForm
                    onData={(data) => {
                      if (data !== undefined) {
                        form.reset({
                          participants: data,
                        });
                      }
                    }}
                  />
                </div>

                <div className="p-1">
                  {fields.map((item, index) => (
                    <div
                      key={index}
                      className="border-1 my-2 grid w-full items-center gap-2 rounded-md bg-slate-50 p-4 dark:bg-slate-900"
                    >
                      <div className="flex justify-between">
                        <div className="text-muted-foreground">
                          Persona {index + 1}
                        </div>

                        {fields.length !== 1 && (
                          <div
                            onClick={() => remove(index)}
                            className="cursor-pointer"
                          >
                            <X className="h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <Separator />
                      <FormField
                        control={form.control}
                        name={`participants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between gap-2">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`participants.${index}.age`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <NumericFormat
                                    customInput={Input}
                                    placeholder="Age"
                                    min={1}
                                    allowNegative={false}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`participants.${index}.gender`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                  <Select
                                    {...field}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <SelectContent>
                                      <SelectItem value={"Male"}>
                                        Male
                                      </SelectItem>
                                      <SelectItem value="Female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="Other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`participants.${index}.background`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Qualification or Background"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`participants.${index}.bio`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="About the user"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  {fields.length < 6 && (
                    <Button
                      className="my-4"
                      variant="outline"
                      onClick={() => {
                        append({
                          age: "",
                          background: "",
                          bio: "",
                          name: "",
                          gender: "",
                        });
                      }}
                      size="sm"
                    >
                      <PlusIcon className="h-4 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Add More
                      </div>
                    </Button>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={form.handleSubmit(submitParticipants)}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="h-4 animate-spin" />
                    )}
                    <div>Create</div>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </ScrollArea>
          </form>
        </Form>
      </Dialog>
    </>
  );
};

export default NewParticipants;
