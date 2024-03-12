import { unstable_noStore as noStore } from "next/cache";

import { TitleWrapper } from "@/components/layout/(app)/title-wrapper";
import { getSharedMetadata } from "@/config/shared-metadata";
import { siteConfig } from "@/config/site";
import { getAllUsers, getCountUsers } from "@/server/db/queries/auth";
import { UserTable } from "./table";
import { MyPagination } from "@/components/utilities/pagination";
import { AddUser } from "./add-user";
import { Filter } from "./filter";

const METADATA = {
  title: "Admin - Utilisateurs",
  description: "Gestion des utilisateurs SNPClic",
  url: siteConfig.url + "/admin/utilisateurs",
};

export const metadata = {
  title: METADATA.title,
  description: METADATA.description,
  ...getSharedMetadata(METADATA.title, METADATA.description, METADATA.url),
};

export type User = ReturnType<typeof getAllUsers> extends Promise<(infer R)[]>
  ? R
  : never;

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
    email?: string;
    role?: string;
  };
}) {
  noStore();

  const { page: pageStr = "1", pageSize: pageSizeStr = "10" } = searchParams;
  const page = parseInt(pageStr);
  const pageSize = parseInt(pageSizeStr);

  // get data
  const [users, usersCount] = await Promise.all([
    getAllUsers({
      pagination: {
        page: page,
        pageSize: pageSize,
      },
      emailFilter: searchParams.email,
      roleFilter: searchParams.role as User["role"],
    }),
    getCountUsers(),
  ]);

  const count = usersCount[0]?.value ?? 0;

  if (!users.length) {
    return (
      <TitleWrapper title="Utilisateurs">
        <div className="flex flex-col gap-4 justify-between h-full">
          <div className="flex justify-between items-end">
            <Filter email={searchParams.email} role={searchParams.role} />
            <AddUser />
          </div>
          <div className="h-full flex flex-col justify-center items-center gap-8">
            Il n&apos;y a aucun utilisateur.
          </div>
        </div>
      </TitleWrapper>
    );
  }

  return (
    <TitleWrapper title="Utilisateurs">
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-between sm:items-end">
        <Filter email={searchParams.email} role={searchParams.role} />
        <AddUser />
      </div>
      <UserTable users={users} />
      <MyPagination total={count} page={page} pageSize={pageSize} />
    </TitleWrapper>
  );
}
