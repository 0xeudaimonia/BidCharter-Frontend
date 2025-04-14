import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  // useAccount,
  useReadContract,
  useReadContracts,
} from "wagmi";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { formattedWithCurrency } from "@/src/utils/utils";
import { Abi, formatUnits } from "viem";

interface RoundInfoProps {
  auctionAddress: `0x${string}`;
  usdtDecimals: bigint;
  winner: `0x${string}`;
  roundPositionBidPrice?: {
    result: bigint;
    status: string;
  }[];
}

const RoundInfo = ({
  auctionAddress,
  usdtDecimals,
  winner,
  roundPositionBidPrice,
}: RoundInfoProps) => {
  const { address } = useAccount();

  const [roundInfo, setRoundInfo] = useState<
    CharterAuctionTypes.RoundInfoItem[]
  >([
    { label: "Round:", value: "0" },
    { label: "My Position:", value: "0" },
    { label: "Target Price:", value: "0" },
    { label: "Winner:", value: winner },
    { label: "Stake Funds:", value: "0" },
  ]);

  const [myBidderIndex, setMyBidderIndex] = useState<number | undefined>(
    undefined
  );
  const [myLatestBidPosition, setMyLatestBidPosition] = useState<
    number | undefined
  >(undefined);

  const stakeFunds = useMemo(() => {
    return formattedWithCurrency(
      roundPositionBidPrice?.reduce((acc, curr) => {
        return acc + Number(formatUnits(curr.result, Number(usdtDecimals)));
      }, 0) || 0
    );
  }, [roundPositionBidPrice, usdtDecimals]);

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

  const {
    data: getRoundBiddersCount,
    error: getRoundBiddersCountError,
    // isLoading: isRoundBidderLoading,
    // refetch: refetchRoundBidder,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getRoundBiddersCount",
  }) as GeneralTypes.ReadContractTypes;

  const rounderBidderContracts = useMemo(() => {
    return Array.from({ length: Number(getRoundBiddersCount) }, (_, index) => {
      return {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "getRoundBidder",
        args: [
          currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
          index,
        ],
      };
    });
  }, [getRoundBiddersCount, currentRound, auctionAddress]);

  const {
    data: rounderBidderContractsData,
    error: rounderBidderContractsError,
  } = useReadContracts({
    contracts: rounderBidderContracts,
  });

  const { data: myBidderIndexData, error: myBidderIndexError } =
    useReadContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "getRoundBidderBidPricesCount",
      args: [
        currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
        myBidderIndex !== undefined ? BigInt(myBidderIndex) : undefined,
      ],
    }) as GeneralTypes.ReadContractTypes;

  const { data: rounderBidderBidPrice, error: rounderBidderBidPriceError } =
    useReadContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "getRoundBidderBidPrice",
      args: [
        currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
        myBidderIndex !== undefined ? BigInt(myBidderIndex) : undefined,
        myLatestBidPosition !== undefined
          ? BigInt(myLatestBidPosition)
          : undefined,
      ],
    }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (rounderBidderContractsData) {
      const myBidderIndex = rounderBidderContractsData.findIndex(
        (contract) => contract.result === address
      );
      setMyBidderIndex(myBidderIndex);
    }
  }, [rounderBidderContractsData, address]);

  useEffect(() => {
    if (myBidderIndexData) {
      setMyLatestBidPosition(Number(myBidderIndexData) - 1);
    }
  }, [myBidderIndexData]);

  useEffect(() => {
    if (currentRoundError) {
      toast.error("Failed to fetch current round.", {
        id: "currentRoundLoading",
      });
    }

    if (targetPriceError) {
      toast.error("Failed to fetch target price.", {
        id: "targetPriceLoading",
      });
    }

    if (isBlindRoundEndedError) {
      toast.error("Failed to fetch isBlindRoundEnded.", {
        id: "isBlindRoundEndedLoading",
      });
    }

    if (getRoundBiddersCountError) {
      toast.error("Failed to fetch getRoundBiddersCount.", {
        id: "getRoundBiddersCountLoading",
      });
    }

    if (rounderBidderContractsError) {
      toast.error("Failed to fetch rounderBidderContracts.", {
        id: "rounderBidderContractsLoading",
      });
    }

    if (rounderBidderBidPriceError) {
      toast.error("Failed to fetch rounderBidderBidPrice.", {
        id: "rounderBidderBidPriceLoading",
      });
    }
  }, [
    currentRoundError,
    targetPriceError,
    isBlindRoundEndedError,
    getRoundBiddersCountError,
    rounderBidderContractsError,
    rounderBidderBidPriceError,
    myBidderIndexError,
  ]);

  useEffect(() => {
    const roundValue = isBlindRoundEnded
      ? (Number(currentRound) + 1)?.toString() || "0"
      : "Blind Round";

    const formattedTargetPrice = targetPrice
      ? formatUnits(targetPrice as bigint, Number(usdtDecimals))
      : 0;
    const targetPriceValue = formattedWithCurrency(
      Number(formattedTargetPrice)
    );

    const myPositionValue = formattedWithCurrency(
      rounderBidderBidPrice
        ? Number(
            formatUnits(rounderBidderBidPrice as bigint, Number(usdtDecimals))
          )
        : 0
    );

    setRoundInfo([
      { label: "Round:", value: roundValue },
      { label: "Target Price:", value: targetPriceValue },
      { label: "My Position:", value: myPositionValue },
      { label: "Winner:", value: winner },
      { label: "Stake Funds:", value: stakeFunds.toString() },
    ]);
  }, [
    isBlindRoundEnded,
    currentRound,
    targetPrice,
    myLatestBidPosition,
    usdtDecimals,
    rounderBidderBidPrice,
    winner,
    stakeFunds,
  ]);

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {roundInfo.map((item, index) => (
        <div key={index} className="flex gap-6">
          <span className="text-sm text-white font-bold">{item.label}</span>
          <span className="text-sm text-white font-normal">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default RoundInfo;
