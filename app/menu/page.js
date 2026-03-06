import MenuPage from "@/components/MenuPage";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div>
      <MenuPage />
    </div>
  );
};

export default Page;
