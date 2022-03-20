const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const coinGeckoService = require('../coinGeckoService');
const Utils = require('../../../helpers/utils');

const CoinController = {

  async getCoinByCode(coinCode) {

    const code = coinCode.toUpperCase();

    let coin = await Models.Coin.findByCoinCode(code);

    errors.assertExposable(coin, 'unknown_coin_code');

    let filteredCoin = coin.filterKeys();

    const { updatedAt, price } = filteredCoin;
    const lessThanOneHourAgo = Utils.lessThanOneHourAgo(updatedAt);

    if(!lessThanOneHourAgo || !price ) {
      const coinPriceFromCoinGecko = await this.getCoinPriceFromCoinGecko(coinCode);
      filteredCoin = {
        ...filteredCoin,
        price: coinPriceFromCoinGecko,
      }
    }

    delete filteredCoin.updatedAt;

    return filteredCoin;
  },

  async createCoin(payload) {

    const { code } = payload;
    const coinPrice = await this.getCoinPriceFromCoinGecko(code);

    payload = {
      ...payload,
      price: coinPrice,
    }

    const coins = await Models.Coin.findByCoinCode(code);

    if(coins) errors.assertExposable(false, 'coin_code_exists');
    else {
      const coin = await Models.Coin.createCoin(payload);

      const filteredCoin = coin.filterKeys();
      delete filteredCoin.updatedAt;

      return filteredCoin;
    }
  },

  async getCoinPriceFromCoinGecko(code) {

    const coinsDetails = await coinGeckoService.getCoinFromAllCoins(code);
    const coin = await coinGeckoService.getCoinByID(coinsDetails);

    let price = null;

    if(coin) {
      price = coin.market_data.current_price.usd;
    }

    return price;
  }
};

module.exports = CoinController;
