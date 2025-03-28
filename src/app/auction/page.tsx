'use client';
import Image from "next/image";
import React from "react";
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
} from 'recharts';

export default function AuctionPage() {
  const data = [
    { round: 'R01', price: 12, leftBid: 20, rightBid: 0 },
    { round: 'R02', price: 14, leftBid: 18, rightBid: 0 },
    { round: 'R03', price: 16, leftBid: 15, rightBid: 0 },
    { round: 'R04', price: 18, leftBid: 13, rightBid: 0 },
    { round: 'R05', price: 20, leftBid: 11, rightBid: 0 },
    { round: 'R06', price: 21, leftBid: 9, rightBid: 0 },
    { round: 'R07', price: 22, leftBid: 0, rightBid: 5 },
    { round: 'R08', price: 23, leftBid: 0, rightBid: 8 },
    { round: 'R09', price: 24, leftBid: 0, rightBid: 12 },
    { round: 'R10', price: 25, leftBid: 0, rightBid: 16 },
    { round: 'R11', price: 27, leftBid: 0, rightBid: 20 },
    { round: 'R12', price: 29, leftBid: 0, rightBid: 24 },
  ];
  const dataGraphbar = [
    { round: 'R01', price: 12, fillValue: 1 },
    { round: 'R02', price: 14, fillValue: 1 },
    { round: 'R03', price: 16, fillValue: 1 },
    { round: 'R04', price: 18, fillValue: 1 },
    { round: 'R05', price: 20, fillValue: 1 },
    { round: 'R06', price: 21, fillValue: 1 },
    { round: 'R07', price: 22, fillValue: 1 },
    { round: 'R08', price: 23, fillValue: 1 },
    { round: 'R09', price: 24, fillValue: 1 },
    { round: 'R10', price: 25, fillValue: 1 },
    { round: 'R11', price: 27, fillValue: 1 },
    { round: 'R12', price: 29, fillValue: 1 },
  ];

  const auctionInfo = {
    title: "BidCharter Testnet",
    round: 8,
    myPosition: "$12,521.00",
    targetPrice: "$13,000.00",
    actionsLeft: 6,
    myStake: "$8,000.00",
    auctionTime: "03:11:28"
  };

  const yachtInfo = {
    title: "YOLO Charter in Croatia",
    image: "/yacht.jpg",
    details: [
      { label: "Guests:", value: "up to 36" },
      {
        label: "Availability:",
        value: `21.06-28.06\n28.06-05.07\n28.08-30.08`
      },
      {
        label: "Reserve Price (weekly):",
        value: "$65,000.00",
        bold: true
      },
      { label: "Entry Fee:", value: "$1,000.00" },
      { label: "Blind Bid:", value: "$12,000.00" }
    ]
  };

  const cartItems = [
    { seat: "001", price: "$13,579.15" },
    { seat: "001", price: "$13,579.15" }
  ];

  const biddingActivity = [
    { seat: "001", price: "$13,579.15" },
    { seat: "002", price: "$12,997.58" },
    { seat: "004", price: "$12,997.58" },
    { seat: "005", price: "$12,997.58" },
    { seat: "006", price: "$12,997.58" },
    { seat: "007", price: "$12,997.58" },
    { seat: "008", price: "$12,997.58" },
    { seat: "009", price: "$12,997.58" },
    { seat: "010", price: "$12,997.58" },
    { seat: "011", price: "$12,997.58" },
    { seat: "012", price: "$12,997.58" }
  ];
  const bestBids = [
    { seat: "001", price: "$13,579.15" },
    { seat: "002", price: "$12,997.58" },
    { seat: "004", price: "$12,997.58" },
    { seat: "005", price: "$12,997.58" },
    { seat: "006", price: "$12,997.58" },
    { seat: "007", price: "$12,997.58" },
    { seat: "008", price: "$12,997.58" },
    { seat: "009", price: "$12,997.58" },
    { seat: "010", price: "$12,997.58" },
    { seat: "011", price: "$12,997.58" },
    { seat: "012", price: "$12,997.58" }
  ];

  const InfoRow = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
    <div className="flex mt-5">
      <span className="w-1/2 text-sm text-white font-bold">{label}</span>
      <span className={`w-1/2 text-white ${bold ? 'font-bold text-2xl' : 'font-normal text-sm'}`}>
        {value}
      </span>
    </div>
  );
  

  return (
    <div className="min-h-screen bg-[#202020] text-white p-4">
      <header className="flex flex-col md:flex-row justify-between">
        <h3 className="text-2xl text-white font-inter font-extrabold">{auctionInfo.title}</h3>
        <button className="cursor-pointer text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3 mt-4 md:mt-0">
          Wallet Connected
        </button>
      </header>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-white font-normal">Back to List of Auctions</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Round:", value: auctionInfo.round },
            { label: "My Position:", value: auctionInfo.myPosition },
            { label: "Target Price:", value: auctionInfo.targetPrice },
            { label: "Action Left:", value: auctionInfo.actionsLeft },
            { label: "My Stake:", value: auctionInfo.myStake }
          ].map((item, index) => (
            <div key={index} className="flex gap-6">
              <span className="text-sm text-white font-bold">{item.label}</span>
              <span className="text-sm text-white font-normal">{item.value}</span>
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
          <h3 className="text-xl text-white font-bold">{yachtInfo.title}</h3>
          <Image width={'100'} height={'100'} src={yachtInfo.image} className="my-4 w-full" alt="Yacht" />

          {yachtInfo.details.map((detail, index) => (
            <InfoRow
              key={index}
              label={detail.label}
              value={detail.value}
              bold={detail.bold}
            />
          ))}

          <div>
            <h3 className="text-sm mt-5 text-white font-bold">My Shopping Cart</h3>
            <div className="border border-[#D9D9D940] rounded-2xl py-3 px-5 mt-3">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-white font-normal">Seat</div>
                  <div className="text-sm text-white font-normal">Price</div>
                  <div className="text-sm text-white font-normal">Action</div>
                </div>

                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between pt-2.5">
                    <div className="text-xs text-[#D9D9D9] font-normal">{item.seat}</div>
                    <div className="text-xs text-[#D9D9D9] font-normal">{item.price}</div>
                    <div className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline">
                      Remove
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <InfoRow
              label="My New Position:"
              value="$12,521.00"
            />

            <div className="text-center">
              <button className="cursor-pointer mt-5 sm:w-auto w-full mx-auto text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3">
                Merge Positions
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[20%]">
          <h3 className="text-sm text-white font-bold px-5">Current Bidding Activity</h3>
          <div className="py-3 px-5 mt-3">
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <div className="text-sm text-white font-normal">Seat</div>
                <div className="text-sm text-white font-normal">Price</div>
                <div className="text-sm text-white font-normal">Action</div>
              </div>

              {biddingActivity.map((item, index) => (
                <div key={index} className="flex justify-between pt-2.5">
                  <div className="text-xs text-[#D9D9D9] font-normal">{item.seat}</div>
                  <div className="text-xs text-[#D95252] font-normal">{item.price}</div>
                  <div className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline">
                    Merge
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-around bg-[#3E3A3A] py-1.5">
              <span className="text-sm text-white font-normal">Current Best Bid:</span>
              <span className="text-sm text-white font-bold">$13,795.57</span>
            </div>
            <div className="py-3 px-5">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-white font-normal">Seat</div>
                  <div className="text-sm text-white font-normal">Price</div>
                  <div className="text-sm text-white font-normal">Action</div>
                </div>

                {bestBids.map((item, index) => (
                  <div key={index} className="flex justify-between pt-2.5">
                    <div className="text-xs text-[#D9D9D9] font-normal">{item.seat}</div>
                    <div className="text-xs text-[#0CB400] font-normal">{item.price}</div>
                    <div className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline">
                      Merge
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[40%]">
          <div>
            <h3 className="text-sm text-white font-bold px-5">Bidding Price Chart</h3>

            <div className="w-full sm:h-[350px] h-[300px]">
              <ResponsiveContainer width="100%">
                <ComposedChart data={dataGraphbar} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                  <CartesianGrid stroke="none" />
                  <XAxis dataKey="round" stroke="#ccc" axisLine={false} tickLine={false} />
                  <YAxis stroke="#ccc" axisLine={false} tickLine={false} hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    contentStyle={{ backgroundColor: '#333', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="fillValue" yAxisId="fill" fill="#3d3d3d" barSize={40} />
                  <Line type="monotone" dataKey="price" stroke="#ffffff" strokeWidth={2} yAxisId="main" />
                  <YAxis yAxisId="main" domain={['auto', 'auto']} hide />
                  <YAxis yAxisId="fill" domain={[0, 1]} hide />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:h-[250px] h-[200px] -mt-5 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
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
                  <YAxis
                    stroke="#ccc"
                    axisLine={false}
                    tickLine={false}
                    hide
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#222', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
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

              {/* Centered Current Bid Overlay */}
              <div className="absolute top-2/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-sm font-bold text-white">
                  $13,795.57
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[20%] flex flex-col justify- items-end sm:gap-[30%]">
          <div className="w-full">
            <h3 className="text-sm text-white font-bold">My Rewards</h3>
            <div className="border border-[#D9D9D940] rounded-2xl p-4 mt-5">
              <div className="flex gap-3">
                <span className="text-xs text-[#D9D9D9] font-normal">Total:</span>
                <span className="text-xs text-[#0CB400] font-bold">$13,579.15</span>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-[#D9D9D9] font-normal">Total:</span>
                <span className="text-xs text-[#0CB400] font-bold">$1,997.58</span>
              </div>
            </div>

            <div className="sm:text-end mt-3 sm:mb-0 mb-3">
              <button className="cursor-pointer mx-auto sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3">
                Claim Rewards
              </button>
            </div>
          </div>

          <div className="text-end flex flex-col sm:w-auto w-full">
            <button className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3">
              Claim Charter NFT
            </button>

            <button className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3">
              End Round
            </button>

            <button className="cursor-pointer hover:bg-white transition mt-2 sm:w-auto w-full text-sm font-bold text-black bg-[#979797] rounded-[10px] px-5 py-3">
              End Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
