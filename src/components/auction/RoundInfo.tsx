import { useEffect, useState } from "react";
import {
  // useAccount, 
  useReadContract
} from "wagmi";
import { toast } from "sonner";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { roundInfo } from "@/src/libs/constants";
import { Abi } from "viem";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";

interface RoundInfoProps {
  auctionAddress: `0x${string}`;
}

const roundInfoItems: CharterAuctionTypes.RoundInfoItem[] = [
  { label: "Round:", value: roundInfo.round },
  { label: "My Position:", value: roundInfo.myPosition },
  { label: "Target Price:", value: roundInfo.targetPrice },
  { label: "Action Left:", value: roundInfo.actionsLeft },
  { label: "My Stake:", value: roundInfo.myStake },
];

const RoundInfo = ({ auctionAddress }: RoundInfoProps) => {
  // const { address } = useAccount();

  const [roundInfo, setRoundInfo] = useState<CharterAuctionTypes.RoundInfoItem[]>(roundInfoItems);

  const {
    data: isBlindRoundEnded,
    error: isBlindRoundEndedError,
    // isLoading: isBlindRoundEndedLoading,
    // refetch: refetchIsBlindRoundEnded,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "isBlindRoundEnded",
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: currentRound,
    error: currentRoundError,
    // isLoading: isCurrentRoundLoading,
    // refetch: refetchCurrentRound,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "currentRound",
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: targetPrice,
    error: targetPriceError,
    // isLoading: isTargetPriceLoading,
    // refetch: refetchTargetPrice,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getTargetPrice",
    args: [
      currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
    ],
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (currentRoundError) {
      toast.error("Failed to fetch current round.", { id: "currentRoundLoading" });
    }

    if (targetPriceError) {
      toast.error("Failed to fetch target price.", { id: "targetPriceLoading" });
    }

    if (isBlindRoundEndedError) {
      toast.error("Failed to fetch isBlindRoundEnded.", { id: "isBlindRoundEndedLoading" });
    }
  }, [currentRoundError, targetPriceError, isBlindRoundEndedError]);

  useEffect(() => {
    setRoundInfo(prev =>
      prev.map(item => {
        if (item.label === "Round:") {
          return {
            ...item,
            value: isBlindRoundEnded ? currentRound?.toString() || "0" : "Blind Round"
          };
        }
        if (item.label === "Target Price:") {
          return {
            ...item,
            value: targetPrice?.toString() || "0"
          };
        }
        return item;
      })
    );
  }, [isBlindRoundEnded, currentRound, targetPrice]); 

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {roundInfo.map((item, index) => (
        <div key={index} className="flex gap-6">
          <span className="text-sm text-white font-bold">{item.label}</span>
          <span className="text-sm text-white font-normal">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RoundInfo;