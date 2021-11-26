const MetaCoin = artifacts.require("AdminMissionManager");

module.exports = function (deployer) {
  deployer.deploy(AdminMissionManager);
};
