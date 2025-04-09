export type ReadContractTypes = {
  data?: bigint | `0x${string}` | boolean | string | null;
  error?: Error | undefined;
  refetch?: () => void;
  isLoading?: boolean;
};

export type Usdt = {
  address: `0x${string}`;
  decimals: bigint;
};