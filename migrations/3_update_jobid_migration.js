const ChainlinkToOracleBridge = artifacts.require('ChainlinkToOracleBridge')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')

module.exports = async (deployer, network, [defaultAccount]) => {
  const jobId = web3.utils.toHex('0x02972d3df83baa74550165d0e35ca3892b36051bfc61fe1f17ff07746806d3f8')

  let instance = await ChainlinkToOracleBridge.deployed();
  let result = await instance.setChainlinkJobId(jobId);
  //console.log(result);
}
