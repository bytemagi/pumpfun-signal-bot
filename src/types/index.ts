interface PoolInfo {
  type: string,
  programId: string,
  id: string,
  mintA: {
    chainId: number,
    address: string,
    programId: string,
    logoURI: string,
    symbol: string,
    name: string,
    decimals: number,
    tags: Array<string>,
    extensions: object
  },
  mintB: {
    chainId: number,
    address: string,
    programId: string,
    logoURI: string,
    symbol: string,
    name: string,
    decimals: number,
    tags: Array<string>,
    extensions: object
  },
  price: number,
  mintAmountA: number,
  mintAmountB: number,
  feeRate: number,
  openTime: string,
  tvl: number,
  day: {
    volume: number,
    volumeQuote: number,
    volumeFee: number,
    apr: number,
    feeApr: number,
    priceMin: number,
    priceMax: number,
    rewardApr: Array<number>
  },
  week: {
    volume: number,
    volumeQuote: number,
    volumeFee: number,
    apr: number,
    feeApr: number,
    priceMin: number,
    priceMax: number,
    rewardApr: Array<number>
  },
  month: {
    volume: number,
    volumeQuote: number,
    volumeFee: number,
    apr: number,
    feeApr: number,
    priceMin: number,
    priceMax: number,
    rewardApr: Array<number>
  },
  pooltype: Array<string>,
  rewardDefaultInfos: Array<object>,
  farmUpcomingCount: number,
  farmOngoingCount: number,
  farmFinishedCount: number,
  marketId: string,
  lpMint: {
    chainId: number,
    address: string,
    programId: string,
    logoURI: string,
    symbol: string,
    name: string,
    decimals: number,
    tags: Array<string>,
    extensions: object
  },
  lpPrice: number,
  lpAmount: number,
  burnPercent: number
}

interface JsonInfo {
  msgId: string,
  volume: number
}

interface MevXInfo {
  Liquidity: number,
  address: string,
  burnPercent: number,
  burnedAmount: number,
  createTime: number,
  devBuyPercent: number,
  exchange: string,
  holder: number,
  init_liq: { quote: number, token: number, usd: null },
  isFreezeable: false,
  isListed: true,
  isMintable: false,
  marketCap: number,
  name: string,
  owner: string,
  pairAddress: string,
  percent: number,
  prevExchange: string,
  priceInQuote: number,
  priceInUSD: number,
  quoteAmount: number,
  socials: {
    twitter?: string,
    website?: string,
    telegram?: string,
  },
  startTime: number,
  symbol: string,
  tokenAmount: number,
  top10HolderPercent: number,
  totalbase: number,
  totallp: string,
  totalquote: number,
  txns: {
    all: { price: number, volume: number },
    h1: {
      buyers: number,
      buys: number,
      makers: number,
      price: number,
      sellers: number,
      sells: number,
      vbuys: number,
      vsells: number
    },
    h24: {
      buyers: number,
      buys: number,
      makers: number,
      price: number,
      sellers: number,
      sells: number,
      vbuys: number,
      vsells: number
    },
    h6: {
      buyers: number,
      buys: number,
      makers: number,
      price: number,
      sellers: number,
      sells: number,
      vbuys: number,
      vsells: number
    },
    m5: {
      buyers: number,
      buys: number,
      makers: number,
      price: number,
      sellers: number,
      sells: number,
      vbuys: number,
      vsells: number
    }
  },
  urlInfo: {
    description: string,
    image: string,
    image2: string
  }
}

export {
  PoolInfo,
  JsonInfo,
  MevXInfo
}