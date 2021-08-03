module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
  await deploy("Robots", {
    from: deployer,
    // gas: 4000000,
    args: ["Robots", "RBT", "ipfs://ipfs/QmSuhju6wr5GRUU1xxgruy7xyzkajTysMDsCgEu588vnbg/metadata/"],
  });
};
