"use client";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export function CheckUser() {
  const currentUrl = usePathname();
  useEffect(() => {
    async function main() {
      const user = localStorage.getItem("user") as string;
      const parsedUser = user ? JSON.parse(user) : [];
      if (!user || user == "" || !parsedUser && currentUrl != "/user") {
        redirect("/user");
      }
    }
    main()
  }, []);

  useEffect(() => {
    async function main() {
      const user = localStorage.getItem("user") as string;
      const parsedUser = user ? JSON.parse(user) : [];
      if (!user || user == "" || (!parsedUser && currentUrl != "/user")) {
        redirect("/user");
      }
    }
    main()
  }, [currentUrl])

  return null;
}
