const isValidAddress = (addr: string | undefined): addr is `0x${string}` =>
  typeof addr === "string" && addr.startsWith("0x");

export const contractAddress: `0x${string}` = isValidAddress(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
)
  ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  : "0xA8c39E72F2e5fb316bb6B39638A99179315e12bE";
