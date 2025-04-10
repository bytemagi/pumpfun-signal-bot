import { PublicKey } from "@solana/web3.js";
import { getMevXInfo, getMintInfo, getPoolByVolume, getPumpfunVolume, getPumpMintInfo, getTokenHolderInfo } from "./api";
import { ALERT_MULTIPLE_LIMIT, bot, CHANNEL_HANDLE, SCAN_AMM_INTERVAL, MIN_ALERT_VOLUME, MAX_TOP10HOLD_PCT, MIN_MC } from "./config";
import { getTokenAccountBalance, getTokenHistoryByTimestamp, getTokenHoldersCount, getTopHolder, readJson, sleep, writeJson } from "./utils";
import * as commands from './commands'
import { MevXInfo } from "./types";
import TelegramBot from "node-telegram-bot-api";


const start = async () => {
  bot.on(`message`, async (msg: any) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username: string = msg.from!.username!

    switch (text) {
      case `/ping`:
        bot.sendMessage(chatId, "pong")
        break;
    }
  })
}

start()

setInterval(async () => {
  console.log('\x1Bc');
  console.log("\x1b[32mPumpfun Volume Notify Bot\x1b[0m\n")

  const data: Array<MevXInfo> = await getMevXInfo()

  for (const i in data) {
    const updatedData: any = readJson()
    if (Object.prototype.hasOwnProperty.call(data, i)) {
      const element = data[i];


      //  @ts-ignore
      if (updatedData[element.address]?.msgId == undefined) {

        if (element.top10HolderPercent > MAX_TOP10HOLD_PCT) continue
        // if ((Date.now() / 1000) - element.createTime > 60 * 60) continue
        if (element.marketCap < MIN_MC ) continue
        // if (element.marketCap > 2 * MIN_MC ) continue
        console.log(`New Token : ${element.address} ( ${getTokenHistoryByTimestamp(element.createTime * 1000)} )`);

        const dataMsg = {
          name: element.name,
          symbol: element.symbol,
          mint: element.address,
          marketCap: element.marketCap,
          pumpfunAge: getTokenHistoryByTimestamp(element.createTime * 1000),
          top10HolderPercentage: element.top10HolderPercent,
          holderCount: element.holder,
          devWalletPercentage: element.devBuyPercent,
          twitter: element.socials.twitter,
          telegram: element.socials.telegram,
          website: element.socials.website,
          volume: (element.txns.h24.vbuys + element.txns.h24.vsells)
        }
        let msgId: TelegramBot.Message;

        try {
          const msg = commands.displayMsg(dataMsg)
          const btn = commands.linkBtn(element.address)
          msgId = await bot.sendMessage(CHANNEL_HANDLE, msg, {
            reply_markup: {
              inline_keyboard: btn.content
            },
            parse_mode: "Markdown"
          })

          writeJson({ ...updatedData, [element.address]: { ...element, msgId: msgId.message_id, initial_mc: element.marketCap, multiple: 1 }, })

        } catch (err: any) {
          console.log(err.message);
        }
      } else {
        try {
          let msgId: TelegramBot.Message;

          if (updatedData[element.address].multiple < Math.floor((element.marketCap) / (updatedData[element.address].initial_mc))) {

            console.log(`Update Token : ${Number((element.txns.h24.vbuys + element.txns.h24.vsells) / (updatedData[element.address].txns.h24.vbuys + updatedData[element.address].txns.h24.vsells)).toFixed(2)} `);


            const msg = commands.multipleMsg((updatedData[element.address].initial_mc), (element.marketCap))

            msgId = await bot.sendMessage(CHANNEL_HANDLE, msg, {
              parse_mode: "Markdown",
              //  @ts-ignore
              reply_to_message_id: updatedData[element.address].msgId
            })

            writeJson({ ...updatedData, [element.address]: { ...updatedData[element.address],multiple: Math.floor((element.marketCap) / (updatedData[element.address].initial_mc)) }, })
          } 

        } catch (error: any) {
          console.log(error.message);
        }
      }

    }

    await sleep(1000)
  }


}, SCAN_AMM_INTERVAL)
