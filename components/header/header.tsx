"use client";

import Image from "next/image";

import m2a from "../../public/m2a.png";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row justify-end items-center">
        <Image src={m2a} alt="m2a" width={150} height={150} />
      </div>
      <div className="w-full flex flex-row gap-4">
        <Button
          className="hover:cursor-pointer"
          variant="outline"
          onClick={() => router.push("/create-invoice")}
        >
          Create New Invoice
        </Button>
      </div>
    </div>
  );
};

export default Header;
