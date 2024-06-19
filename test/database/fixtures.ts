import { config as _config } from "../../src/config"

export const ASSET_MANAGER = {
  address: "0x0000000000000000000000000000000000000000",
  agents: [{
    address: "0000000000000000000000000000000000000001",
    vaults: [{
      address: "0000000000000000000000000000000000000002",
      collateralPool: "0000000000000000000000000000000000000021",
      underlyingAddress: "qhbr0431"
    }]
  }]
}

_config.database.dbName = "fasset-open-beta-monitor.test.db"
export const config = _config