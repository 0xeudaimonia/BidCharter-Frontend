import { forwardRef, useEffect, useState } from "react";
import {
  // useAccount,
  useReadContract,
} from "wagmi";
import { toast } from "sonner";
import Image from "next/image";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { Abi, formatUnits } from "viem";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";

import InfoRow from "./InfoRow";

import { yachtInfoTemp } from "@/src/libs/constants";
import { CharterNFTABI } from "@/src/libs/abi/CharterNFT";

interface AuctionInfoProps {
  auctionAddress: `0x${string}`;
  entryFee: bigint;
  usdt: GeneralTypes.Usdt;
}

const AunctionInfo = forwardRef<
  { refreshAuctionInfo: () => void },
  AuctionInfoProps
>(({ auctionAddress, entryFee, usdt }: AuctionInfoProps, ref) => {
  const [yatchInfo, setYatchInfo] =
    useState<CharterAuctionTypes.YachtInfo>(yachtInfoTemp);

  const {
    data: nftAddress,
    error: nftAddressError,
    // isLoading: isNftAddressLoading,
    // refetch: refetchNftAddress,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nft",
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: nftId,
    error: nftIdError,
    // isLoading: isNftIdLoading,
    // refetch: refetchNftId,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "nftId",
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: tokenURI,
    error: tokenURIError,
    // isLoading: isTokenURILoading,
    // refetch: refetchTokenURI,
  } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: CharterNFTABI as Abi,
    functionName: "tokenURI",
    args: nftId ? [BigInt(nftId.toString())] : [BigInt(0)],
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: reservePrice,
    error: reservePriceError,
    // isLoading: isReserveFundsLoading,
    // refetch: refetchReserveFunds,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "minRaisedFundsAtBlindRound",
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: raisedFunds,
    error: raisedFundsError,
    // isLoading: isRaisedFundsLoading,
    refetch: refetchRaisedFunds,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "raisedFundAtBlindRound",
  }) as GeneralTypes.ReadContractTypes;

  const refreshAuctionInfo = () => {
    refetchRaisedFunds?.();
  };

  useEffect(() => {
    if (nftAddressError) {
      toast.error("Failed to fetch NFT address.", { id: "nftAddressLoading" });
    }

    if (nftIdError) {
      toast.error("Failed to fetch NFT ID.", { id: "nftIdLoading" });
    }

    if (tokenURIError) {
      toast.error("Failed to fetch token URI.", { id: "tokenURILoading" });
    }

    if (reservePriceError) {
      toast.error("Failed to fetch reserve funds.", {
        id: "reserveFundsLoading",
      });
    }

    if (raisedFundsError) {
      toast.error("Failed to fetch raised funds.", {
        id: "raisedFundsLoading",
      });
    }
  }, [
    nftAddressError,
    nftIdError,
    tokenURIError,
    reservePriceError,
    raisedFundsError,
  ]);

  useEffect(() => {
    if (entryFee) {
      setYatchInfo((prevState) => ({
        ...prevState,
        details: prevState.details.map((item) => {
          if (item.label === "Entry Fee:") {
            return {
              ...item,
              value:
                formatUnits(
                  entryFee ? BigInt(entryFee.toString()) : BigInt(0),
                  usdt?.decimals ? Number(usdt?.decimals) : 18
                ) + " USDT",
            };
          }

          if (item.label === "Reserve Price:") {
            return {
              ...item,
              value:
                formatUnits(
                  reservePrice ? BigInt(reservePrice.toString()) : BigInt(0),
                  usdt?.decimals ? Number(usdt?.decimals) : 18
                ) + " USDT",
            };
          }

          if (item.label === "Blind Bid:") {
            return {
              ...item,
              value:
                formatUnits(
                  raisedFunds ? BigInt(raisedFunds.toString()) : BigInt(0),
                  usdt?.decimals ? Number(usdt?.decimals) : 18
                ) + " USDT",
            };
          }
          return item;
        }),
      }));
    }

    if (tokenURI) {
      console.log("tokenURI", tokenURI);
      // setYatchInfo(prevState => ({
      //   ...prevState,
      //   image: tokenURI.toString()
      // }));
    }
  }, [tokenURI, entryFee, usdt?.decimals, reservePrice, raisedFunds]);

  // Expose refreshAuctionInfo through ref
  useEffect(() => {
    if (typeof ref === "object" && ref?.current) {
      ref.current.refreshAuctionInfo = refreshAuctionInfo;
    }
  }, [ref]);

  return (
    <div>
      <h3 className="text-xl text-white font-bold">{yatchInfo.title}</h3>
      <Image
        width={"100"}
        height={"100"}
        src={yatchInfo.image}
        className="my-4 w-full"
        alt="Yacht"
      />

      {yatchInfo.details.map((detail, index) => (
        <InfoRow
          key={index}
          label={detail.label}
          value={detail.value}
          bold={detail.bold}
        />
      ))}
    </div>
  );
});

AunctionInfo.displayName = "AunctionInfo";

export default AunctionInfo;
