"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { charterFactoryAbi } from "@/src/libs/CharterFactory";
import {
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import LoadingSkeleton from "@/src/components/LoadingSkeleton";
import { toast } from "sonner";
import { Abi } from "viem";

import { AuctionCreate } from "@/src/types";
import Link from "next/link";

export default function AuctionCreatePage() {
  // State
  const [inputValues, setInputValues] = useState<AuctionCreate.InputValues>({});
  const [auctionData, setAuctionData] = useState<AuctionCreate.Auction[]>([]);

  // Wagmi hooks
  const { writeContract, isPending, error: writeError } = useWriteContract();

  const { data: totalAuctions, isLoading: isTotalAuctionsLoading } =
    useReadContract({
      address: charterFactoryContractAddress,
      abi: charterFactoryAbi,
      functionName: "getTotalAuctions",
    }) as { data: bigint | undefined; isLoading: boolean };

  const auctionContracts = useMemo(() => {
    if (!totalAuctions) return [];
    return [...Array(Number(totalAuctions)).keys()].map((auctionId) => ({
      address: charterFactoryContractAddress,
      abi: charterFactoryAbi as Abi,
      functionName: "getAuctionAddress",
      args: [auctionId] as const,
    }));
  }, [totalAuctions]);

  const {
    data: auctionAddresses,
    isLoading: isAuctionAddressesLoading,
    refetch,
  } = useReadContracts({
    contracts: auctionContracts,
  }) as {
    data: { result: `0x${string}` }[] | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // Constants
  const auctionInfo: AuctionCreate.AuctionInfo = {
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

    const auctions: AuctionCreate.Auction[] = auctionAddresses.map(
      (address, index) => ({
        auctionId: index,
        auctionAddress: address.result,
        time: new Date().toUTCString(),
      })
    );
    // Sort auctions to show latest first
    setAuctionData(auctions.reverse());
  }, [auctionAddresses]);

  useWatchContractEvent({
    address: charterFactoryContractAddress,
    abi: charterFactoryAbi,
    eventName: "AuctionCreated",
    onLogs: (logs) => {
      console.log("New auction created:", logs);
      const log = logs[0] as unknown as {
        args: {
          auctionId: number;
          auctionAddress: `0x${string}`;
          time: string;
        };
      };
      setAuctionData((prev) => [
        ...prev,
        {
          auctionId: log.args.auctionId,
          auctionAddress: log.args.auctionAddress,
          time: new Date().toUTCString(),
        },
      ]);
      refetch();
    },
    onError: (error) => {
      console.error("Error watching AuctionCreated event:", error);
    },
  });

  // Debugging
  useEffect(() => {
    console.log("Total Auctions:", totalAuctions);
    console.log("Auction Data:", auctionData);
  }, [totalAuctions, auctionData]);

  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message.split(".")[0]);
    }
  }, [writeError]);

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
                auctionData.map((data) => (
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
