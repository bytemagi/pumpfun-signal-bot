import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';

config()

const MAINNET_RPC = process.env.MAINNET_RPC || ""
const CHANNEL_HANDLE = process.env.CHANNEL_HANDLE || ""
const REFERER_HANDER = process.env.REFERER_HANDER || ""

const MIN_ALERT_VOLUME = parseFloat(process.env.MIN_ALERT_VOLUME || "200000")
const MIN_MC = parseFloat(process.env.MIN_MC || "100000")
const MAX_TOP10HOLD_PCT = parseFloat(process.env.MAX_TOP10HOLD_PCT || "40")
const MAX_DEV_HOLD_PCT = parseFloat(process.env.MAX_DEV_HOLD_PCT || "10")

const SCAN_AMM_INTERVAL = Number(process.env.SCAN_AMM_INTERVAL || "10000")
const ALERT_MULTIPLE_LIMIT = Number(process.env.ALERT_MULTIPLE_LIMIT || "1.5")

const connection = new Connection(MAINNET_RPC, { commitment: "confirmed" })

const botToken = process.env.BOT_TOKEN!

let bot = new TelegramBot(botToken, { polling: true });

export {
  connection,
  SCAN_AMM_INTERVAL,
  CHANNEL_HANDLE,
  bot,
  REFERER_HANDER,
  MIN_ALERT_VOLUME,
  ALERT_MULTIPLE_LIMIT,
  MIN_MC,
  MAX_TOP10HOLD_PCT,
  MAX_DEV_HOLD_PCT
}