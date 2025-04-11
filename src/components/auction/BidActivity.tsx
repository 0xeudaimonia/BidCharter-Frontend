import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { formattedWithCurrency } from "@/src/utils/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Abi, formatUnits } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

interface BidActivityProps {
  handleBidPosition: (index: number) => void;
  auctionAddress: `0x${string}`;
}

const BidActivity = ({
  handleBidPosition,
  auctionAddress,
}: BidActivityProps) => {
  const [roundPositions, setRoundPositions] = useState<
    CharterAuctionTypes.Position[]
  >([]);
  const {
    data: usdtAddress,
    error: usdtAddressError,
    // isLoading: isNftAddressLoading,
    // refetch: refetchNftAddress,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "usdt",
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: usdtDecimals,
    error: usdtDecimalsError,
    // isLoading: isNftAddressLoading,
    // refetch: refetchNftAddress,
  } = useReadContract({
    address: usdtAddress as `0x${string}`,
    abi: ERC20ABI as Abi,
    functionName: "decimals",
    // Error handling moved to useEffect
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
    data: roundPositionsCount,
    error: roundPositionsCountError,
    // isLoading: isCurrentRoundLoading,
    // refetch: refetchCurrentRound,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getRoundPositionsCount",
    args: [currentRound],
  }) as GeneralTypes.ReadContractTypes;

  const positionContracts = useMemo(() => {
    if (!roundPositionsCount) return [];
    return [...Array(Number(roundPositionsCount)).keys()].map(
      (positionIndex) => ({
        address: auctionAddress,
        abi: CharterAuctionABI as Abi,
        functionName: "getRoundPositionBidPrice",
        args: [currentRound, positionIndex + 1] as const,
      })
    );
  }, [roundPositionsCount, currentRound, auctionAddress]);

  const { data: roundPositionBidPrice, error: roundPositionBidPriceError } =
    useReadContracts({
      contracts: positionContracts,
    }) as CharterAuctionTypes.FetchRoundPositionBidPrice;

  useEffect(() => {
    if (!roundPositionBidPrice) return;
    console.log(usdtDecimals);
    setRoundPositions(
      roundPositionBidPrice
        .filter((bidPrice) => bidPrice.status === "success")
        .map((bidPrice, index) => ({
          seat: (index + 1).toString(),
          price: formattedWithCurrency(
            Number(formatUnits(bidPrice.result, Number(usdtDecimals)))
          ),
        }))
    );
  }, [roundPositionBidPrice, usdtDecimals]);

  useEffect(() => {
    if (currentRoundError) {
      toast.error("Failed to fetch current round.", {
        id: "currentRoundLoading",
      });
    }

    if (roundPositionsCountError) {
      toast.error("Failed to fetch round positions count.", {
        id: "roundPositionsCountLoading",
      });
    }

    if (roundPositionBidPriceError) {
      toast.error("Failed to fetch round position bid price.", {
        id: "roundPositionBidPriceLoading",
      });
    }
    if (usdtAddressError) {
      toast.error("Failed to fetch USDT address.", {
        id: "usdtAddressLoading",
      });
    }

    if (usdtDecimalsError) {
      toast.error("Failed to fetch USDT decimals.", {
        id: "usdtDecimalsLoading",
      });
    }
  }, [
    currentRoundError,
    roundPositionsCountError,
    roundPositionBidPriceError,
    usdtAddressError,
    usdtDecimalsError,
  ]);
  return (
    <div>
      <h3 className="text-sm text-white font-bold px-5">
        Current Bidding Activity
      </h3>
      <div className="py-3 px-5 mt-3">
        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <div className="text-sm text-white font-normal">Seat</div>
            <div className="text-sm text-white font-normal">Price</div>
            <div className="text-sm text-white font-normal">Action</div>
          </div>
          {roundPositions?.map(
            (pos: CharterAuctionTypes.Position, index: number) => (
              <div key={index} className="flex justify-between pt-2.5">
                <div className="text-xs text-[#D9D9D9] font-normal">
                  {pos.seat}
                </div>
                <div className="text-xs text-[#D95252] font-normal">
                  {pos.price}
                </div>
                <div
                  className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline"
                  onClick={() => handleBidPosition(index)}
                >
                  Merge
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BidActivity;
