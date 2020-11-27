const ChainlinkToOracleBridge = artifacts.require('ChainlinkToOracleBridge')
const ChainlinkProxyOracle = artifacts.require('ChainlinkProxyOracle')

module.exports = async (deployer, network, [defaultAccount]) => {
  let chainlinkBridgeInstance = await ChainlinkToOracleBridge.deployed();
  await deployer.deploy(ChainlinkProxyOracle, chainlinkBridgeInstance.address);
}
