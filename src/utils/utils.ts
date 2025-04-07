export const isValidAddress = (addr: string | undefined): addr is `0x${string}` =>
  typeof addr === "string" && addr.startsWith("0x");