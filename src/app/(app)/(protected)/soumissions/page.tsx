import { unstable_noStore as noStore } from "next/cache";

import {
  getAllSubmissionByUser,
  getCountSubmissionByUser,
} from "@/lib/db/queries/submission";
import { validateRequestSSR } from "@/server/auth/validate-request";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/auth/redirects";
import MyLink from "@/components/utilities/link";

type Submission = ReturnType<typeof getAllSubmissionByUser> extends Promise<
  (infer R)[]
>
  ? R
  : never;

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}) {
  noStore();

  // validate request
  const { user } = await validateRequestSSR();
  if (!user) redirect(redirects.toNonProtected);

  const { page: pageStr = "1", pageSize: pageSizeStr = "10" } = searchParams;
  const page = parseInt(pageStr);
  const pageSize = parseInt(pageSizeStr);

  // get data
  const [submissions, submissionCount] = await Promise.all([
    getAllSubmissionByUser({
      userId: user.id,
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    }),
    getCountSubmissionByUser({ userId: user.id }),
  ]);

  const count = submissionCount[0]?.value ?? 0;

  if (!submissions.length) {
    return (
      <div className="h-full flex flex-col justify-center items-center gap-8">
        Vous n&apos;avez aucune soumissions.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-2xl font-bold">Soumissions</h1>
      <SubmissionTable submissions={submissions} />
      <SubmissionPagination total={count} page={page} pageSize={pageSize} />
    </div>
  );
}

export const SubmissionTable = ({
  submissions,
}: {
  submissions: Submission[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-foreground font-semibold min-w-[20ch] rounded-tl-md">
            Identifiant
          </TableHead>
          <TableHead className="text-foreground font-semibold">Date</TableHead>
          <TableHead className="text-foreground font-semibold">Heure</TableHead>
          <TableHead className="text-foreground font-semibold min-w-[30ch]">
            Raison d&apos;arrêt
          </TableHead>
          <TableHead className="text-foreground font-semibold text-right rounded-tr-md">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission, index) => {
          const date = new Date(submission.submittedAt);
          const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
          const formattedTime = `${date.getHours()}h${date.getMinutes()}`;
          return (
            <TableRow key={submission.uuid}>
              <TableCell
                className={cn(
                  index == submissions.length - 1 ? "rounded-bl-md" : ""
                )}
              >
                <Button asChild variant="linkForeground">
                  <MyLink href={`/soumissions/${submission.uuid}`}>
                    {submission.uuid}
                  </MyLink>
                </Button>
              </TableCell>
              <TableCell>{formattedDate}</TableCell>
              <TableCell>{formattedTime}</TableCell>
              <TableCell>
                {submission.stopReason ?? "Aucune, fin du questionnaire."}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  index == submissions.length - 1 ? "rounded-br-md" : ""
                )}
              >
                <Button>Voir</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const SubmissionPagination = ({
  total,
  page = 1,
  pageSize = 10,
}: {
  total: number;
  page: number;
  pageSize: number;
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const previous = page - 1 > 0 ? page - 1 : null;
  const next = page + 1 <= totalPages ? page + 1 : null;
  const last = totalPages;

  console.log("totalPages", totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {previous && ( // if there is a previous page
          <>
            <PaginationItem>
              <PaginationPrevious href={`/soumissions?page=${previous}`} />
            </PaginationItem>

            {previous > 1 && ( // show first page if previous is 2 or more
              <PaginationItem>
                <PaginationLink href={`/soumissions?page=1`}>1</PaginationLink>
              </PaginationItem>
            )}

            {previous > 2 && ( // show ellipsis if previous is 3 or more
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href={`/soumissions?page=${previous}`}>
                {previous}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {totalPages > 1 && ( // if there is more than 1 page show the current page
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
        )}

        {next && ( // if there is a next page
          <>
            <PaginationItem>
              <PaginationLink href={`/soumissions?page=${next}`}>
                {next}
              </PaginationLink>
            </PaginationItem>

            {next < totalPages - 1 && ( // show ellipsis if next is 2 or more from the end
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {next < totalPages && ( // show last page if next is 1 or more from the end
              <PaginationItem>
                <PaginationLink href={`/soumissions?page=${last}`}>
                  {last}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext href={`/soumissions?page=${next}`}>
                {totalPages}
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};
