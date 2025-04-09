import { useEffect, useState } from "react";
import {
  // useAccount, 
  useReadContract
} from "wagmi";
import { toast } from "sonner";
import Image from "next/image";

import { CharterAuctionABI } from "@/src/libs/abi/CharterAuction";
import { ERC20ABI } from "@/src/libs/abi/ERC20";
import { Abi, formatUnits } from "viem";
import { CharterAuctionTypes, GeneralTypes } from "@/src/types";

import InfoRow from "./InfoRow";

import { yachtInfoTemp } from "@/src/libs/constants";
import { CharterNFTABI } from "@/src/libs/abi/CharterNFT";

interface AuctionInfoProps {
  auctionAddress: `0x${string}`;
}

export default function AuctionInfo({ auctionAddress }: AuctionInfoProps) {

  const [yatchInfo, setYatchInfo] = useState<CharterAuctionTypes.YachtInfo>(yachtInfoTemp);

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
    data: usdtAddress,
    error: usdtAddressError,
    // isLoading: isNftAddressLoading,
    // refetch: refetchNftAddress,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "usdt",
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: usdtDecimals,
    error: usdtDecimalsError,
    // isLoading: isNftAddressLoading,
    // refetch: refetchNftAddress,
  } = useReadContract({
    address: usdtAddress as `0x${string}`,
    abi: ERC20ABI as Abi,
    functionName: "decimals",
    // Error handling moved to useEffect
  }) as GeneralTypes.ReadContractTypes;

  const {
    data: entryFee,
    error: entryFeeError,
    // isLoading: isEntryFeeLoading,
    // refetch: refetchEntryFee,
  } = useReadContract({
    address: auctionAddress as `0x${string}`,
    abi: CharterAuctionABI as Abi,
    functionName: "entryFee",
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

  useEffect(() => {
    if (nftAddressError) {
      toast.error("Failed to fetch NFT address.", { id: "nftAddressLoading" });
    }

    if (entryFeeError) {
      toast.error("Failed to fetch entry fee.", { id: "entryFeeLoading" });
    }

    if (nftIdError) {
      toast.error("Failed to fetch NFT ID.", { id: "nftIdLoading" });
    }

    if (tokenURIError) {
      toast.error("Failed to fetch token URI.", { id: "tokenURILoading" });
    }

    if (usdtAddressError) {
      toast.error("Failed to fetch USDT address.", { id: "usdtAddressLoading" });
    }

    if (usdtDecimalsError) {
      toast.error("Failed to fetch USDT decimals.", { id: "usdtDecimalsLoading" });
    }

    if (reservePriceError) {
      toast.error("Failed to fetch reserve funds.", { id: "reserveFundsLoading" });
    }
  }, [nftAddressError, entryFeeError, nftIdError, tokenURIError, usdtAddressError, usdtDecimalsError, reservePriceError]);

  useEffect(() => {
    if (entryFee) {
      setYatchInfo(prevState => ({
        ...prevState,
        details: prevState.details.map(item => {
          if (item.label === "Entry Fee:") {
            return {
              ...item,
              value: formatUnits(entryFee ? BigInt(entryFee.toString()) : BigInt(0), usdtDecimals ? Number(usdtDecimals.toString()) : 18) + " USDT"
            };
          }

          if (item.label === "Reserve Price:") {
            return {
              ...item,
              value: formatUnits(reservePrice ? BigInt(reservePrice.toString()) : BigInt(0), usdtDecimals ? Number(usdtDecimals.toString()) : 18) + " USDT"
            };
          }
          return item;
        })
      }));
    }

    if (tokenURI) {
      console.log("tokenURI", tokenURI);
      // setYatchInfo(prevState => ({
      //   ...prevState,
      //   image: tokenURI.toString()
      // }));
    }
  }, [tokenURI, entryFee, usdtDecimals, reservePrice]);

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
}
