import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";
import { Abi, encodePacked, keccak256, parseUnits } from "viem";

import { fetchBlindBidInfos, saveBidderInfo } from "@/src/utils/api";

interface BlindBidCartProps {
  auctionAddress: `0x${string}`;
  usdt: GeneralTypes.Usdt;
  entryFee: bigint;
}

export default function BlindBidCart({
  auctionAddress,
  usdt,
  entryFee,
}: BlindBidCartProps) {
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
      toast.error("Failed to fetch usdt allowance.", {
        id: "usdtAllowanceLoading",
      });
    }
  }, [usdtAllowanceError]);

  const handleApprove = () => {
    writeContract(
      {
        address: usdt?.address as `0x${string}`,
        abi: ERC20ABI as Abi,
        functionName: "approve",
        args: [auctionAddress as `0x${string}`, entryFee as bigint],
      },
      {
        onSuccess: () => {
          console.log("Approved");
        },
        onError: (error) => {
          console.error("Error approving:", error);
        },
      }
    );
  };

  const handleBlindBid = () => {
    const encodedData = encodePacked(
      ["address", "uint256"],
      [
        address as `0x${string}`,
        parseUnits(blindBidPrice.toString(), Number(usdt?.decimals)),
      ]
    );

    const bidInfo = keccak256(encodedData);
    console.log("bidInfo", bidInfo);
    console.log("usdtAllowance", usdtAllowance);

    writeContract(
      {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "bidAtBlindRound",
        args: [bidInfo],
      },
      {
        onSuccess: async () => {
          console.log("Success Blind Bid");
          const result = await saveBidderInfo(
            auctionAddress?.toString() as string,
            address?.toString() as string,
            blindBidPrice.toString()
          );
          if (result.error) {
            toast.error("Failed to save bidder info.");
          } else {
            toast.success(result.message);
          }
        },
        onError: (error) => {
          console.error("Error blind bidding:", error);
          toast.error("Failed to blind bid.");
        },
      }
    );
  };

  const handleBlindEnd = async () => {
    const res = await fetchBlindBidInfos(auctionAddress as string);
    if (res.error) {
      toast.error("Failed to fetch blind bid infos.");
      return;
    }

    if (!res.data || res.data.length === 0) {
      toast.error("Blind round not ended.");
      return;
    }

    const prices = res.data.map((bidInfo: CharterAuctionTypes.BlindBidInfo) =>
      parseUnits(bidInfo.price, Number(usdt?.decimals))
    );

    writeContract(
      {
        address: auctionAddress as `0x${string}`,
        abi: CharterAuctionABI as Abi,
        functionName: "endBlindRound",
        args: [[...prices]],
      },
      {
        onSuccess: () => {
          toast.success("Blind round ended.");
        },
        onError: (error) => {
          console.error("Error ending blind round:", error);
          toast.error("Failed to end blind round.");
        },
      }
    );
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

  return (
    <div>
      <h3 className="text-sm mt-5 text-white font-bold">My Shopping Cart</h3>
      <div className="border border-[#D9D9D940] rounded-2xl py-3 px-5 mt-3">
        <div className="flex flex-col">
          <div className="sm:flex-row gap-3 mt-3 sm:mb-0 mb-3">
            <input
              type="number"
              placeholder="Enter your blind bid price"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm text-white font-normal bg-transparent border-b border-[#D9D9D940] py-2 px-0"
              onChange={(e) => setBlindBidPrice(Number(e.target.value))}
            />
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
          <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mb-0 mb-3">
            <button
              className="cursor-pointer sm:w-auto w-full text-sm font-bold text-black bg-white rounded-[10px] px-5 py-3"
              onClick={handleBlindEnd}
            >
              End Blind Round
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
