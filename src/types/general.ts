export type ReadContractTypes = {
  data?: bigint | `0x${string}` | boolean | string | null;
  error?: Error | undefined;
  refetch?: () => void;
  isLoading?: boolean;
};