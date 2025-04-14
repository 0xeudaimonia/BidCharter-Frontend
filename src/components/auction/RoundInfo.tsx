import { useEffect, useMemo, useState, forwardRef } from "react";
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
import { ERC20ABI } from "@/src/libs/abi/ERC20";

interface RoundInfoProps {
  auctionAddress: `0x${string}`;
  currentRound: bigint;
  usdtDecimals: bigint;
  usdtAddress: `0x${string}`;
}

const RoundInfo = forwardRef<{ refreshRoundInfo: () => void }, RoundInfoProps>(
  ({
    auctionAddress,
    currentRound,
    usdtDecimals,
    usdtAddress,
  }: RoundInfoProps,
  ref
) => {
  const { address } = useAccount();

  const [roundInfo, setRoundInfo] = useState<
    CharterAuctionTypes.RoundInfoItem[]
  >([
    { label: "Round:", value: "0" },
    { label: "My Position:", value: "0" },
    { label: "Target Price:", value: "0" },
    { label: "Winner:", value: "" },
    { label: "Staked Funds:", value: "0" },
  ]);

  const [myBidderIndex, setMyBidderIndex] = useState<number | undefined>(
    undefined
  );
  const [myLatestBidPosition, setMyLatestBidPosition] = useState<
    number | undefined
  >(undefined);

  const {
    data: isBlindRoundEnded,
    error: isBlindRoundEndedError,
    // isLoading: isBlindRoundEndedLoading,
    refetch: refetchIsBlindRoundEnded,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "isBlindRoundEnded",
  }) as GeneralTypes.ReadContractTypes;

  const { 
    data: stakedFunds, 
    error: stakedFundsError,
    refetch: refetchStakedFunds
  } = useReadContract({
    address: usdtAddress as `0x${string}`,
    abi: ERC20ABI as Abi,
    functionName: "balanceOf",
    args: [auctionAddress as `0x${string}`],
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: targetPrice,
    error: targetPriceError,
    // isLoading: isTargetPriceLoading,
    refetch: refetchTargetPrice,
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
    refetch: refetchRoundBidder,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getRoundBiddersCount",
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: winner,
    error: winnerError,
    // isLoading: isWinnerLoading,
    refetch: refetchWinner,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "winner",
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
    refetch: refetchRounderBidderContracts,
  } = useReadContracts({
    contracts: rounderBidderContracts,
  });

  const {
    data: myBidderIndexData,
    error: myBidderIndexError,
    refetch: refetchMyBidderIndex,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getRoundBidderBidPricesCount",
    args: [
        currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
        myBidderIndex !== undefined ? BigInt(myBidderIndex) : undefined,
      ],
    }) as GeneralTypes.ReadContractTypes;

  const {
    data: rounderBidderBidPrice,
    error: rounderBidderBidPriceError,
    refetch: refetchRounderBidderBidPrice,
  } = useReadContract({
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

    if (winnerError) {
      toast.error("Failed to fetch winner.", {
        id: "winnerLoading",
      });
    }

    if (stakedFundsError) {
      toast.error("Failed to fetch staked funds.", {
        id: "stakedFundsLoading",
      });
    }
  }, [
    targetPriceError,
    isBlindRoundEndedError,
    getRoundBiddersCountError,
    rounderBidderContractsError,
    rounderBidderBidPriceError,
    myBidderIndexError,
    winnerError,
    stakedFundsError,
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

    const stakedFundsValue = formattedWithCurrency(
      stakedFunds
        ? Number(formatUnits(stakedFunds as bigint, Number(usdtDecimals)))
        : 0
    );

    setRoundInfo([
      { label: "Round:", value: roundValue },
      { label: "Target Price:", value: targetPriceValue },
      { label: "My Position:", value: myPositionValue },
      { label: "Winner:", value: winner as `0x${string}` },
      { label: "Staked Funds:", value: stakedFundsValue },
    ]);
  }, [
    isBlindRoundEnded,
    currentRound,
    targetPrice,
    myLatestBidPosition,
    usdtDecimals,
    rounderBidderBidPrice,
    winner,
    stakedFunds,
  ]);

  const refreshRoundInfo = () => {
    refetchIsBlindRoundEnded?.();
    refetchStakedFunds?.();
    refetchTargetPrice?.();
    refetchRoundBidder?.();
    refetchWinner?.();
    refetchRounderBidderContracts?.();
    refetchMyBidderIndex?.();
    refetchRounderBidderBidPrice?.();
  };

  // Expose refreshRoundInfo through ref
  useEffect(() => {
    if (typeof ref === 'object' && ref?.current) {
      ref.current.refreshRoundInfo = refreshRoundInfo;
    }
  }, [ref]);

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
});

RoundInfo.displayName = 'RoundInfo';

export default RoundInfo;
