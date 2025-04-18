import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { formattedWithCurrency } from "@/src/utils/utils";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Abi, formatUnits } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

interface BidActivityProps {
  usdtDecimals: bigint;
  currentRound: bigint;
  auctionAddress: `0x${string}`;
  addToShoppingCart: (bidItem: CharterAuctionTypes.Position) => void;
}

const BidActivity = forwardRef<
  { refreshBidActivity: () => void },
  BidActivityProps
>(({ usdtDecimals, currentRound, auctionAddress, addToShoppingCart }, ref) => {
  const [roundPositions, setRoundPositions] = useState<
    CharterAuctionTypes.Position[]
  >([]);

  const {
    data: roundPositionsCount,
    error: roundPositionsCountError,
    // isLoading: isRoundPositionsCountLoading,
    refetch: refetchRoundPositionsCount,
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
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "getRoundPositionBidPrice",
        args: [currentRound, positionIndex] as const,
      })
    );
  }, [roundPositionsCount, currentRound, auctionAddress]);

  const refreshBidActivity = () => {
    refetchRoundPositionsCount?.();
  };

  const { data: roundPositionBidPrice, error: roundPositionBidPriceError } =
    useReadContracts({
      contracts: positionContracts,
    }) as CharterAuctionTypes.FetchRoundBidData;

  useEffect(() => {
    if (!roundPositionBidPrice) return;

    const sortedPositions = roundPositionBidPrice
      .filter((bidPrice) => bidPrice.status === "success")
      .map((bidPrice, index) => ({
        price: Number(formatUnits(bidPrice.result, Number(usdtDecimals))),
        index: index,
      }))
      .sort((a, b) => b.price - a.price)
      .map((position) => ({
        ...position,
        seat: (position.index).toString().padStart(3, "0"),
        price: formattedWithCurrency(position.price),
      }));

    setRoundPositions(sortedPositions);
  }, [roundPositionBidPrice, usdtDecimals]);

  useEffect(() => {
    if (roundPositionBidPriceError) {
      toast.error("Failed to fetch round position bid price.", {
        id: "roundPositionBidPriceLoading",
      });
    }

    if (roundPositionsCountError) {
      toast.error("Failed to fetch round positions count.", {
        id: "roundPositionsCountLoading",
      });
    }
  }, [roundPositionBidPriceError, roundPositionsCountError]);

  useEffect(() => {
    if (typeof ref === "object" && ref?.current) {
      ref.current.refreshBidActivity = refreshBidActivity;
    }
  }, [ref]);

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
                  onClick={() => addToShoppingCart(pos)}
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
});

BidActivity.displayName = "BidActivity";

export default BidActivity;
