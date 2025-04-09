import { CharterAuctionTypes } from "@/src/types";

interface BidActivityProps {
  positions: CharterAuctionTypes.Position[];
  handleBidPosition: (index: number) => void;
}

const BidActivity = ({ positions, handleBidPosition }: BidActivityProps) => (
  <div>
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
        { positions?.map((pos: CharterAuctionTypes.Position, index: number) => (
          <div key={index} className="flex justify-between pt-2.5">
            <div className="text-xs text-[#D9D9D9] font-normal">{pos.seat}</div>
            <div className="text-xs text-[#D95252] font-normal">{pos.price}</div>
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
);

export default BidActivity;
