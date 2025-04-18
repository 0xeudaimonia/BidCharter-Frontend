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

export const bidPositions: CharterAuctionTypes.Position[] = [
  { seat: "001", price: "$13,579.15" },
  { seat: "002", price: "$12,997.58" },
  { seat: "004", price: "$12,997.58" },
];