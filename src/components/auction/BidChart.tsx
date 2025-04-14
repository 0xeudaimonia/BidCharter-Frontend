import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Abi, formatUnits } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

interface BidChartProps {
  chartData: CharterAuctionTypes.ChartDataItem[];
  auctionAddress: `0x${string}`;
  usdtDecimals: bigint;
}

const BidChart = ({ auctionAddress, usdtDecimals }: BidChartProps) => {
  const [graphbarData, setGraphbarData] = useState<
    CharterAuctionTypes.GraphbarItem[]
  >([]);

  const {
    data: currentRound,
    error: currentRoundError,
    // isLoading: isCurrentRoundLoading,
    // refetch: refetchCurrentRound,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "currentRound",
  }) as GeneralTypes.ReadContractTypes;

  const roundTargetPriceContracts = useMemo(() => {
    if (currentRound === undefined) return [];
    return [...Array(Number(currentRound) + 1).keys()].map((round) => ({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "getTargetPrice",
      args: [BigInt(Number(round))],
    }));
  }, [currentRound, auctionAddress]);

  const {
    data: targetPrices,
    error: targetPriceError,
    // isLoading: isTargetPriceLoading,
    // refetch: refetchTargetPrice,
  } = useReadContracts({
    contracts: roundTargetPriceContracts,
  }) as CharterAuctionTypes.FetchRoundBidData;

  useEffect(() => {
    if (targetPrices) {
      setGraphbarData(
        targetPrices
          .filter((targetPrice) => targetPrice.status === "success")
          .map((targetPrice, index) => ({
            round: `R${(index + 1).toString().padStart(2, "0")}`,
            price: Number(
              formatUnits(targetPrice.result, Number(usdtDecimals))
            ),
            fillValue: 1,
          }))
      );
    }
  }, [targetPrices, usdtDecimals]);

  useEffect(() => {
    if (currentRoundError) {
      toast.error("Failed to fetch current round.", {
        id: "currentRoundLoading",
      });
    }
    if (targetPriceError) {
      toast.error("Failed to fetch target price.", {
        id: "targetPriceLoading",
      });
    }
  }, [currentRoundError, targetPriceError]);
  return (
    <div>
      <h3 className="text-sm text-white font-bold px-5">Bidding Price Chart</h3>
      <div className="w-full sm:h-[350px] h-[300px]">
        <ResponsiveContainer width="100%">
          <ComposedChart
            data={graphbarData}
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

      {/* <div className="w-full sm:h-[250px] h-[200px] -mt-5 relative">
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
          <span className="text-sm font-bold text-white">{0}</span>
        </div>
      </div> */}
    </div>
  );
};

export default BidChart;
