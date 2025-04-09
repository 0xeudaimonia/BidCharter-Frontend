import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import { CharterAuctionTypes } from "@/src/types";

interface BidChartProps {
  chartData: CharterAuctionTypes.ChartDataItem[];
  graphbarData: CharterAuctionTypes.GraphbarItem[];
  targetPrice: string;
}

const BidChart = ({ chartData, graphbarData, targetPrice }: BidChartProps) => {
  return (
  <div>
    <h3 className="text-sm text-white font-bold px-5">
      Bidding Price Chart
    </h3>
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
          {targetPrice}
        </span>
      </div>
    </div>
    </div>
  );
};

export default BidChart;