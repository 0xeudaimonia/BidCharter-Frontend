import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { GeneralTypes } from "@/src/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { Abi } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface IProps {
  auctionAddress: `0x${string}`;
}

export default function ClaimCharterNFT({ auctionAddress }: IProps) {
  const { address } = useAccount();
  const { data: writeTxHash, writeContract } = useWriteContract();
  const {
    data: winner,
    error: winnerError,
    // isLoading: isWinnerLoading,
    // refetch: refetchWinner,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "winner",
  }) as GeneralTypes.ReadContractTypes;

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  const handleClaimNFT = () => {
    // toast.loading("Claiming NFT...", { id: "claimNFTLoading" });
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "withdrawNFT",
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

  useEffect(() => {
    if (winnerError) {
      toast.error("Failed to fetch winner.", { id: "winnerLoading" });
    }

    // if (winner) {
    //   toast.success("Winner fetched successfully!", { id: "winnerLoading" });
    // }

    // if (isWinnerLoading) {
    //   toast.loading("Fetching winner...", { id: "winnerLoading" });
    // }
  }, [winnerError]);

  return (
    <button
      className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
      onClick={handleClaimNFT}
      disabled={isTxLoading || winner !== address}
    >
      {isTxLoading ? "Claiming..." : "Claim Charter NFT"}
    </button>
  );
}
