const path = require('path');
const sinon = require('sinon');
const coinGeckoService = require(path.join(srcDir, '/services/api/coinGeckoService'));

describe('Service: coinGeckoService', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('fetch', () => {
    it('should return empty list from CoinGecko', async () => {
      let list = await coinGeckoService.fetch('null');
      expect(list).to.eq(undefined);
    });
  });

  describe('getFilteredCoinFromList', () => {
    it('should return null', async () => {
      let coin = await coinGeckoService.getFilteredCoinFromList([], 'BTC');
      expect(coin).to.eq(null);
    });

    it('should return value', async () => {
      let coin = await coinGeckoService.getFilteredCoinFromList([{ symbol: 'BTC' }], 'BTC');
      expect(coin.symbol).to.eq('BTC');
    });
  });

  describe('getCoinByID', () => {
    it('should fetch one coin by ID', async () => {
      let coin = await coinGeckoService.getCoinByID({ id: 'bitcoin' });
      expect(coin).to.be.an('object');
      expect(coin.id).to.eq('bitcoin');
    });
  });
});
