import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { useEffect } from "react";
import { toast } from "sonner";
import { Abi } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface IProps {
  auctionAddress: `0x${string}`;
}

export default function EndAuction({ auctionAddress }: IProps) {
  const { data: writeTxHash, writeContract } = useWriteContract();
  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  const handleEndAuction = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "endAuction",
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
    <button
      className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3"
      onClick={handleEndAuction}
      disabled={isTxLoading}
    >
      {isTxLoading ? "Ending..." : "End Auction"}
    </button>
  );
}
