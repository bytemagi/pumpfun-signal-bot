import { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection } from "../config";
import fs from 'fs';
import { amount, Metaplex } from "@metaplex-foundation/js";

import { BONDING_CURVE_SEED } from "pumpdotfun-sdk";
// import { sdk } from "../index copy";

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const metaplex = Metaplex.make(connection);

const getMetaData = async (mintAddress: PublicKey) => {

  const metadataAccount = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });

    return token
  }
}


async function getMintTransaction(mintPublicKey: PublicKey, beforeSignatures?: string) {
  try {
    let signatures;
    // Get the transaction signatures for the mint address
    if (beforeSignatures == null || beforeSignatures == "") {
      signatures = await connection.getSignaturesForAddress(mintPublicKey, {}, "confirmed");
    } else {
      signatures = await connection.getSignaturesForAddress(mintPublicKey, { before: beforeSignatures }, "confirmed");
    }
    if (signatures.length === 0) {
      console.log("No transactions found for this mint address.");
      return null;
    }
    const mintSignature = signatures[signatures.length - 1].signature; // Oldest signature
    const mintTransaction = await connection.getParsedTransaction(mintSignature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });

    if (mintTransaction == null || mintTransaction.meta?.logMessages == null) return null
    if (mintTransaction.meta?.logMessages.join("").includes("Instruction: InitializeMint2")) {
      return mintSignature;
    }
    else {
      return await getMintTransaction(mintPublicKey, mintSignature)
    }
  } catch (error) {
    console.error("Error fetching mint transaction:");
    return null;
  }
}

const getTokenHistory = async (mintTx: string) => {
  if (mintTx == null) return;
  const parsedTx = await connection.getParsedTransaction(mintTx, { commitment: "confirmed", maxSupportedTransactionVersion: 0 })
  if (parsedTx == null || parsedTx?.blockTime == null) return;

  const mintTime = new Date(parsedTx?.blockTime * 1000); // Multiply by 1000 to convert to milliseconds
  const currentTime = new Date()

  const timeDifferenceMs = currentTime.getTime() - mintTime.getTime();
  // Convert milliseconds to various units
  // Calculate the difference in time
  const totalSeconds = Math.floor(timeDifferenceMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Calculate the years and months, assuming 365 days per year and 30 days per month
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 365 % 30;

  // Calculate hours, minutes, and seconds
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return `${years ? years + " year " : ""}${months ? months + " mon " : ""}${days ? days + " d " : ""}${hours ? hours + " hr " : ""}${minutes ? minutes + " min " : ""}${seconds ? seconds + " sec" : ""}`
}


const getTokenHistoryByTimestamp = (blockTime: number) => {

  const mintTime = new Date(blockTime); // Multiply by 1000 to convert to milliseconds
  const currentTime = new Date()

  const timeDifferenceMs = currentTime.getTime() - mintTime.getTime();
  // Convert milliseconds to various units
  // Calculate the difference in time
  const totalSeconds = Math.floor(timeDifferenceMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Calculate the years and months, assuming 365 days per year and 30 days per month
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 365 % 30;

  // Calculate hours, minutes, and seconds
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return `${years ? years + " year " : ""}${months ? months + " mon " : ""}${days ? days + " d " : ""}${hours ? hours + " hr " : ""}${minutes ? minutes + " min " : ""}${seconds ? seconds + " sec" : ""}`
}


const getTokenAccountBalance = async (mintAddress: PublicKey, payer: PublicKey) => {
  try {
    const ata = await getAssociatedTokenAddress(mintAddress, payer)
    const ataInfo = await connection.getTokenAccountBalance(ata)
    return Number(ataInfo.value.amount)
  } catch (error) {
    return 0
  }
}

const getTopHolder = async (tokenMintAddress: PublicKey) => {
  const tokenAccounts = await connection.getTokenLargestAccounts(tokenMintAddress, "confirmed");

  const tokenAccountAddrs = tokenAccounts.value.map(ele => ele.address)
  const tokenAccountInfo = await connection.getMultipleParsedAccounts(tokenAccountAddrs, { commitment: "confirmed" })
  let topHolder = tokenAccountInfo.value.map(ele => {
    //  @ts-ignore
    return { owner: ele?.data.parsed.info.owner, amount: parseInt(ele?.data.parsed.info.tokenAmount.amount) }
  })

  if (topHolder.length > 10) topHolder.slice(0, 9)

  let atas: PublicKey[] = []

  topHolder.forEach(ele => {
    let data;
    try {
      atas.push(new PublicKey(ele.owner))

    } catch (error) {
      console.log("Error in Getting Ata : ", ele.owner);
    }
    return data
  })

  const data = await connection.getMultipleParsedAccounts(atas, { commitment: "confirmed" })

  // console.log(data);

  let returnData: any[] = []

  topHolder.forEach((ele, idx) => {
    if (data.value[idx]?.owner.toBase58() == "11111111111111111111111111111111") {
      returnData.push(ele)
    }
  })

  return returnData
}

async function getTokenHoldersCount(mintPublicKey: PublicKey) {
  // Fetch all token accounts associated with the mint address
  const tokenAccounts = await connection.getProgramAccounts(
    new PublicKey(TOKEN_PROGRAM_ID.toBase58()), // SPL Token Program ID
    {
      filters: [
        { dataSize: 165 }, // Filter for token accounts
        { memcmp: { offset: 0, bytes: mintPublicKey.toBase58() } }, // Match mint address
      ],
    }
  );

  // Count accounts with a non-zero balance
  let holderCount = 0;
  for (const account of tokenAccounts) {
    const data = account.account.data;
    const balance = data.readBigUInt64LE(64); // Balance is stored at byte offset 64
    if (Number(balance) > 0) {
      holderCount++;
    }
  }

  return holderCount
}

async function getPayerPublicKey(txSignature: string) {
  // Fetch the parsed transaction details
  const transactionDetails = await connection.getParsedTransaction(txSignature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0, // Ensure compatibility with latest versions
  });

  if (!transactionDetails) {
    console.log("Transaction not found.");
    return;
  }

  // The payer is the first account in the `accountKeys` array
  const payerPublicKey = transactionDetails.transaction.message.accountKeys[0].pubkey;

  return new PublicKey(payerPublicKey);
}

// const getBondingCurvePDA = (mint: PublicKey) => {
//   return PublicKey.findProgramAddressSync(
//     [Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()],
//     sdk.program.programId
//   )[0];
// }

// Function to read JSON file
export function readJson(filename: string = "data.json"): {} {
  if (!fs.existsSync(filename)) {
    // If the file does not exist, create an empty array
    fs.writeFileSync(filename, '{}', 'utf-8');
  }
  const data = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(data);
}

// Function to write JSON file
export function writeJson(data: {}, filename: string = "data.json",): void {
  fs.writeFileSync(filename, JSON.stringify(data, null, 4), 'utf-8');
}

export {
  getMetaData,
  getTokenHistory,
  getMintTransaction,
  getTopHolder,
  getTokenHoldersCount,
  getPayerPublicKey,
  getTokenAccountBalance,
  getTokenHistoryByTimestamp,
  sleep
  // getBondingCurvePDA
}