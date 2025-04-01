import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function AuctionCreatePage() {
  const auctionInfo = {
    title: "BidCharter Testnet",
    round: 8,
    myPosition: "$12,521.00",
    targetPrice: "$13,000.00",
    actionsLeft: 6,
    myStake: "$8,000.00",
    auctionTime: "03:11:28",
  };

  const inputDetails = [
    {
      inputLabel: "Seat price",
      priceTag: "$2000.00",
    },
    {
      inputLabel: "Reserves",
      priceTag: "$250,000.00",
    },
  ];

  const mockData = [
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
    {
      broker: "0x6f0f1B0fa7A150f17490b2369852c5d0f5D2C9d4",
      auction: "0x55d398326f99059fF775485246999027B3197955",
      time: "Mar-17-2025 10:43:38 PM UTC",
    },
  ];

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
            {inputDetails.map((input, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full"
              >
                <h4 className="text-white text-sm font-bold">
                  {input.inputLabel}
                </h4>
                <input
                  className="bg-white text-black rounded-xl p-2 w-full text-center"
                  placeholder={input.priceTag}
                />
              </div>
            ))}
          </div>
          <button className="bg-white text-black rounded-xl p-2 w-full text-center text-sm font-bold hover:opacity-90 hover:cursor-pointer">
            Create Auction
          </button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <h1 className="font-bold text-xl text-white">
            Latest Auctions created (latest on top)
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

              {mockData.map((data, index) => (
                <div key={index} className="flex justify-between pt-2.5 gap-1">
                  <div className="text-xs text-[#D9D9D9] font-normal  break-all">
                    {data.broker}
                  </div>
                  <div className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline  break-all">
                    {data.auction}
                  </div>
                  <div className="text-xs text-[#D9D9D9] font-normal  break-all">
                    {data.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
