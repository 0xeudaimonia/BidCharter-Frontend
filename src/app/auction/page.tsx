"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import {
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import LoadingSkeleton from "@/src/components/LoadingSkeleton";
import { Abi } from "viem";

import { AuctionCreateTypes } from "@/src/types";
import Link from "next/link";
import { toast } from "sonner";

export default function AuctionListPage() {
  // State
  // const [inputValues, setInputValues] = useState<AuctionCreate.InputValues>({});
  const [auctionData, setAuctionData] = useState<AuctionCreateTypes.Auction[]>([]);

  const { 
    data: totalAuctions, 
    error: totalAuctionsError, 
    refetch: refetchTotalAuctions, 
    isLoading: isTotalAuctionsLoading 
  } = useReadContract({
    address: charterFactoryContractAddress,
    abi: CharterFactoryABI as Abi,
    functionName: "getTotalAuctions",
  }) as AuctionCreateTypes.ReadContractTypes;

  const auctionContracts = useMemo(() => {
    if (!totalAuctions) return [];
    return [...Array(Number(totalAuctions)).keys()].map((auctionId) => ({
      address: charterFactoryContractAddress,
      abi: CharterFactoryABI as Abi,
      functionName: "getAuctionAddress",
      args: [auctionId] as const,
    }));
  }, [totalAuctions]);

  const {
    data: auctionAddresses,
    error: auctionAddressesError,
    isLoading: isAuctionAddressesLoading,
    refetch: refetchAuctionAddresses,
  } = useReadContracts({
    contracts: auctionContracts,
  }) as AuctionCreateTypes.ReadContractTypes;

  useEffect(() => {
    if (totalAuctionsError) {
      toast.error(totalAuctionsError.message.split(".")[0]);
    }

    if (auctionAddressesError) {
      toast.error(auctionAddressesError.message.split(".")[0]);
    }
  }, [totalAuctionsError, auctionAddressesError]);

  // Constants
  const auctionInfo: AuctionCreateTypes.AuctionInfo = {
    title: "BidCharter Testnet",
    round: 8,
    myPosition: "$12,521.00",
    targetPrice: "$13,000.00",
    actionsLeft: 6,
    myStake: "$8,000.00",
    auctionTime: "03:11:28",
  };

  // Effects
  useEffect(() => {
    if (!auctionAddresses) return;

    const auctions: AuctionCreateTypes.Auction[] = auctionAddresses.map(
      (address: { result: `0x${string}` }, index: number) => ({
        auctionId: index,
        auctionAddress: address.result,
        time: new Date().toUTCString(),
      })
    );
    // Sort auctions to show latest first
    setAuctionData(auctions.reverse());
  }, [auctionAddresses]);

  useWatchContractEvent({
    address: charterFactoryContractAddress as `0x${string}`,
    abi: CharterFactoryABI as Abi,
    eventName: "AuctionCreated",
    onLogs: (logs) => {
      // const log = logs[0] as unknown as {
      //   args: AuctionCreateTypes.Auction;
      // };
      // setAuctionData((prev) => [
      //   ...prev,
      //   {
      //     auctionId: log.args.auctionId,
      //     auctionAddress: log.args.auctionAddress,
      //     time: new Date().toUTCString(),
      //   } as AuctionCreateTypes.Auction,
      // ]);
      refetchTotalAuctions();
      refetchAuctionAddresses();
    },
    onError: (error) => {
      console.error("Error watching AuctionCreated event:", error);
      toast.error(error.message.split(".")[0]);
    },
  });

  // Debugging
  // useEffect(() => {
  //   console.log("Total Auctions:", totalAuctions);
  //   console.log("Auction Data:", auctionData);
  // }, [totalAuctions, auctionData]);

  return (
    <div className="min-h-screen bg-[#202020] text-white p-4">
      <header className="flex flex-col md:flex-row justify-between">
        <h3 className="text-2xl text-white font-inter font-extrabold">
          {auctionInfo.title}
        </h3>
        <ConnectButton />
      </header>
      <div className="flex flex-col lg:flex-row mt-8 gap-8 lg:gap-16">
        <div className="w-full flex flex-col gap-4">
          <h1 className="font-bold text-xl text-white">
            Latest Auctions Created (latest on top)
          </h1>
          <div className="border-b border-[#3D3838] w-full"></div>
          <div className="px-5">
            <div className="flex flex-col">
              <div className="flex justify-between mb-4 gap-1">
                <div className="text-sm text-white font-normal">Broker</div>
                <div className="text-sm text-white font-normal">
                  Auction (clickable)
                </div>
                <div className="text-sm text-white font-normal">
                  Creation time
                </div>
              </div>
              {isTotalAuctionsLoading || isAuctionAddressesLoading ? (
                <LoadingSkeleton />
              ) : auctionData.length === 0 ? (
                <p className="text-[#D9D9D9] text-xl text-center py-8 font-bold">
                  No auctions yet
                </p>
              ) : (
                auctionData.map((data: AuctionCreateTypes.Auction) => (
                  <Link
                    href={`/auction/${data.auctionId}`}
                    key={data.auctionId}
                  >
                    <div className="flex justify-between pt-2.5 gap-1">
                      <div className="text-xs text-[#D9D9D9] font-normal break-all">
                        {data.auctionId}
                      </div>
                      <div className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline break-all">
                        {data.auctionAddress}
                      </div>
                      <div className="text-xs text-[#D9D9D9] font-normal break-all">
                        {data.time}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
