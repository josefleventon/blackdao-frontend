import { SignerOptions } from '@cosmos-kit/core'
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from 'cosmwasm'
import { assets, chains } from 'chain-registry'
import { wallets as KeplrWallet } from '@cosmos-kit/keplr'
import { wallets as CosmostationWallet } from '@cosmos-kit/cosmostation'
import { wallets as TrustWallet } from '@cosmos-kit/trust'

const signerOptions: SignerOptions = {
  signingCosmwasm: ({
    chain_name,
  }): SigningCosmWasmClientOptions | undefined => {
    let gasTokenName: string | undefined
    switch (chain_name) {
      case 'localjuno':
      case 'junotestnet':
        gasTokenName = 'ujunox'
        break
      case 'juno':
        gasTokenName = 'ujuno'
        break
    }
    // @ts-ignore messed up dependencies
    return gasTokenName
      ? { gasPrice: GasPrice.fromString(`0.0025${gasTokenName}`) }
      : undefined
  },
}

const CosmosKitConfig = {
  chains,
  assetLists: assets,
  signerOptions,
  wallets: [...KeplrWallet, ...CosmostationWallet, ...TrustWallet],
}

export default CosmosKitConfig
