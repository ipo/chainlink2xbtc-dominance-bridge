const ChainlinkToOracleBridge = artifacts.require('ChainlinkToOracleBridge')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')

module.exports = async (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')

  if (!network.startsWith('live')) {
    LinkToken.setProvider(deployer.provider)
    Oracle.setProvider(deployer.provider)
    try {
      await deployer.deploy(LinkToken, { from: defaultAccount })
      oc = await deployer.deploy(Oracle, LinkToken.address, { from: defaultAccount })
      await deployer.deploy(ChainlinkToOracleBridge, LinkToken.address, oc.address, jobId)
    } catch (err) {
      console.error(err)
    }
  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    var linkOracleAddress = '0xf6c446Cb58735c52c35B0a22af13BDb39869D753'
    deployer.deploy(ChainlinkToOracleBridge, '0x0000000000000000000000000000000000000000', linkOracleAddress, jobId)
  }
}
