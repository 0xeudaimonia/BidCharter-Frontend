"use client";
import AuctionInfo from "@/src/components/auction/AuctionInfo";
import BidActivity from "@/src/components/auction/BidActivity";
import BidChart from "@/src/components/auction/BidChart";
import BlindBidCart from "@/src/components/auction/BlindBidCart";
import RoundInfo from "@/src/components/auction/RoundInfo";
import ShoppingCart from "@/src/components/auction/ShoppingCart";
import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { chartData, charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Abi, formatEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

export default function AuctionByIdPage() {
  const params = useParams();
  const { slug } = params;
  const auctionId = Number(slug) + 1;

  const { address } = useAccount();

  const { data: writeTxHash, writeContract } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: writeTxHash });

  // Shopping Cart
  const [shoppingCart, setShoppingCart] = useState<
    CharterAuctionTypes.Position[]
  >([]);

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
    if (auctionAddressError) {
      toast.error("Failed to fetch auction address.", {
        id: "auctionAddressLoading",
      });
    }

    if (usdtAddressError) {
      toast.error("Failed to fetch usdt address.", {
        id: "usdtAddressLoading",
      });
    }

    if (usdtDecimalsError) {
      toast.error("Failed to fetch usdt decimals.", {
        id: "usdtDecimalsLoading",
      });
    }

    if (entryFeeError) {
      toast.error("Failed to fetch entry fee.", { id: "entryFeeLoading" });
    }
  }, [auctionAddressError, usdtAddressError, usdtDecimalsError, entryFeeError]);

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

  // Auction info derived from contract data
  const auctionInfo = {
    title: `BidCharter Auction #${auctionId}`,
    auctionTime: "03:11:28",
  };

  const addToShoppingCart = (bidItem: CharterAuctionTypes.Position) => {
    // Check if the item is already in the shopping cart
    const isAlreadyInCart = shoppingCart.some(
      (item) => item.seat === bidItem.seat
    );

    if (isAlreadyInCart) {
      toast.warning("This item is already in your shopping cart.");
      return;
    }

    setShoppingCart((prev) => [...prev, bidItem]);
    toast.success("Added to shopping cart.");
  };

  const handleBidPosition = () => {
    if (shoppingCart.length === 0) {
      toast.warning("Please select at least one position.");
      return;
    }
    if (shoppingCart.length === 1) {
      writeContract(
        {
          address: auctionAddress as `0x${string}`,
          abi: CharterAuctionABI as Abi,
          functionName: "bidPosition",
          args: [BigInt(shoppingCart[0].index)],
        },
        {
          onSuccess: () => {
            toast.success("Position bid successfully.");
            setShoppingCart([]);
          },
          onError: () => {
            toast.error("Failed to bid position.");
          },
        }
      );
    }
    if (shoppingCart.length > 1) {
      writeContract(
        {
          address: auctionAddress as `0x${string}`,
          abi: CharterAuctionABI as Abi,
          functionName: "bidPositions",
          args: [shoppingCart.map((item) => BigInt(item.index))],
        },
        {
          onSuccess: () => {
            toast.success("Positions bid successfully.");
            setShoppingCart([]);
          },
          onError: () => {
            toast.error("Failed to bid positions.");
          },
        }
      );
    }
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BidPosition",
    onLogs: (logs) => {
      console.log("BidPosition event:", logs);
      // refetchCurrentRound?.();
      // refetchPositions?.();
    },
  });

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BidPositions",
    onLogs: (logs) => {
      console.log("BidPosition event:", logs);
      // refetchCurrentRound?.();
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
      // refetchNftAddress?.();
    },
  });

  const handleEndRound = () => {
    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "turnToNextRound",
    });
  };

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
      // refetchCurrentRound?.();
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
        <RoundInfo auctionAddress={auctionAddress as `0x${string}`} />

        <div className="sm:w-auto w-full">
          <button className="cursor-pointer sm:w-auto w-full bg-[#204119] text-sm text-[#CAFFDB] py-5 px-10">
            Auction Time: {auctionInfo.auctionTime}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-7 mt-8">
        <div className="w-full md:w-[20%]">
          <AuctionInfo
            auctionAddress={auctionAddress as `0x${string}`}
            usdt={{
              address: usdtAddress as `0x${string}`,
              decimals: usdtDecimals as bigint,
            }}
            entryFee={entryFee as bigint}
          />
          <ShoppingCart
            shoppingCart={shoppingCart}
            handleBidPosition={handleBidPosition}
          />
          <BlindBidCart
            auctionAddress={auctionAddress as `0x${string}`}
            usdt={{
              address: usdtAddress as `0x${string}`,
              decimals: usdtDecimals as bigint,
            }}
            entryFee={entryFee as bigint}
          />
        </div>
        <div className="w-full md:w-[20%]">
          <BidActivity
            auctionAddress={auctionAddress as `0x${string}`}
            usdtDecimals={usdtDecimals as bigint}
            addToShoppingCart={addToShoppingCart}
          />
        </div>

        <div className="w-full md:w-[40%]">
          <BidChart
            chartData={chartData}
            auctionAddress={auctionAddress as `0x${string}`}
            usdtDecimals={usdtDecimals as bigint}
          />
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
