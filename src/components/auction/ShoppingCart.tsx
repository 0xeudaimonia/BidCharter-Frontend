import InfoRow from "./InfoRow";
import { CharterAuctionTypes } from "@/src/types";

interface IProps {
  shoppingCart: CharterAuctionTypes.Position[];
  handleBidPosition: () => void;
  handleRemovePosition: (position: CharterAuctionTypes.Position) => void;
}

export default function ShoppingCart({
  shoppingCart,
  handleBidPosition,
  handleRemovePosition,
}: IProps) {
  return (
    <div>
      <h3 className="text-sm mt-5 text-white font-bold">My Shopping Cart</h3>
      <div className="border border-[#D9D9D940] rounded-2xl py-3 px-5 mt-3">
        <div className="flex flex-col">
          <div className="flex justify-between mb-1">
            <div className="text-sm text-white font-normal">Seat</div>
            <div className="text-sm text-white font-normal">Price</div>
            <div className="text-sm text-white font-normal">Action</div>
          </div>

          {shoppingCart.map((item, index) => (
            <div key={index} className="flex justify-between pt-2.5">
              <div className="text-xs text-[#D9D9D9] font-normal">
                {item.seat}
              </div>
              <div className="text-xs text-[#D9D9D9] font-normal">
                {item.price}
              </div>
              <div
                className="text-xs text-[#D9D9D9] font-normal cursor-pointer underline"
                onClick={() => handleRemovePosition(item)}
              >
                Remove
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoRow label="My New Position:" value="$12,521.00" />

      <div className="text-center">
        <button
          onClick={handleBidPosition}
          className="cursor-pointer mt-5 sm:w-auto w-full mx-auto text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
        >
          Merge Positions
        </button>
      </div>
    </div>
  );
}
