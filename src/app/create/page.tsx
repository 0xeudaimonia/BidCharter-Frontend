"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
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

import { AuctionCreateTypes } from "@/src/types";

export default function AuctionCreatePage() {
  // State
  const [inputValues, setInputValues] = useState<AuctionCreateTypes.InputValues>({});
  const [auctionData, setAuctionData] = useState<AuctionCreateTypes.Auction[]>([]);

  // Wagmi hooks
  const { writeContract, isPending: createAuctionPending, error: createAuctionError, isSuccess: createAuctionSuccess } = useWriteContract();

  const { 
    data: totalAuctions, 
    error: totalAuctionsError, 
    refetch: refetchTotalAuctions, 
    isLoading: isTotalAuctionsLoading 
  } = useReadContract({
    address: charterFactoryContractAddress,
    abi: CharterFactoryABI,
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

  useEffect(() => {
    if (createAuctionPending) {
      toast.loading("Creating auction...", { id: "createAuctionLoading" });
    }

    if (createAuctionSuccess) {
      toast.success("Auction created successfully", { id: "createAuctionLoading" });
    }

    if (createAuctionError) {
      toast.error(createAuctionError.message.split(".")[0], { id: "createAuctionLoading" });
    }
  }, [createAuctionError, createAuctionPending, createAuctionSuccess]);

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

  const inputDetails: AuctionCreateTypes.InputDetail[] = [
    { inputLabel: "Seat price", priceTag: "$2000.00" },
    { inputLabel: "Reserves", priceTag: "$250,000.00" },
  ];

  // Handlers
  const handleInputChange = (label: string, value: string) => {
    setInputValues((prev: AuctionCreateTypes.InputValues) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleCreateAuction = async () => {
    const seatPrice = inputValues["Seat price"];
    const reserves = inputValues["Reserves"];

    // Improved input validation
    if (!seatPrice || !reserves) {
      toast.error("All fields are required");
      return;
    }

    // Validate numeric inputs
    const seatPriceNum = Number(seatPrice);
    const reservesNum = Number(reserves);

    if (isNaN(seatPriceNum) || isNaN(reservesNum)) {
      toast.error("Please enter valid numbers");
      return;
    }

    if (seatPriceNum <= 0 || reservesNum <= 0) {
      toast.error("Values must be greater than 0");
      return;
    }

    writeContract({
      abi: CharterFactoryABI as Abi,
      address: charterFactoryContractAddress as `0x${string}`,
      functionName: "createAuction",
      args: [BigInt(seatPrice), BigInt(reserves)],
    });
    setInputValues({});
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
    address: charterFactoryContractAddress,
    abi: CharterFactoryABI,
    eventName: "AuctionCreated",
    onLogs: (logs) => {
      const log = logs[0] as unknown as {
        args: AuctionCreateTypes.Auction;
      };
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
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl text-white">Create Auction</h1>
          <div className="border border-[#D9D9D940] rounded-xl p-4 flex flex-col gap-4 w-full">
            {inputDetails.map((input: AuctionCreateTypes.InputDetail) => (
              <div
                key={input.inputLabel}
                className="flex flex-col items-center justify-center w-full"
              >
                <h4 className="text-white text-sm font-bold">
                  {input.inputLabel}
                </h4>
                <input
                  className="bg-white text-black rounded-xl p-2 w-full text-center"
                  placeholder={input.priceTag}
                  value={inputValues[input.inputLabel] || ""}
                  onChange={(e) =>
                    handleInputChange(input.inputLabel, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
          <button
            className="bg-white text-black rounded-xl p-2 w-full text-center text-sm font-bold hover:opacity-90 hover:cursor-pointer disabled:opacity-50"
            onClick={handleCreateAuction}
            disabled={createAuctionPending}
          >
            {createAuctionPending ? "Creating..." : "Create Auction"}
          </button>
        </div>
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
              {isTotalAuctionsLoading || isAuctionAddressesLoading || createAuctionPending ? (
                <LoadingSkeleton />
              ) : auctionData.length === 0 ? (
                <p className="text-[#D9D9D9] text-xl text-center py-8 font-bold">
                  No auctions yet
                </p>
              ) : (
                auctionData.map((data: AuctionCreateTypes.Auction) => (
                  <div
                    key={data.auctionId}
                    className="flex justify-between pt-2.5 gap-1"
                  >
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
