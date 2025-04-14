import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { Abi } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import InfoRow from "./InfoRow";

interface IProps {
  shoppingCart: CharterAuctionTypes.Position[];
  handleBidPosition: () => void;
  handleRemovePosition: (position: CharterAuctionTypes.Position) => void;
  auctionAddress: `0x${string}`;
  usdt: GeneralTypes.Usdt;
  entryFee: bigint;
}

export default function ShoppingCart({
  shoppingCart,
  auctionAddress,
  usdt,
  entryFee,
  handleBidPosition,
  handleRemovePosition,
}: IProps) {
  const { data: writeTxHash, writeContract } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  const handleApprove = () => {
    writeContract(
      {
        address: usdt?.address as `0x${string}`,
        abi: ERC20ABI as Abi,
        functionName: "approve",
        args: [
          auctionAddress as `0x${string}`,
          (entryFee * BigInt(shoppingCart.length)) as bigint,
        ],
      },
      {
        onSuccess: () => {
          console.log("Approved");
        },
        onError: (error) => {
          console.error("Error approving:", error);
        },
      }
    );
  };

  const handleEndRound = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "turnToNextRound",
    });
  };

  useEffect(() => {
    if (isTxLoading) {
      toast.loading("Transaction is pending...", { id: "transactionLoading" });
    }

    if (isTxSuccess) {
      toast.success("Transaction was successful!", {
        id: "transactionLoading",
      });
    }

    if (isTxError) {
      toast.error("Transaction failed!", { id: "transactionLoading" });
    }
  }, [isTxSuccess, isTxLoading, isTxError]);

  return (
    <div>
      <h3 className="text-sm mt-5 text-white font-bold">My Shopping Cart</h3>
      <div className="border border-[#D9D9D940] rounded-2xl py-3 px-5 mt-3">
        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <div className="text-sm text-white font-normal">Seat</div>
            <div className="text-sm text-white font-normal">Price</div>
            <div className="text-sm text-white font-normal">Action</div>
          </div>

          {shoppingCart.map((item, index) => (
            <div key={index} className="flex justify-between pt-2.5">
              <div className="text-xs text-[#D9D9D9] font-normal">
                {item.seat}
              </div>
              <div className="text-xs text-[#D9D9D9] font-normal">
                {item.price}
              </div>
              <div
                className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline"
                onClick={() => handleRemovePosition(item)}
              >
                Remove
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoRow label="My New Position:" value="$12,521.00" />

      <div className="text-center flex items-center gap-3 flex-wrap mt-5">
        <button
          onClick={handleApprove}
          className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
        >
          Approve
        </button>
        <button
          onClick={handleBidPosition}
          className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
        >
          Merge Positions
        </button>

        <button
          className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3"
          onClick={handleEndRound}
          disabled={isTxLoading}
        >
          {isTxLoading ? "Ending..." : "End Round"}
        </button>
      </div>
    </div>
  );
}
