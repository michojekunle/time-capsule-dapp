const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TimeCapsuleModule", (m) => {
  const TimeCapsule = m.contract("TimeCapsule");

  return { TimeCapsule };
});
