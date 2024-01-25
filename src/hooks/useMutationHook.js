import { useMutation } from "@tanstack/react-query";

export function useMutationHook(fnCallback) {
  const mutation = useMutation({
    mutationFn: fnCallback,
  });
  return mutation;
}
