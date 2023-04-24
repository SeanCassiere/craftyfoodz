import { api } from "../utils/api";

export function useGetAuthUser() {
  const query = api.auth.getUser.useQuery(undefined, {
    staleTime: 60 * 1000 * 2, // 2 minutes
  });

  return query;
}
