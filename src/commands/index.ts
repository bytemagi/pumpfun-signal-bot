import { REFERER_HANDER } from "../config"

const displayMsg = (data: any) => {
  return `💎 ${data.name} \| ${data.symbol}

CA: \`${data.mint}\`
💹*Marketcap*: $${Number(Number(data.marketCap).toFixed(0)).toLocaleString()}

🕕*Raydium Age* : ${data.pumpfunAge}
💰*Dev Wallet* : ${Number(data.devWalletPercentage).toFixed(0)}%
👥*Holders*: ${data.holderCount}
💪*Top 10 holder hold* : ${Number(data.top10HolderPercentage).toFixed(0)}%
🚀*Volume*: $${Number(Number(data.volume).toFixed(0)).toLocaleString()}

🌐*Socials*: ${data.telegram ? `[TG](${data.telegram}) \| ` : ""} ${data.twitter ? `[X](${data.twitter}) \| ` : ""} ${data.website ? `[WEBSITE](${data.website}) \| ` : ""}

📈*Chart*: [Mevx](https://mevx.io/solana/${data.mint}?ref=TheAlphaRonin)

Copyright © Apex Solana Signal`
}

const multipleMsg = (beforeVolume: number, afterVolume: number) => {
  return `🎯 ${Number(afterVolume / beforeVolume).toFixed(1)}x

📊From $${Number(Number(beforeVolume).toFixed(1)).toLocaleString()} -> $${Number(Number(afterVolume).toFixed(1)).toLocaleString()}

Copyright © Apex Solana Signal`
}

const linkBtn = (mintAddr: string) => {
  const title = `Pick what you want to add:
`
  const content = [
    [{ text: '👾 MevX (Bot)', url: `https://t.me/MevxTradingBot?start=${mintAddr}-${REFERER_HANDER}` }, { text: '🟣 SolTradeBot', url: `https://t.me/SolTradingBot` },],
    [{ text: 'Ⓜ️ Maestro', url: `http://t.me/maestro?start=${mintAddr}-${REFERER_HANDER}` }, { text: '🐴 Trojan', url: `https://t.me/odysseus_trojanbot?start=r-${REFERER_HANDER}-${mintAddr}` }],
    [{ text: '🤖 GMGN', url: `https://t.me/gmgnaibot` }, { text: '⭐️ Nova', url: `https://t.me/TradeonNovaBot` }],
  ]

  return { title, content }
}

export {
  displayMsg,
  multipleMsg,
  linkBtn
}