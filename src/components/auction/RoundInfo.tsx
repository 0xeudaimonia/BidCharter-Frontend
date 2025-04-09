import { roundInfo } from "@/src/libs/constants";
import { CharterAuctionTypes } from "@/src/types";

const roundInfoItems: CharterAuctionTypes.RoundInfoItem[] = [
  { label: "Round:", value: roundInfo.round },
  { label: "My Position:", value: roundInfo.myPosition },
  { label: "Target Price:", value: roundInfo.targetPrice },
  { label: "Action Left:", value: roundInfo.actionsLeft },
  { label: "My Stake:", value: roundInfo.myStake },
];

const RoundInfo = () => (
  <div className="flex flex-wrap justify-center gap-6">
    {roundInfoItems.map((item, index) => (
      <div key={index} className="flex gap-6">
        <span className="text-sm text-white font-bold">{item.label}</span>
        <span className="text-sm text-white font-normal">
          {item.value}
        </span>
      </div>
    ))}
  </div>
);

export default RoundInfo;