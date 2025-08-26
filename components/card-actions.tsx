"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Edit, Trash } from "lucide-react";
import { deleteInvoice } from "@/actions/deleteInvoice";

const CardActions = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteInvoice(id);
    router.refresh();
  };

  return (
    <div className="flex gap-4">
      <Button
        className="bg-amber-400"
        onClick={() => router.push(`/edit-invoice/${id}`)}
      >
        <Edit />
      </Button>
      <Button variant="destructive" onClick={() => handleDelete(id)}>
        <Trash />
      </Button>
    </div>
  );
};

export default CardActions;
