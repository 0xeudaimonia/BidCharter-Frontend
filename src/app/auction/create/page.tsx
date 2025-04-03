"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { contractAddress } from "../../../../libs/constants";
import {
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { useEffect, useState } from "react";
import { abi } from "../../../../libs/abi";
import LoadingSkeleton from "../../../../components/LoadingSkeleton";
import { toast } from "sonner";
import { Abi } from "viem";

type Auction = {
  auctionId: number;
  auctionAddress: string;
  time: string;
};

type AuctionInfo = {
  title: string;
  round: number;
  myPosition: string;
  targetPrice: string;
  actionsLeft: number;
  myStake: string;
  auctionTime: string;
};

type InputDetail = {
  inputLabel: string;
  priceTag: string;
};

type InputValues = Record<string, string>;

export default function AuctionCreatePage() {
  // State
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [auctionData, setAuctionData] = useState<Auction[]>([]);

  // Wagmi hooks
  const { writeContract, isPending, error: writeError } = useWriteContract();

  const { data: totalAuctions, isLoading: isTotalAuctionsLoading } =
    useReadContract({
      address: contractAddress,
      abi,
      functionName: "getTotalAuctions",
    }) as { data: bigint | undefined; isLoading: boolean };

  const auctionContracts = useMemo(() => {
    if (!totalAuctions) return [];
    return [...Array(Number(totalAuctions)).keys()].map((auctionId) => ({
      address: contractAddress,
      abi,
      functionName: "getAuctionAddress",
      args: [auctionId] as const,
  }))
  : [];

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
  const auctionInfo: AuctionInfo = {
    title: "BidCharter Testnet",
    round: 8,
    myPosition: "$12,521.00",
    targetPrice: "$13,000.00",
    actionsLeft: 6,
    myStake: "$8,000.00",
    auctionTime: "03:11:28",
  };

  const inputDetails: InputDetail[] = [
    { inputLabel: "Seat price", priceTag: "$2000.00" },
    { inputLabel: "Reserves", priceTag: "$250,000.00" },
  ];

  // Handlers
  const handleInputChange = (label: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleCreateAuction = () => {
    const seatPrice = inputValues["Seat price"];
    const reserves = inputValues["Reserves"];
    if (!seatPrice || !reserves) {
      toast.error("All fields are required.", {
        style: { backgroundColor: "red", color: "white" },
        duration: 4000,
        dismissible: true,
      });
      return;
    }
    try {
      writeContract({
        abi,
        address: contractAddress,
        functionName: "createAuction",
        args: [BigInt(seatPrice), BigInt(reserves)],
      });
      setInputValues({});
    } catch (error) {
      console.error("Failed to create auction:", error);
      toast.error("Failed to create auction");
    }
  };

  // Effects
  useEffect(() => {
    if (!auctionAddresses) return;

    const auctions: Auction[] = auctionAddresses.map((address, index) => ({
      auctionId: index,
      auctionAddress: address.result,
      time: new Date().toUTCString(),
    }));
    setAuctionData(auctions);
  }, [auctionAddresses]);

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "AuctionCreated",
    onLogs: (logs) => {
      console.log("New auction created:", logs);
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
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl text-white">Create Auction</h1>
          <div className="border border-[#D9D9D940] rounded-xl p-4 flex flex-col gap-4 w-full">
            {inputDetails.map((input) => (
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
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Auction"}
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
              {isTotalAuctionsLoading || isAuctionAddressesLoading ? (
                <LoadingSkeleton />
              ) : auctionData.length === 0 ? (
                <p className="text-[#D9D9D9] text-xl text-center py-8 font-bold">
                  No auctions yet
                </p>
              ) : (
                auctionData.map((data) => (
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
