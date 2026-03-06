import ItemPage from "@/components/AddItemPage";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div>
      <ItemPage />
    </div>
  );
};

export default Page;
