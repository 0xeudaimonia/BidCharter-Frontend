import Image from "next/image";
import InfoRow from "./InfoRow";
import { yachtInfo } from "@/src/libs/constants";

export default function AuctionInfo() {
  return (
    <div>
      <h3 className="text-xl text-white font-bold">{yachtInfo.title}</h3>
      <Image
        width={"100"}
        height={"100"}
        src={yachtInfo.image}
        className="my-4 w-full"
        alt="Yacht"
      />

      {yachtInfo.details.map((detail, index) => (
        <InfoRow
          key={index}
          label={detail.label}
          value={detail.value}
          bold={detail.bold}
        />
      ))}
    </div>
  );
}
