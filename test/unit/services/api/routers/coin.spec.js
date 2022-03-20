const path = require('path');
const sinon = require('sinon');
const Router = require('@koa/router');
const CoinRouter = require(path.join(srcDir, '/services/api/routers/coin'));
const config = require(path.join(srcDir, '../config'));
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const DB = require(path.join(srcDir, 'modules/db'));

describe('Router: coin', () => {
  let sandbox = null;
  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.get = sandbox.stub(Router.prototype, 'get');
  });

  afterEach(() => {
    config.DEMO_ACCOUNT = null;
    sandbox && sandbox.restore();
  });

  it('Should get getCoinByCode', async () => {
    const ctx = {
      params: { coinCode: 'BTC' },
    };
    await CoinRouter.getCoinByCode(ctx);

    expect(ctx.body).to.be.an('object');
  });

  it('Should put createCoin', async () => {
    const ctx = {
      request: {
        body: {
          name: 'Bitcoin',
          code: 'DTR',
        },
      },
    };
    await CoinRouter.createCoin(ctx);

    expect(ctx.body).to.be.an('object');
  });
});
