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

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {previous && ( // if there is a previous page
          <>
            <PaginationItem>
              <PaginationPrevious href={`?page=${previous}`} />
            </PaginationItem>

            {previous > 1 && ( // show first page if previous is 2 or more
              <PaginationItem>
                <PaginationLink href={`?page=1`}>1</PaginationLink>
              </PaginationItem>
            )}

            {previous > 2 && ( // show ellipsis if previous is 3 or more
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href={`?page=${previous}`}>
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
              <PaginationLink href={`?page=${next}`}>
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
                <PaginationLink href={`?page=${last}`}>
                  {last}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext href={`?page=${next}`}>
                {totalPages}
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};
