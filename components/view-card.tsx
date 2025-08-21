"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const ViewCard = ({ id }: { id: string }) => {
  const router = useRouter();
  return (
    <div className="w-full">
      <Button
        className="w-full"
        onClick={() => router.push(`/view-invoice/${id}`)}
      >
        View Invoice
      </Button>
    </div>
  );
};

export default ViewCard;
