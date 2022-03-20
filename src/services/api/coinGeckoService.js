const axios = require('axios');
const CONFIG = require('../../../config');
const getConfigObject = require('../../../config/axios');
const logger = require('../../modules/logger');

const CoinGeckoService = {
  async fetch(path) {
    try {
      const url = `${CONFIG.SERVICES.COINGECKO.COINGECKO_URL}/${path}`;
      const options = getConfigObject({ url });

      const response = await axios(options);

      const responseOK = response && response.status === 200 && response.statusText === 'OK';
      let data = null;

      if (responseOK) {
        data = await response.data;
      }

      return data;
    } catch (error) {
      logger.warn('An error occured while trying get the coin from CoinGecko');
    }
  },

  async getCoinFromAllCoins(coinCode) {
    const path = `list`;
    const response = await this.fetch(path);
    let coin = this.getFilteredCoinFromList(response, coinCode);
    return coin;
  },

  async getCoinByID(coin) {
    let response = null;

    if (coin) {
      const { id } = coin;
      response = await this.fetch(id);
    }

    return response;
  },

  getFilteredCoinFromList(list, coinCode) {
    let filteredItem = null;
    if (list && list.length > 0)
      filteredItem = list.filter((item) => item.symbol.toLowerCase() === coinCode.toLowerCase())[0];
    return filteredItem;
  },
};

module.exports = CoinGeckoService;
