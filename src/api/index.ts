import axios from 'axios';
import { PoolInfo } from '../types';
import { RAYDIUM_FETCH_BATCH_SIZE } from '../constants';
import { MAX_DEV_HOLD_PCT, MAX_TOP10HOLD_PCT, MIN_ALERT_VOLUME, MIN_MC } from '../config';

const getSolPrice = async () => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */
};

const getTokenHolderInfo = async (mintAddr: string, size: number) => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */
  const data = await axios(config)

  return data.data
}

const getPumpMintInfo = async (mintAddr: string) => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */
}

const getMintInfo = async (mintAddr: string) => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */

  return data.data
}

const getPumpfunVolume = async (pageSize: number, page: number) => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */

  return data.data
}

const getPoolByVolume = async (volume: number, date: "day" | "week" | "month"): Promise<PoolInfo[]> => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */
}

const getMevXInfo = async () => {
  /**
   * 
   *  Contact to https://t.me/vvizardev
   * 
   */
}

export {
  getSolPrice,
  getMintInfo,
  getTokenHolderInfo,
  getPumpfunVolume,
  getPoolByVolume,
  getPumpMintInfo,
  getMevXInfo
}