export const isValidAddress = (addr: string | undefined): addr is `0x${string}` =>
  typeof addr === "string" && addr.startsWith("0x");

export const formattedWithCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};