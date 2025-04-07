import { isValidAddress } from "@/src/utils/utils";

export const charterFactoryContractAddress: `0x${string}` = isValidAddress(
  process.env.NEXT_PUBLIC_CHARTER_FACTORY_CONTRACT_ADDRESS
)
  ? process.env.NEXT_PUBLIC_CHARTER_FACTORY_CONTRACT_ADDRESS
  : "0xA8c39E72F2e5fb316bb6B39638A99179315e12bE";
