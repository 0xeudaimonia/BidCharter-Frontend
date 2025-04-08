"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { Abi, formatEther } from "viem";
import { useParams } from "next/navigation";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import { CharterNFTABI } from "@/src/libs/abi/CharterNFT";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { toast } from "sonner";

const InfoRow = ({ label, value, bold = false }: CharterAuctionTypes.InfoRowProps) => (
  <div className="flex mt-5">
    <span className="w-1/2 text-sm text-white font-bold">{label}</span>
    <span
      className={`w-1/2 text-white ${
        bold ? "font-bold text-2xl" : "font-normal text-sm"
      }`}
    >
      {value}
    </span>
  </div>
);

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
    data: positions,
    error: positionsError,
    // isLoading: isPositionsLoading,
    refetch: refetchPositions,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getRoundPositions",
    args: [currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0)],
  }) as { data: CharterAuctionTypes.Position[], refetch: () => void, error: Error | null };
  
  useEffect(() => {
    if (positionsError) {
      toast.error("Failed to fetch positions.", { id: "positionsLoading" });
    }
  }, [positionsError]);

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

  const [chartData, setChartData] = useState<CharterAuctionTypes.ChartData[]>([]);
  const [barData, setBarData] = useState<CharterAuctionTypes.BarData[]>([]);
  const [nftMetadata, setNftMetadata] = useState<CharterAuctionTypes.NFTMetadata | null>(null);

  useEffect(() => {
    if (positions && positions.length > 0 && currentRound !== undefined) {
      const formattedData: CharterAuctionTypes.ChartData[] = positions.map((pos: CharterAuctionTypes.Position, index: number) => ({
        round: `R${(Number(currentRound) + index).toString().padStart(2, "0")}`,
        price: Number(formatEther(pos.bidPrice)),
        leftBid:
          index < positions.length / 2 ? Number(formatEther(pos.bidPrice)) : 0,
        rightBid:
          index >= positions.length / 2 ? Number(formatEther(pos.bidPrice)) : 0,
      }));
      const formattedBarData: CharterAuctionTypes.BarData[] = positions.map((pos: CharterAuctionTypes.Position, index: number) => ({
        round: `R${(Number(currentRound) + index).toString().padStart(2, "0")}`,
        price: Number(formatEther(pos.bidPrice)),
        fillValue: 1,
      }));
      setChartData(formattedData);
      setBarData(formattedBarData);
    }
  }, [positions, currentRound]);

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
    round: isBlindRoundEnded ? (currentRound ? Number(currentRound) : 0) : "Blind Round",
    myPosition:
      positions && address
        ? `$${Number(
            formatEther(positions?.[0]?.bidPrice || BigInt(0))
          ).toFixed(2)}`
        : "$0.00",
    targetPrice: targetPrice
      ? `$${Number(formatEther(targetPrice as bigint)).toFixed(2)}`
      : "$0.00",
    actionsLeft: "6", // Static for now, could be dynamic
    myStake: "$8,000.00", // Static for now, could track total bids
    auctionTime: "03:11:28", // Static for now, could use a timer
  };

  // Yacht info derived from NFT metadata and contract data
  const auctionDetail = useMemo(() => {
    if (nftMetadata && entryFee) {
      return [
        {
          label: "Entry Fee:",
          value: entryFee
            ? `$${Number(formatEther(entryFee as bigint)).toFixed(2)}`
            : "$0.00",
        },
        ...(nftMetadata?.attributes?.map(
          (attr: { trait_type: string; value: string }) => ({
            label: `${attr.trait_type}:`,
            value: attr.value,
            bold: attr.trait_type === "Reserve Price",
          })
        ) || []),
      ];
    }
    return [];
  }, [nftMetadata, entryFee]);

  const auctionItemInfo = {
    title: nftMetadata?.name || "Charter Auction Item",
    image: nftMetadata?.image || "/auctionError.png",
    details: auctionDetail,
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
      refetchPositions?.();
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
      refetchPositions?.();
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
      refetchPositions?.();
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

        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Round:", value: auctionInfo.round },
            { label: "My Position:", value: auctionInfo.myPosition },
            { label: "Target Price:", value: auctionInfo.targetPrice },
            { label: "Action Left:", value: auctionInfo.actionsLeft },
            { label: "My Stake:", value: auctionInfo.myStake },
          ].map((item, index) => (
            <div key={index} className="flex gap-6">
              <span className="text-sm text-white font-bold">{item.label}</span>
              <span className="text-sm text-white font-normal">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="sm:w-auto w-full">
          <button className="cursor-pointer sm:w-auto w-full bg-[#204119] text-sm text-[#CAFFDB] py-5 px-10">
            Auction Time: {auctionInfo.auctionTime}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-7 mt-8">
        <div className="w-full md:w-[20%]">
          <h3 className="text-xl text-white font-bold">
            {auctionItemInfo.title}
          </h3>
          <Image
            width={100}
            height={100}
            src={auctionItemInfo.image}
            className="my-4 w-full"
            alt="Auction Item"
          />
          {auctionItemInfo.details.map((detail, index) => (
            <InfoRow
              key={index}
              label={detail.label}
              value={detail.value}
              bold={"bold" in detail ? detail.bold : false}
            />
          ))}
        </div>

        <div className="w-full md:w-[20%]">
          <h3 className="text-sm text-white font-bold px-5">
            Current Bidding Activity
          </h3>
          <div className="py-3 px-5 mt-3">
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <div className="text-sm text-white font-normal">Seat</div>
                <div className="text-sm text-white font-normal">Price</div>
                <div className="text-sm text-white font-normal">Action</div>
              </div>
              {positions?.map((pos: { bidPrice: bigint }, index: number) => (
                <div key={index} className="flex justify-between pt-2.5">
                  <div className="text-xs text-[#D9D9D9] font-normal">{`00${
                    index + 1
                  }`}</div>
                  <div className="text-xs text-[#D95252] font-normal">{`$${Number(
                    formatEther(pos.bidPrice)
                  ).toFixed(2)}`}</div>
                  <div
                    className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline"
                    onClick={() => handleBidPosition(index)}
                  >
                    Merge
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[40%]">
          <div>
            <h3 className="text-sm text-white font-bold px-5">
              Bidding Price Chart
            </h3>
            <div className="w-full sm:h-[350px] h-[300px]">
              <ResponsiveContainer width="100%">
                <ComposedChart
                  data={barData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                >
                  <CartesianGrid stroke="none" />
                  <XAxis
                    dataKey="round"
                    stroke="#ccc"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis stroke="#ccc" axisLine={false} tickLine={false} hide />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.1)" }}
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar
                    dataKey="fillValue"
                    yAxisId="fill"
                    fill="#3d3d3d"
                    barSize={40}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#ffffff"
                    strokeWidth={2}
                    yAxisId="main"
                  />
                  <YAxis yAxisId="main" domain={["auto", "auto"]} hide />
                  <YAxis yAxisId="fill" domain={[0, 1]} hide />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:h-[250px] h-[200px] -mt-5 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="round"
                    stroke="#ccc"
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />
                  <YAxis stroke="#ccc" axisLine={false} tickLine={false} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leftBid"
                    fill="#00ff00"
                    stroke="#00ff00"
                    fillOpacity={0.2}
                    name=""
                  />
                  <Area
                    type="monotone"
                    dataKey="rightBid"
                    fill="#ff0000"
                    stroke="#ff0000"
                    fillOpacity={0.2}
                    name=""
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#ffffff"
                    strokeWidth={2}
                    name=""
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-2/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-sm font-bold text-white">
                  {auctionInfo.targetPrice}
                </span>
              </div>
            </div>
          </div>
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
