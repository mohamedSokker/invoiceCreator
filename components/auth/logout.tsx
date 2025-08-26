"use client";

// import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogInIcon } from "lucide-react";
import { logout } from "@/actions/logout";
import { Button } from "../ui/button";

const Logout = () => {
  return (
    // <DropdownMenuItem>
    <Button className="flex items-center gap-4" variant="outline">
      <LogInIcon size={16} className="opacity-60" aria-hidden="true" />
      <span
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </span>
    </Button>
    // </DropdownMenuItem>
  );
};

export default Logout;
