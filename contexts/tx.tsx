import { FC, PropsWithChildren, ReactNode, useContext } from 'react'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { isDeliverTxSuccess } from '@cosmjs/stargate'
import { coins } from '@cosmjs/stargate'
import useToaster, { ToastPayload, ToastTypes } from 'hooks/toast'
import { useChain } from '@cosmos-kit/react'
import createContext from './createContext'

// Context to handle simple signingClient transactions
export interface Msg {
  typeUrl: string
  value: any
}

export interface TxOptions {
  gas?: number
  toast?: {
    title?: ToastPayload['title']
    message?: ToastPayload['message']
    type?: ToastTypes
    actions?: JSX.Element
  }
}

export interface TxContext {
  tx: (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => Promise<void>
}

const [useTx, _TxProvider] = createContext<TxContext>('tx', {
  tx: () => new Promise(() => {}),
})

export const TxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { getSigningCosmWasmClient, address } = useChain(
    process.env.NEXT_PUBLIC_CHAIN!,
  )

  const toaster = useToaster()

  // Method to sign & broadcast transaction
  const tx = async (
    msgs: Msg[],
    options: TxOptions,
    callback?: (log: any) => void,
  ) => {
    console.log(msgs)
    // Get the signing cosmwasm client
    const signingCosmWasmClient = await getSigningCosmWasmClient()

    // Gas config
    const fee = {
      amount: coins(0, 'uosmo'),
      gas: options.gas ? String(options.gas) : '666666',
    }

    // Broadcast the redelegation message to Keplr
    let signed
    try {
      if (address) {
        signed = await signingCosmWasmClient?.sign(address, msgs, fee, '')
      }
    } catch (e) {
      console.error(e)
      toaster.toast({
        title: 'Request Rejected',
        dismissable: true,
        type: ToastTypes.Error,
      })
      return
    }

    let broadcastToastId = ''

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 },
    )

    if (signingCosmWasmClient && signed) {
      await signingCosmWasmClient
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
          toaster.dismiss(broadcastToastId)
          if (isDeliverTxSuccess(res)) {
            // Get raw log
            let log = JSON.parse(res.rawLog as string)

            // Run callback
            if (callback) callback(log[0])

            toaster.toast({
              title: options.toast?.title || 'Transaction Successful',
              type: options.toast?.type || ToastTypes.Success,
              dismissable: true,
              actions: options.toast?.actions || <></>,
              message: options.toast?.message || <></>,
            })
          } else {
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error,
            })
          }
        })
    } else {
      toaster.dismiss(broadcastToastId)
    }
  }

  return <_TxProvider value={{ tx }}>{children}</_TxProvider>
}

export default useTx
