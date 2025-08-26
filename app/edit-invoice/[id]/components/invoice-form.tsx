"use client";
import { useState } from "react";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { CalendarIcon, Edit, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { invoice } from "@prisma/client";
import { updateInvoice } from "@/actions/updateInvoice";

interface Items {
  id: number;
  name: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const formSchema = z.object({
  den: z.date(),
  address: z.string(),
  recievedCompany: z.string(),
  recievedAdress: z.string(),
  recievedZipCode: z.string(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  Kundennummer: z.string(),
  invoiceRef: z.string(),
  invoiceNo: z.string(),
  zeitraum: z.string(),
  objekt: z.string(),
  taxes: z.number(),
  name: z.string().min(1),
  email: z.email(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      date: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number(),
    })
  ),
});

type ClassFormValues = z.infer<typeof formSchema>;

export const InvoiceForm = ({
  initialData,
}: {
  initialData: invoice | null;
}) => {
  const [currentItem, setCurrentItem] = useState<Omit<Items, "id">>({
    name: "",
    date: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Edit Invoice";
  const description = "Edit a  new Invoice";
  const toastMessage = "Invoice Edited";
  const action = "Save";

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      address: initialData?.address ?? "",
      recievedCompany: initialData?.recievedCompany ?? "",
      recievedAdress: initialData?.recievedAdress ?? "",
      recievedZipCode: initialData?.recievedZipCode ?? "",
      den: initialData?.den ?? new Date(),
      dueDate: initialData?.dueDate ?? new Date(),
      email: initialData?.email ?? "",
      invoiceDate: initialData?.invoiceDate ?? new Date(),
      invoiceNo: initialData?.invoiceNo ?? "",
      invoiceRef: initialData?.invoiceRef ?? "",
      items:
        initialData?.items && initialData.items !== ""
          ? JSON.parse(initialData?.items)
          : [],
      Kundennummer: initialData?.Kundennummer ?? "",
      objekt: initialData?.objekt ?? "",
      zeitraum: initialData?.zeitraum ?? "",
      taxes: initialData?.taxes ?? 0,
    },
  });

  const items = form.watch("items") || [];

  const handleAddQuestion = () => {
    const { name, date, quantity, unitPrice, totalPrice } = currentItem;

    if (!name || !date || !quantity || !unitPrice || !totalPrice) {
      toast.error("Please fill all fields for the item");
      return;
    }

    const newQuestion = {
      ...currentItem,
      id: Date.now(),
    };

    if (editingId !== null) {
      const updatedQuestions = items.map((q) =>
        q.id === editingId ? newQuestion : q
      );
      form.setValue("items", updatedQuestions);
      setEditingId(null);
      toast.success("Item updated!");
    } else {
      form.setValue("items", [...items, newQuestion]);
      toast.success("Item added!");
    }

    setCurrentItem({
      name: "",
      date: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  const handleEditQuestion = (item: Items) => {
    setCurrentItem({
      name: item.name,
      date: item.date,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    });
    setEditingId(item.id);
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = items.filter((q) => q.id !== id);
    form.setValue("items", updatedQuestions);
    toast.success("Item deleted.");
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      setLoading(true);

      await updateInvoice(data, params.id as string);

      router.refresh();
      router.push(`/`);
      toast.success(toastMessage);
    } catch (error) {
      toast("Something went wrong.", {
        description: ((error as AxiosError)?.response?.data as string) || "",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid md:grid-cols-3 lg:gid-cols-3 sm:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="den"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Den</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="address"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recievedAdress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recieved Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="recieved address"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recievedCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recieved Company</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="recieved company"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recievedZipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recieved Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="recieved zip code"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date of Invoice</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="w-full"
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date of Due</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="w-full"
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Kundennummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kundennummer</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Kundennummer"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Ref</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Invoice Ref"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Invoice No"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zeitraum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zeitraum</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Zeitraum"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objekt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objekt</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Objekt"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Taxes"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="name"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Email"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />

          {/* Question Form */}
          <div className="mt-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter the name"
                className="resize-none"
                value={currentItem.name}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    name: e.target.value,
                  })
                }
              />
              <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                <div>
                  <Label className="font-bold text-[14px]">Date</Label>
                  <Input
                    placeholder="Date"
                    value={currentItem.date}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="font-bold text-[14px]">Quantity</Label>
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        quantity: e.target.valueAsNumber,
                        totalPrice:
                          e.target.valueAsNumber * currentItem.unitPrice,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="font-bold text-[14px]">Unit Price</Label>
                  <Input
                    placeholder="Unit Price"
                    type="number"
                    value={currentItem.unitPrice}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        unitPrice: e.target.valueAsNumber,
                        totalPrice:
                          e.target.valueAsNumber * currentItem.quantity,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="font-bold text-[14px]">Total Price</Label>
                  <Input
                    placeholder="Total Price"
                    type="number"
                    value={currentItem.totalPrice}
                    disabled={true}
                    // onChange={(e) =>
                    //   setCurrentItem({
                    //     ...currentItem,
                    //     totalPrice: e.target.valueAsNumber,
                    //   })
                    // }
                  />
                </div>
              </div>

              <Button
                onClick={handleAddQuestion}
                type="button"
                variant="outline"
              >
                Add Item
              </Button>
            </div>
          </div>

          {/* Display Added Questions */}
          {items.length > 0 && (
            <Card className="mt-6 w-full">
              <CardHeader>
                <CardTitle>
                  <h3 className="text-lg font-semibold mb-2">Added Items</h3>
                </CardTitle>
                <CardContent>
                  <div className="w-full flex flex-col gap-4">
                    {items.map((q, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>
                            <strong>{q.name}</strong>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                            <div>Date: {q.date}</div>
                            <div>Quantity: {q.quantity}</div>
                            <div>Unit Price: {q.unitPrice}</div>
                            <div>Total Price: {q.totalPrice}</div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex gap-2 flex-row justify-end w-full">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => handleEditQuestion(q)}
                            >
                              <Edit />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleDeleteQuestion(q.id)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          )}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
