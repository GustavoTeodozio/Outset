export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export const buildPagination = ({ page = 1, perPage = 20 }: PaginationParams) => {
  const take = Math.min(Math.max(perPage, 1), 100);
  const skip = (Math.max(page, 1) - 1) * take;

  return { take, skip };
};

