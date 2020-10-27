const ChainklinkToOracleBridge = artifacts.require('ChainklinkToOracleBridge')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')

module.exports = async (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (!network.startsWith('live')) {
    const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')

    LinkToken.setProvider(deployer.provider)
    Oracle.setProvider(deployer.provider)
    try {
      await deployer.deploy(LinkToken, { from: defaultAccount })
      oc = await deployer.deploy(Oracle, LinkToken.address, { from: defaultAccount })
      await deployer.deploy(ChainklinkToOracleBridge, LinkToken.address, oc.address, jobId)
    } catch (err) {
      console.error(err)
    }
  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    deployer.deploy(ChainklinkToOracleBridge, '0x0000000000000000000000000000000000000000')
  }
}
