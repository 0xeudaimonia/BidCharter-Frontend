"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Abi } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

import AuctionInfo from "@/src/components/auction/AuctionInfo";
import BidActivity from "@/src/components/auction/BidActivity";
import BidChart from "@/src/components/auction/BidChart";
import BlindBidCart from "@/src/components/auction/BlindBidCart";
import ClaimCharterNFT from "@/src/components/auction/ClaimCharterNFT";
import ClaimReward from "@/src/components/auction/ClaimReward";
import EndAuction from "@/src/components/auction/EndAuction";
import RoundInfo from "@/src/components/auction/RoundInfo";
import ShoppingCart from "@/src/components/auction/ShoppingCart";
import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";

interface RoundInfoRef extends HTMLDivElement {
  refreshRoundInfo: () => void;
}

interface AuctionInfoRef extends HTMLDivElement {
  refreshAuctionInfo: () => void;
}

interface BidActivityRef extends HTMLDivElement {
  refreshBidActivity: () => void;
}

export default function AuctionByIdPage() {
  const params = useParams();
  const { slug } = params;
  const auctionId = Number(slug) + 1;

  const roundInfoRef = useRef<RoundInfoRef>(null);
  const auctionInfoRef = useRef<AuctionInfoRef>(null);
  const bidActivityRef = useRef<BidActivityRef>(null);

  const { data: writeTxHash } = useWriteContract();

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
      roundInfoRef.current?.refreshRoundInfo();
      auctionInfoRef.current?.refreshAuctionInfo();
      bidActivityRef.current?.refreshBidActivity();
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
    data: currentRound,
    error: currentRoundError,
    // isLoading: isCurrentRoundLoading,
    refetch: refetchCurrentRound,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "currentRound",
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

  // Auction info derived from contract data
  const auctionInfo = {
    title: `BidCharter Auction #${auctionId}`,
    auctionTime: "03:11:28",
  };

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

  const handleRemovePosition = (position: CharterAuctionTypes.Position) => {
    setShoppingCart((prev) =>
      prev.filter((item) => item.seat !== position.seat)
    );
    toast.success("Position removed from shopping cart.");
  };

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BidPosition",
    onLogs: (logs) => {
      console.log("BidPosition event:", logs);
      roundInfoRef.current?.refreshRoundInfo();
      auctionInfoRef.current?.refreshAuctionInfo();
    },
  });

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BidPositions",
    onLogs: (logs) => {
      console.log("BidPosition event:", logs);
      roundInfoRef.current?.refreshRoundInfo();
      auctionInfoRef.current?.refreshAuctionInfo();
    },
  });

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "NFTWithdrawn",
    onLogs: (logs) => {
      console.log("NFTWithdrawn event:", logs);
      // refetchNftAddress?.();
    },
  });

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

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterFactoryABI as Abi,
    eventName: "NewRoundStarted",
    onLogs: (logs) => {
      console.log("NewRoundStarted event:", logs);
      toast.success("New round started.");
      refetchCurrentRound?.();
    },
  });

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BlindBidEntered",
    onLogs: (logs) => {
      console.log("BlindBidEntered event:", logs);
      toast.success("Blind bid entered.");
      bidActivityRef.current?.refreshBidActivity();
      // Refresh auction info to update the blind bid data
      auctionInfoRef.current?.refreshAuctionInfo();
      roundInfoRef.current?.refreshRoundInfo();
    },
  });

  // if (!auctionAddress) {
  //   return (
  //     <div className="min-h-screen bg-[#202020] text-white p-4">
  //       {error || "Loading auction data..."}
  //     </div>
  //   );
  // }

  // Error handling of BidActivity
  useEffect(() => {
    if (isBlindRoundEndedError) {
      toast.error("Failed to fetch blind round ended.", {
        id: "isBlindRoundEndedLoading",
      });
    }
    if (currentRoundError) {
      toast.error("Failed to fetch current round.", {
        id: "currentRoundLoading",
      });
    }
  }, [isBlindRoundEndedError, currentRoundError]);

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
        <RoundInfo
          ref={roundInfoRef}
          currentRound={currentRound as bigint}
          auctionAddress={auctionAddress as `0x${string}`}
          usdtDecimals={usdtDecimals as bigint}
          usdtAddress={usdtAddress as `0x${string}`}
        />

        <div className="sm:w-auto w-full">
          <button className="cursor-pointer sm:w-auto w-full bg-[#204119] text-sm text-[#CAFFDB] py-5 px-10">
            Auction Time: {auctionInfo.auctionTime}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-7 mt-8">
        <div className="w-full md:w-[20%]">
          <AuctionInfo
            ref={auctionInfoRef}
            auctionAddress={auctionAddress as `0x${string}`}
            usdt={{
              address: usdtAddress as `0x${string}`,
              decimals: usdtDecimals as bigint,
            }}
            entryFee={entryFee as bigint}
          />
          {isBlindRoundEnded && (
            <ShoppingCart
              shoppingCart={shoppingCart}
              handleRemovePosition={handleRemovePosition}
              auctionAddress={auctionAddress as `0x${string}`}
              usdt={{
                address: usdtAddress as `0x${string}`,
                decimals: usdtDecimals as bigint,
              }}
              entryFee={entryFee as bigint}
              usdtDecimals={usdtDecimals as bigint}
            />
          )}
          {!isBlindRoundEnded && (
            <BlindBidCart
              auctionAddress={auctionAddress as `0x${string}`}
              usdt={{
                address: usdtAddress as `0x${string}`,
                decimals: usdtDecimals as bigint,
              }}
              entryFee={entryFee as bigint}
            />
          )}
        </div>
        <div className="w-full md:w-[20%]">
          <BidActivity
            usdtDecimals={usdtDecimals as bigint}
            currentRound={currentRound as bigint}
            addToShoppingCart={addToShoppingCart}
            auctionAddress={auctionAddress as `0x${string}`}
            ref={bidActivityRef}
          />
        </div>

        <div className="w-full md:w-[40%]">
          <BidChart
            auctionAddress={auctionAddress as `0x${string}`}
            usdtDecimals={usdtDecimals as bigint}
            currentRound={currentRound as bigint}
          />
        </div>
        <div className="w-full md:w-[20%] flex flex-col justify-items-end sm:gap-[30%]">
          <ClaimReward auctionAddress={auctionAddress as `0x${string}`} />
          <div className="text-end flex flex-col sm:w-auto w-full">
            <ClaimCharterNFT auctionAddress={auctionAddress as `0x${string}`} />
            <EndAuction auctionAddress={auctionAddress as `0x${string}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
