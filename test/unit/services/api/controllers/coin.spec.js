const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(4);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });

    it('should get coin by code without calling CoinGecko', async () => {
      const coinCode = 'ETH';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(4);
    });
  });

  describe('createCoin', () => {
    it('should add new coin', async () => {
      const payload = {
        name: "Blockasset",
        code: "block"
      }
      const coin = await CoinController.createCoin(payload);

      expect(coin.code.toLowerCase()).to.eq(payload.code.toLowerCase());
    });

    it('should fail add coin by existed code', async () => {
      const payload = {
        name: "Bitcoin",
        code: "BTC"
      }
      expect(CoinController.createCoin(payload)).to.be.rejectedWith(Error, 'coin_code_exists');
    });
  });

  describe('getCoinPriceFromCoinGecko', () => {
    it('should return coin price from CoinGecko', async () => {
      const coinCode = 'BTC';
      const price = await CoinController.getCoinPriceFromCoinGecko(coinCode);

      expect(typeof price).to.eq('number');
    });
  });
});
