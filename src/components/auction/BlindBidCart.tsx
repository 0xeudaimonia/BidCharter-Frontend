import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent
} from "wagmi";
import { toast } from "sonner";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { Abi, parseUnits, encodePacked, keccak256 } from "viem";
import { GeneralTypes } from "@/src/types";
  
import InfoRow from "./InfoRow";
interface BlindBidCartProps {
  auctionAddress: `0x${string}`;
  usdt: GeneralTypes.Usdt;
  entryFee: bigint;
}

export default function BlindBidCart({ auctionAddress, usdt, entryFee }: BlindBidCartProps) {

  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const [blindBidPrice, setBlindBidPrice] = useState<number>(0);

  const {
    data: usdtAllowance,
    error: usdtAllowanceError,
    // isLoading: isNftAddressLoading,
    refetch: refetchAllowance,
  } = useReadContract({
    address: usdt?.address as `0x${string}`,
    abi: ERC20ABI as Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, auctionAddress as `0x${string}`],
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  useEffect(() => {
    if (usdtAllowanceError) {
      toast.error("Failed to fetch usdt allowance.", { id: "usdtAllowanceLoading" });
    }
  }, [usdtAllowanceError]);

  const handleApprove = () => {
    writeContract({
      address: usdt?.address as `0x${string}`,
      abi: ERC20ABI as Abi,
      functionName: "approve",
      args: [auctionAddress as `0x${string}`, entryFee as bigint],
    }, {
      onSuccess: () => {
        console.log("Approved");
      },
      onError: (error) => {
        console.error("Error approving:", error);
      }
    });
  };

  const handleBlindBid = () => {
    const encodedData = encodePacked(
      ["address", "uint256"],
      [address as `0x${string}`, parseUnits(blindBidPrice.toString(), Number(usdt?.decimals))]
    );

    const bidInfo = keccak256(encodedData);
    console.log("bidInfo", bidInfo);

    writeContract({
      address: auctionAddress as `0x${string}`,
      abi: CharterAuctionABI as Abi,
      functionName: "bidAtBlindRound",
      args: [bidInfo],
    }, {
      onSuccess: () => {
        console.log("Blind Bid");
      },
      onError: (error) => {
        console.error("Error blind bidding:", error);
      }
    });
  };

  useWatchContractEvent({
    address: usdt?.address as `0x${string}`,
    abi: ERC20ABI as Abi,
    eventName: "Approval",
    onLogs: (logs) => {
      console.log("Approval event:", logs);
      refetchAllowance?.();
    },
  });

  useWatchContractEvent({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    eventName: "BlindBidEntered",
    onLogs: (logs) => {
      console.log("BlindBidEntered event:", logs);
      // refetchCurrentRound?.();
      // refetchPositions?.();
    },
  });

  console.log("usdtAllowance", usdtAllowance);

  return (
    <div>
      <h3 className="text-sm mt-5 text-white font-bold">
        My Shopping Cart
      </h3>
      <div className="border border-[#D9D9D940] rounded-2xl py-3 px-5 mt-3">
        <div className="flex flex-col">
          <div className="sm:flex-row gap-3 mt-3 sm:mb-0 mb-3">
            <input type="number" placeholder="Enter your blind bid price" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-white font-normal bg-transparent border-b border-[#D9D9D940] py-2 px-0" onChange={(e) => setBlindBidPrice(Number(e.target.value))} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mb-0 mb-3">
            <button
              className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
              onClick={handleApprove}
            >
              Approve
            </button>
            <button
              className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
              onClick={handleBlindBid}
            >
              Blind Bid
            </button>
          </div>
        </div>
      </div>

      <InfoRow label="My New Position:" value="$12,521.00" />

      <div className="text-center">
        <button className="cursor-pointer mt-5 sm:w-auto w-full mx-auto text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3">
          Merge Positions
        </button>
      </div>
    </div>
  );
}