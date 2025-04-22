import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { CharterAuctionTypes } from "@/src/types";
import { formattedWithCurrency } from "@/src/utils/utils";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Abi, formatUnits } from "viem";
import { useReadContracts } from "wagmi";

interface BidChartProps {
  auctionAddress: `0x${string}`;
  usdtDecimals: bigint;
  currentRound: bigint;
}

const BidChart = ({
  auctionAddress,
  usdtDecimals,
  currentRound,
}: BidChartProps) => {
  const [chartData, setChartData] = useState<
    CharterAuctionTypes.ChartDataItem[]
  >([]);
  const [graphbarData, setGraphbarData] = useState<
    CharterAuctionTypes.GraphbarItem[]
  >([]);

  const roundPriceContracts = useMemo(() => {
    if (currentRound === undefined) return [];

    const rounds = [...Array(Number(currentRound) + 1).keys()];
    return rounds.flatMap((round) => [
      {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "getTargetPrice",
        args: [BigInt(round)],
      },
      {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "getRoundHighestValue",
        args: [BigInt(round)],
      },
      {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "getRoundLowestValue",
        args: [BigInt(round)],
      },
    ]);
  }, [currentRound, auctionAddress]);
  const { data: allPrices, error: pricesError } = useReadContracts({
    contracts: roundPriceContracts,
  }) as CharterAuctionTypes.FetchRoundBidData;

  useEffect(() => {
    if (!allPrices || !usdtDecimals) return;

    const rounds = allPrices.length / 3; // Since we have 3 values per round
    const chartPoints: CharterAuctionTypes.ChartDataItem[] = [];
    const graphbarPoints: CharterAuctionTypes.GraphbarItem[] = [];

    for (let i = 0; i < rounds; i++) {
      const targetPrice = allPrices[i * 3]?.result;
      const highestPrice = allPrices[i * 3 + 1]?.result;
      const lowestPrice = allPrices[i * 3 + 2]?.result;

      if (targetPrice && highestPrice && lowestPrice) {
        graphbarPoints.push({
          round: `R${(i + 1).toString().padStart(2, "0")}`,
          target: Number(formatUnits(targetPrice, Number(usdtDecimals))),
          highest: Number(formatUnits(highestPrice, Number(usdtDecimals))),
          lowest: Number(formatUnits(lowestPrice, Number(usdtDecimals))),
          fillValue: 1,
        });

        chartPoints.push({
          round: `R${(i + 1).toString().padStart(2, "0")}`,
          price: Number(formatUnits(targetPrice, Number(usdtDecimals))),
          fillValue: 1,
        });
      }
    }

    setChartData(chartPoints);
    setGraphbarData(graphbarPoints);
  }, [allPrices, usdtDecimals]);

  useEffect(() => {
    if (pricesError) {
      toast.error("Failed to fetch prices.", {
        id: "pricesLoading",
      });
    }
  }, [pricesError]);

  return (
    <div>
      <h3 className="text-sm text-white font-bold px-5">Bidding Price Chart</h3>
      <div className="w-full sm:h-[350px] h-[300px]">
        <ResponsiveContainer width="100%">
          <ComposedChart
            data={chartData}
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
              type="linear"
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

      <div className="w-full mt-10 relative h-[300px] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={graphbarData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid horizontal={true} vertical={false} stroke="#444" />
            <XAxis
              dataKey="round"
              stroke="#ccc"
              axisLine={false}
              tickLine={false}
              dy={10}
              padding={{ left: 50, right: 50 }}
            />
            <YAxis
              stroke="#ccc"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formattedWithCurrency(Number(value))}
              width={80}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => [
                `${formattedWithCurrency(Number(value))}`,
                null,
              ]}
            />
            <Legend
              verticalAlign="top"
              align="center"
              height={30}
              iconType="rect"
              iconSize={8}
              wrapperStyle={{
                fontSize: "12px",
                display: "block",
                top: 0,
              }}
              formatter={(value) => (
                <span style={{ color: "#ccc", marginLeft: "4px" }}>
                  {value}
                </span>
              )}
            />
            <Line
              type="linear"
              dataKey="highest"
              stroke="#00ff00"
              strokeWidth={2}
              name="Highest Position"
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="linear"
              dataKey="target"
              stroke="#ffff00"
              strokeWidth={2}
              name="Target Value"
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            <Line
              type="linear"
              dataKey="lowest"
              stroke="#ff0000"
              strokeWidth={2}
              name="Lowest Position"
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BidChart;
