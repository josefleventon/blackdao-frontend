import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useChain } from '@cosmos-kit/react'
import createContext from './createContext'
import { BlackBurnQueryClient } from 'types/BlackBurn.client'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export interface QueryContext {
  queryClient: BlackBurnQueryClient | undefined
}

const [useQuery, _QueryProvider] = createContext<QueryContext>('query', {
  queryClient: undefined,
})

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient, setQueryClient] = useState<BlackBurnQueryClient>()
  const { getCosmWasmClient } = useChain(process.env.NEXT_PUBLIC_CHAIN!)

  useEffect(() => {
    async function effect() {
      const cosmWasmClient = await getCosmWasmClient()
      setQueryClient(
        new BlackBurnQueryClient(
          cosmWasmClient,
          process.env.NEXT_PUBLIC_BLACKBURN_CONTRACT_ADDRESS!,
        ),
      )
    }

    effect()
  }, [])

  return <_QueryProvider value={{ queryClient }}>{children}</_QueryProvider>
}

export default useQuery
