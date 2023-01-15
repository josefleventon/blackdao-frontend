import type { AppProps } from 'next/app'

import { ChainProvider } from '@cosmos-kit/react'
import { ChakraProvider } from '@chakra-ui/react'

import '../styles/globals.css'
import CosmosKitConfig from 'config/cosmos-kit'
import { QueryProvider } from 'contexts/query'
import { defaultTheme } from 'config/theme'
import { Toaster } from 'react-hot-toast'
import { TxProvider } from 'contexts/tx'

function DefectorsApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider {...CosmosKitConfig}>
        <QueryProvider>
          <TxProvider>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
          </TxProvider>
        </QueryProvider>
      </ChainProvider>
    </ChakraProvider>
  )
}

export default DefectorsApp
