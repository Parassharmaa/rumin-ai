import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import { Card } from "../ui/card";
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
import { CrossIcon, PlusIcon, TrashIcon, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  participants: z.array(
    z.object({
      name: z.string().nonempty(),
      age: z.string(),
      gender: z.string(),
      background: z.string(),
      bio: z.string(),
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

const NewParticipants = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participants: [defaultValue],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  return (
    <>
      <Card
        onClick={open}
        className="min-h-[100px] cursor-pointer hover:shadow-md"
      >
        <div className="flex h-[100%] items-center justify-center text-center text-sm text-muted-foreground">
          <div>+ Add Participants</div>
        </div>
      </Card>

      <Dialog
        modal
        open={isOpen}
        onOpenChange={(value) => {
          form.reset({
            participants: [defaultValue],
          });
          toggle(value);
        }}
      >
        <Form {...form}>
          <form className="space-y-8">
            <ScrollArea>
              <DialogContent
                forceMount
                className="max-h-screen overflow-y-scroll sm:max-w-[600px]"
              >
                <DialogHeader>
                  <DialogTitle>Add Participants</DialogTitle>
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
                          Participant {index + 1}
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
                        <FormField
                          control={form.control}
                          name={`participants.${index}.age`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Age" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`participants.${index}.gender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <Input placeholder="Gender" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                placeholder="About Participant"
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
                        Add Participant
                      </div>
                    </Button>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button>
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
