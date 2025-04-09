"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { Abi, formatEther } from "viem";
import { useParams } from "next/navigation";
import { charterFactoryContractAddress, chartData, graphbarData, bidPositions } from "@/src/libs/constants";
import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import { CharterNFTABI } from "@/src/libs/abi/CharterNFT";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { toast } from "sonner";
import ShoppingCart from "@/src/components/auction/ShoppingCart";
import AuctionInfo from "@/src/components/auction/AuctionInfo";
import RoundInfo from "@/src/components/auction/RoundInfo";
import BidActivity from "@/src/components/auction/BidActivity";
import BidChart from "@/src/components/auction/BidChart";


export default function AuctionByIdPage() {
  const params = useParams();
  const { slug } = params;
  const auctionId = slug as string;

  const { address } = useAccount();

  const {
    data: writeTxHash,
    writeContract,
  } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  useEffect(() => {
    if (isTxLoading) {
      toast.loading("Transaction is pending...", { id: "transactionPending" });
    }

    if (isTxSuccess) {
      toast.success("Transaction was successful!", { id: "transactionPending" });
    }

    if (isTxError) {
      toast.error("Transaction failed!", { id: "transactionPending" });
    }
  }, [isTxSuccess, isTxLoading, isTxError]);

  const {
    data: auctionAddress,
    error: auctionAddressError,
    // isLoading: isAuctionAddressLoading,
    // refetch: refetchAuctionAddress,
  } = useReadContract({
    address: charterFactoryContractAddress as `0x${string}`,
    abi: CharterFactoryABI,
    functionName: "getAuctionAddress",
    args: [BigInt(auctionId)],
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    // if (isAuctionAddressLoading) {
    //   toast.loading("Fetching auction address...", { id: "auctionAddressLoading" });
    // }

    if (auctionAddressError) {
      toast.error("Failed to fetch auction address.", { id: "auctionAddressLoading" });
    }

    // if (auctionAddress) {
    //   toast.success("Auction address fetched successfully!", { id: "auctionAddressLoading" });
    // }
  }, [auctionAddressError]);

  const {
    data: nftAddress,
    error: nftAddressError,
    // isLoading: isNftAddressLoading,
    refetch: refetchNftAddress,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nft",
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    // if (isNftAddressLoading) {
    //   toast.loading("Fetching NFT address...", { id: "nftAddressLoading" });
    // }

    if (nftAddressError) {
      toast.error("Failed to fetch NFT address.", { id: "nftAddressLoading" });
    }

    // if (nftAddress) {
    //   toast.success("NFT address fetched successfully!", { id: "nftAddressLoading" });
    // }
  }, [nftAddressError]);

  const {
    data: currentRound,
    error: currentRoundError,
    // isLoading: isCurrentRoundLoading,
    refetch: refetchCurrentRound,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "currentRound",
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    // if (isCurrentRoundLoading) {
    //   toast.loading("Fetching current round...", { id: "currentRoundLoading" });
    // }

    if (currentRoundError) {
      toast.error("Failed to fetch current round.", { id: "currentRoundLoading" });
    }

    // if (currentRound) {
    //   toast.success("Current round fetched successfully!", { id: "currentRoundLoading" });
    // }
  }, [currentRoundError]);
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

  useEffect(() => {
    // if (isBlindRoundEndedLoading) {
    //   toast.loading("Fetching isBlindRoundEnded...", { id: "isBlindRoundEndedLoading" });
    // }

    if (isBlindRoundEndedError) {
      toast.error("Failed to fetch isBlindRoundEnded.", { id: "isBlindRoundEndedLoading" });
    }

    // if (isBlindRoundEnded) {
    //   toast.success("isBlindRoundEnded fetched successfully!", { id: "isBlindRoundEndedLoading" });
    // }
  }, [isBlindRoundEndedError]);

  const {
    data: entryFee,
    error: entryFeeError,
    // isLoading: isEntryFeeLoading,
    // refetch: refetchEntryFee,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "entryFee",
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (entryFeeError) {
      toast.error("Failed to fetch entry fee.", { id: "entryFeeLoading" });
    }

    // if (entryFee) {
    //   toast.success("Entry fee fetched successfully!", { id: "entryFeeLoading" });
    // }

    // if (isEntryFeeLoading) {
    //   toast.loading("Fetching entry fee...", { id: "entryFeeLoading" });
    // }
  }, [entryFee, entryFeeError]);

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

  // const {
  //   data: positions,
  //   error: positionsError,
  //   // isLoading: isPositionsLoading,
  //   refetch: refetchPositions,
  // } = useReadContract({
  //   address: auctionAddress as `0x${string}`,
  //   abi: CharterAuctionABI as Abi,
  //   functionName: "getRoundPositions",
  //   args: [currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0)],
  // }) as GeneralTypes.ReadContractTypes;
  
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
    if (targetPriceError) {
      toast.error("Failed to fetch target price.", { id: "targetPriceLoading" });
    }

    // if (targetPrice) {
    //   toast.success("Target price fetched successfully!", { id: "targetPriceLoading" });
    // }

    // if (isTargetPriceLoading) {
    //   toast.loading("Fetching target price...", { id: "targetPriceLoading" });
    // }
  }, [targetPriceError]);

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

  const {
    data: nftId,
    error: nftIdError,
    // isLoading: isNftIdLoading,
    // refetch: refetchNftId,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nftId",
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (nftIdError) {
      toast.error("Failed to fetch NFT ID.", { id: "nftIdLoading" });
    }

    // if (nftId) {
    //   toast.success("NFT ID fetched successfully!", { id: "nftIdLoading" });
    // }

    // if (isNftIdLoading) {
    //   toast.loading("Fetching NFT ID...", { id: "nftIdLoading" });
    // }
  }, [nftIdError]);

  const {
    data: tokenURI,
    error: tokenURIError,
    // isLoading: isTokenURILoading,
    // refetch: refetchTokenURI,
  } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: CharterNFTABI,
    functionName: "tokenURI",
    args: nftId ? [BigInt(nftId.toString())] : [BigInt(0)],
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (tokenURIError) {
      toast.error("Failed to fetch token URI.", { id: "tokenURILoading" });
    }

    // if (isTokenURILoading) {
    //   toast.loading("Fetching token URI...", { id: "tokenURILoading" });
    // }

    // if (tokenURI) {
    //   toast.success("Token URI fetched successfully!", { id: "tokenURILoading" });
    // }
  }, [tokenURIError]);

  const [nftMetadata, setNftMetadata] = useState<CharterAuctionTypes.NFTMetadata | null>(null);

  console.log("nftMetadata", nftMetadata);
  console.log("isBlindRoundEnded", isBlindRoundEnded);

  useEffect(() => {
    if (tokenURI) {
      if (typeof tokenURI === "string") {
        fetch(tokenURI)
          .then((res) => res.json())
          .then((data) => setNftMetadata(data))
          .catch((err) => {
            console.error("Failed to fetch NFT metadata:", err);
            toast.error("Failed to fetch NFT metadata.");
          });
      } else {
        toast.error("Invalid tokenURI.");
      }
    }
  }, [tokenURI]);

  // Auction info derived from contract data
  const auctionInfo = {
    title: `BidCharter Auction #${auctionId}`,
    auctionTime: "03:11:28",
  };

  const handleBidPosition = (positionIndex: number) => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "bidPosition",
      args: [BigInt(positionIndex)],
    });
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BidPosition",
    onLogs: (logs) => {
      console.log("BidPosition event:", logs);
      refetchCurrentRound?.();
      // refetchPositions?.();
    },
  });

  const handleClaimRewards = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "withdrawRewards",
    });
    toast.success("Rewards claimed successfully.");
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "RewardsWithdrawn",
    onLogs: (logs) => {
      console.log("RewardsWithdrawn event:", logs);
      refetchRewards?.();
    },
  });

  const handleClaimNFT = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "withdrawNFT",
    });
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "NFTWithdrawn",
    onLogs: (logs) => {
      console.log("NFTWithdrawn event:", logs);
      refetchNftAddress?.();
    },
  });

  const handleEndRound = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "turnToNextRound",
    });
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "NewRoundStarted",
    onLogs: (logs) => {
      console.log("NewRoundStarted event:", logs);
      refetchCurrentRound?.();
      // refetchPositions?.();
    },
  });

  const handleEndAuction = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "endAuction",
    });
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "EndAuction",
    onLogs: (logs) => {
      console.log("EndAuction event:", logs);
      refetchCurrentRound?.();
      // refetchPositions?.();
    },
  });

  // if (!auctionAddress) {
  //   return (
  //     <div className="min-h-screen bg-[#202020] text-white p-4">
  //       {error || "Loading auction data..."}
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#202020] text-white p-4">
      <header className="flex flex-col md:flex-row justify-between">
        <h3 className="text-2xl text-white font-inter font-extrabold">
          {auctionInfo.title}
        </h3>
        <ConnectButton />
      </header>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Link href="/auction">
            <p className="text-sm text-white font-normal">
              Back to List of Auctions
            </p>
          </Link>
        </div>
        <RoundInfo />

        <div className="sm:w-auto w-full">
          <button className="cursor-pointer sm:w-auto w-full bg-[#204119] text-sm text-[#CAFFDB] py-5 px-10">
            Auction Time: {auctionInfo.auctionTime}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-7 mt-8">
        <div className="w-full md:w-[20%]">
          <AuctionInfo />
          <ShoppingCart />
        </div>
        <div className="w-full md:w-[20%]">
          <BidActivity positions={bidPositions} handleBidPosition={handleBidPosition} />
        </div>

        <div className="w-full md:w-[40%]">
          <BidChart chartData={chartData} graphbarData={graphbarData} targetPrice={targetPrice?.toString() || "0.00"} />
        </div>

        <div className="w-full md:w-[20%] flex flex-col justify-items-end sm:gap-[30%]">
          <div className="w-full">
            <h3 className="text-sm text-white font-bold">My Rewards</h3>
            <div className="border border-[#D9D9D940] rounded-2xl p-4 mt-5">
              <div className="flex gap-3">
                <span className="text-xs text-[#D9D9D9] font-normal">
                  Total:
                </span>
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

          <div className="text-end flex flex-col sm:w-auto w-full">
            <button
              className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
              onClick={handleClaimNFT}
              disabled={isTxLoading || winner !== address}
            >
              {isTxLoading ? "Claiming..." : "Claim Charter NFT"}
            </button>
            <button
              className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3"
              onClick={handleEndRound}
              disabled={isTxLoading}
            >
              {isTxLoading ? "Ending..." : "End Round"}
            </button>
            <button
              className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3"
              onClick={handleEndAuction}
              disabled={isTxLoading}
            >
              {isTxLoading ? "Ending..." : "End Auction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
