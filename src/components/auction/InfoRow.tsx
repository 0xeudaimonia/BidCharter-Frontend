import { CharterAuctionTypes } from "@/src/types";

const InfoRow = ({ label, value, bold = false }: CharterAuctionTypes.InfoRowProps) => (
  <div className="flex mt-5">
    <span className="w-1/2 text-sm text-white font-bold">{label}</span>
    <span
      className={`w-1/2 text-white ${bold ? "font-bold text-2xl" : "font-normal text-sm"
        }`}
    >
      {value}
    </span>
  </div>
);

export default InfoRow;