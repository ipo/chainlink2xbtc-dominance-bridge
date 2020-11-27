/* eslint-disable @typescript-eslint/no-var-requires */
const { oracle } = require('@chainlink/test-helpers')
const { expectRevert, time } = require('@openzeppelin/test-helpers')

contract('ChainlinkProxyOracle', accounts => {
  const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
  const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')
  const ChainlinkToOracleBridge = artifacts.require('ChainlinkToOracleBridge.sol')
  const ChainlinkProxyOracle = artifacts.require('ChainlinkProxyOracle.sol')

  const defaultAccount = accounts[0]
  const oracleNode = accounts[1]
  const stranger = accounts[2]
  const consumer = accounts[3]

  // These parameters are used to validate the data was received
  // on the deployed oracle contract. The Job ID only represents
  // the type of data, but will not work on a public testnet.
  // For the latest JobIDs, visit our docs here:
  // https://docs.chain.link/docs/testnet-oracles
  const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')
  const url =
    'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY'
  const path = 'USD'
  const times = 100

  // Represents 1 LINK for testnet requests
  const payment = web3.utils.toWei('1')

  let link, oc, cc, cob

  beforeEach(async () => {
    link = await LinkToken.new({ from: defaultAccount })
    oc = await Oracle.new(link.address, { from: defaultAccount })
    cc = await ChainlinkToOracleBridge.new(link.address, oc.address, jobId, { from: consumer })
    await oc.setFulfillmentPermission(oracleNode, true, {
      from: defaultAccount,
    })
    await cc.addProvider(consumer, {
      from: consumer,
    })

    cob = await ChainlinkProxyOracle.new(cc.address, { from: consumer })
  })

  describe('#proxyOracle', () => {
    context('get data', () => {
      let request

      beforeEach(async () => {
        // set up a correct request
        await link.transfer(cc.address, web3.utils.toWei('1', 'ether'), {
          from: defaultAccount,
        })
        const tx = await cc.createRequest(
          payment,
          { from: consumer },
        )
        const expected = 50000
        const response = web3.utils.padLeft(web3.utils.toHex(expected), 64)
        let request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
        await oc.fulfillOracleRequest(
          ...oracle.convertFufillParams(request, response, {
            from: oracleNode,
            gas: 500000,
          }),
        )
      })

      it('normally', async () => {
        // ensure the data gotten is correct
        const price0 = await cc.data.call()
        const price1 = await cob.getData.call()
        assert.equal(
          web3.utils.toHex(price0),
          web3.utils.toHex(price1['0']),
        )
        // ensure it can be gotten as a transaction too
        const tx = await cob.getData(
          { from: stranger },
        )
    })
    })
  })
})
