import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { GeneralTypes } from "@/src/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { Abi, formatEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

interface IProps {
  auctionAddress: `0x${string}`;
}

export default function ClaimReward({ auctionAddress }: IProps) {
  const { address } = useAccount();

  const { data: writeTxHash, writeContract } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  const handleClaimRewards = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "withdrawRewards",
    });
    toast.success("Rewards claimed successfully.");
  };
  
  const {
    data: rewards,
    error: rewardsError,
    // isLoading: isRewardsLoading,
    refetch: refetchRewards,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "rewards",
    args: [address || "0x0"],
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    // if (isRewardsLoading) {
    //   toast.loading("Fetching rewards...", { id: "rewardsLoading" });
    // }

    if (rewardsError) {
      toast.error("Failed to fetch rewards.", { id: "rewardsLoading" });
    }

    // if (rewards) {
    //   toast.success("Rewards fetched successfully!", { id: "rewardsLoading" });
    // }
  }, [rewardsError]);

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

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "RewardsWithdrawn",
    onLogs: (logs) => {
      console.log("RewardsWithdrawn event:", logs);
      refetchRewards?.();
    },
  });

  return (
    <div className="w-full">
      <h3 className="text-sm text-white font-bold">My Rewards</h3>
      <div className="border border-[#D9D9D940] rounded-2xl p-4 mt-5">
        <div className="flex gap-3">
          <span className="text-xs text-[#D9D9D9] font-normal">Total:</span>
          <span className="text-xs text-[#0CB400] font-bold">
            {rewards
              ? `$${
                  rewards
                    ? Number(formatEther(rewards as bigint)).toFixed(2)
                    : "0.00"
                }`
              : "$0.00"}
          </span>
        </div>
      </div>
      <div className="sm:text-end mt-3 sm:mb-0 mb-3">
        <button
          className="cursor-pointer mx-auto sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
          onClick={handleClaimRewards}
          disabled={isTxLoading}
        >
          {isTxLoading ? "Claiming..." : "Claim Rewards"}
        </button>
      </div>
    </div>
  );
}
