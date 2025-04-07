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
} from "wagmi";
import { Abi, formatEther } from "viem";
import { useParams } from "next/navigation";
import { charterFactoryContractAddress } from "@/src/libs/constants";
import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterFactoryABI } from "@/src/libs/abi/CharterFactory";
import { CharterNFTABI } from "@/src/libs/abi/CharterNFT";
import { CharterAuctionTypes } from "@/src/types";

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
  const [error, setError] = useState<string | null>(null);

  const { data: txHash, isPending, writeContract } = useWriteContract();

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isTxSuccess) {
      console.log("Transaction was successful!");
      setError(null); // Clear any previous errors
    }
  }, [isTxSuccess, isPending]);

  const { data: auctionAddress, error: auctionAddressError } = useReadContract({
    address: charterFactoryContractAddress as `0x${string}`,
    abi: CharterFactoryABI,
    functionName: "getAuctionAddress",
    args: [BigInt(auctionId)],
    // Error handling moved to useEffect
  });

  useEffect(() => {
    if (auctionAddressError) {
      setError("Failed to fetch auction address.");
    } else if (auctionAddress) {
      console.log("Auction Address fetched successfully:", auctionAddress);
      setError(null); // Clear any previous errors
    }
  }, [auctionAddress, auctionAddressError]);

  const { data: nftAddress, error: nftAddressError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nft",
    // Error handling moved to useEffect
  });

  useEffect(() => {
    if (nftAddressError) {
      setError("Failed to fetch NFT address.");
      console.error("Read Contract Error (nftAddress):", nftAddressError);
    } else if (nftAddress) {
      console.log("NFT Address fetched successfully:", nftAddress);
      setError(null); // Clear any previous errors
    }
  }, [nftAddress, nftAddressError]);

  const { data: currentRound, error: currentRoundError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "currentRound",
  });

  console.log("currentRound", currentRound); 

  useEffect(() => {
    if (currentRoundError) {
      console.error("Read Contract Error (currentRound):", currentRoundError);
      setError("Failed to fetch current round.");
    }
  }, [currentRoundError]);

  const { data: isBlindRoundEnded, error: isBlindRoundEndedError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "isBlindRoundEnded",
  });

  console.log("isBlindRoundEnded", isBlindRoundEnded);

  useEffect(() => {
    if (isBlindRoundEndedError) {
      console.error("Read Contract Error (isBlindRoundEnded):", isBlindRoundEndedError);
      setError("Failed to fetch isBlindRoundEnded.");
    }
  }, [isBlindRoundEndedError]);

  const { data: entryFee, error: entryFeeError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "entryFee",
  });

  useEffect(() => {
    if (entryFeeError) {
      console.error("Read Contract Error (entryFee):", entryFeeError);
      setError("Failed to fetch entry fee.");
    }
  }, [entryFeeError]);

  const {
    data: rewards,
    error: rewardsError,
  }: { data: bigint | undefined; error: Error | null } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "rewards",
    args: [address || "0x0"],
  });

  useEffect(() => {
    if (rewardsError) {
      console.error("Read Contract Error (rewards):", rewardsError);
      setError("Failed to fetch rewards.");
    }
  }, [rewardsError]);

  const { data: positions }: { data: { bidPrice: bigint }[] | undefined } =
    useReadContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "getRoundPositions",
    });

  const { data: targetPrice, error: targetPriceError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "getTargetPrice",
    args: [
      currentRound !== undefined ? BigInt(Number(currentRound)) : BigInt(0),
    ],
  });

  useEffect(() => {
    if (targetPriceError) {
      console.error("Read Contract Error (targetPrice):", targetPriceError);
      setError("Failed to fetch target price.");
    }
  }, [targetPriceError]);

  const { data: winner, error: winnerError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "winner",
  });

  useEffect(() => {
    if (winnerError) {
      console.error("Read Contract Error (winner):", winnerError);
      setError("Failed to fetch winner.");
    }
  }, [winnerError]);

  const { data: nftId, error: nftIdError } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nftId",
  });

  useEffect(() => {
    if (nftIdError) {
      console.error("Read Contract Error (nftId):", nftIdError);
      setError("Failed to fetch NFT ID.");
    }
  }, [nftIdError]);

  const { data: tokenURI, error: tokenURIError } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: CharterNFTABI,
    functionName: "tokenURI",
    args: nftId ? [BigInt(nftId.toString())] : [BigInt(0)],
  });

  console.log("tokenURI", tokenURI);

  useEffect(() => {
    if (tokenURIError) {
      console.error("Read Contract Error (tokenURI):", tokenURIError);
      setError("Failed to fetch token URI.");
    }
  }, [tokenURIError]);

  const [chartData, setChartData] = useState<
    { round: string; price: number; leftBid: number; rightBid: number }[]
  >([]);
  const [barData, setBarData] = useState<
    { round: string; price: number; fillValue: number }[]
  >([]);


  const [nftMetadata, setNftMetadata] = useState<CharterAuctionTypes.NFTMetadata | null>(null);

  useEffect(() => {
    if (positions && currentRound !== undefined) {
      const formattedData: {
        round: string;
        price: number;
        leftBid: number;
        rightBid: number;
      }[] = positions.map((pos: { bidPrice: bigint }, index: number) => ({
        round: `R${(Number(currentRound) + index).toString().padStart(2, "0")}`,
        price: Number(formatEther(pos.bidPrice)),
        leftBid:
          index < positions.length / 2 ? Number(formatEther(pos.bidPrice)) : 0,
        rightBid:
          index >= positions.length / 2 ? Number(formatEther(pos.bidPrice)) : 0,
      }));
      const formattedBarData: {
        round: string;
        price: number;
        fillValue: number;
      }[] = positions.map((pos: { bidPrice: bigint }, index: number) => ({
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
            setError("Failed to fetch NFT metadata.");
          });
      } else {
        throw new Error("Invalid tokenURI");
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
    try {
      setError(null);
    } catch (err) {
      console.error("Error in handleBidPosition:", err);
      setError("Failed to place bid position.");
    }
  };

  const handleClaimRewards = () => {
    try {
      writeContract({
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "withdrawRewards",
      });
      setError(null);
    } catch (err: unknown) {
      console.error("Error in handleClaimRewards:", err);
      setError("Failed to claim rewards.");
    }
  };

  const handleClaimNFT = () => {
    try {
      writeContract({
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "withdrawNFT",
      });
      setError(null);
    } catch (err: unknown) {
      console.error("Error in handleClaimNFT:", err);
      setError("Failed to claim NFT.");
    }
  };

  const handleEndRound = () => {
    try {
      writeContract({
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "turnToNextRound",
      });
      setError(null);
    } catch (err: unknown) {
      console.error("Error in handleEndRound:", err);
      setError("Failed to end the round.");
    }
  };

  const handleEndAuction = () => {
    try {
      writeContract({
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "endAuction",
      });
      setError(null);
    } catch (err: unknown) {
      console.error("Error in handleEndAuction:", err);
      setError("Failed to end the auction.");
    }
  };

  if (auctionAddress) {
    // Use auctionAddress to interact with the auction contract
    console.log("Auction Address:", auctionAddress);
  }

  if (!auctionAddress) {
    return (
      <div className="min-h-screen bg-[#202020] text-white p-4">
        {error || "Loading auction data..."}
      </div>
    );
  }

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
                          ? Number(formatEther(rewards)).toFixed(2)
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

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </div>
  );
}
