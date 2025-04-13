import { isValidAddress } from "@/src/utils/utils";
import { CharterAuctionTypes } from "@/src/types";

export const charterFactoryContractAddress: `0x${string}` = isValidAddress(
  process.env.NEXT_PUBLIC_CHARTER_FACTORY_CONTRACT_ADDRESS
)
  ? process.env.NEXT_PUBLIC_CHARTER_FACTORY_CONTRACT_ADDRESS
  : "0xA8c39E72F2e5fb316bb6B39638A99179315e12bE";

export const MAX_UINT256 = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

export const yachtInfoTemp = {
  title: "KING BENJI Yacht Charter",
  image: "/yacht.png",
  details: [
    { label: "Guests:", value: "up to 10" },
    {
      label: "Availability:",
      value: `21.06-28.06\n28.06-05.07\n28.08-30.08`,
    },
    {
      label: "Reserve Price:",
      value: "$300,000.00",
      bold: false,
    },
    { label: "Entry Fee:", value: "$1,000.00" },
    { label: "Blind Bid:", value: "$12,000.00" },
  ],
};

export const cardItems = [
  { seat: "001", price: "$13,579.15" },
  { seat: "001", price: "$13,579.15" },
];

export const roundInfo: {
  title: string;
  round: string;
  myPosition: string;
  targetPrice: string;
  actionsLeft: string;
  myStake: string;
  auctionTime: string;
} = {
  title: `BidCharter Auction #${1}`,
  round: "Blind Round",
  myPosition: "$0.00",
  targetPrice: "$0.00",
  actionsLeft: "6",
  myStake: "$8,000.00",
  auctionTime: "03:11:28",
};

export const chartData: CharterAuctionTypes.ChartDataItem[] = [
  { round: "R01", price: 12, leftBid: 20, rightBid: 0 },
  { round: "R02", price: 14, leftBid: 18, rightBid: 0 },
  { round: "R03", price: 16, leftBid: 15, rightBid: 0 },
  { round: "R04", price: 18, leftBid: 13, rightBid: 0 },
  { round: "R05", price: 20, leftBid: 11, rightBid: 0 },
  { round: "R06", price: 21, leftBid: 9, rightBid: 0 },
  { round: "R07", price: 22, leftBid: 0, rightBid: 5 },
  { round: "R08", price: 23, leftBid: 0, rightBid: 8 },
  { round: "R09", price: 24, leftBid: 0, rightBid: 12 },
  { round: "R10", price: 25, leftBid: 0, rightBid: 16 },
  { round: "R11", price: 27, leftBid: 0, rightBid: 20 },
  { round: "R12", price: 29, leftBid: 0, rightBid: 24 },
];
export const graphbarData: CharterAuctionTypes.GraphbarItem[] = [
  { round: "R01", price: 12, fillValue: 1 },
  { round: "R02", price: 14, fillValue: 1 },
  { round: "R03", price: 16, fillValue: 1 },
  { round: "R04", price: 18, fillValue: 1 },
  { round: "R05", price: 20, fillValue: 1 },
  { round: "R06", price: 21, fillValue: 1 },
  { round: "R07", price: 22, fillValue: 1 },
  { round: "R08", price: 23, fillValue: 1 },
  { round: "R09", price: 24, fillValue: 1 },
  { round: "R10", price: 25, fillValue: 1 },
  { round: "R11", price: 27, fillValue: 1 },
  { round: "R12", price: 29, fillValue: 1 },
];

export const bidPositions: CharterAuctionTypes.Position[] = [
  { seat: "001", price: "$13,579.15", index: 0 },
  { seat: "002", price: "$12,997.58", index: 1 },
  { seat: "004", price: "$12,997.58", index: 2 },
  { seat: "005", price: "$12,997.58", index: 3 },
  { seat: "006", price: "$12,997.58", index: 4 },
  { seat: "007", price: "$12,997.58", index: 5 },
  { seat: "008", price: "$12,997.58", index: 6 },
  { seat: "009", price: "$12,997.58", index: 7 },
  { seat: "010", price: "$12,997.58", index: 9 },
  { seat: "011", price: "$12,997.58", index: 10 },
  { seat: "012", price: "$12,997.58", index: 11 },
];