import type { NextPage } from 'next'
import { useChain } from '@cosmos-kit/react'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { classNames } from 'util/css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useQuery from 'contexts/query'
import { Cw20BaseQueryClient } from 'types/Cw20Base.client'
import { BlackBurnMessageComposer } from 'types/BlackBurn.message-composer'
import { Cw20BaseMessageComposer } from 'types/Cw20Base.message-composer'
import useTx from 'contexts/tx'
import { min } from 'lodash'

const Home: NextPage = () => {
  const {
    wallet,
    address,
    connect,
    disconnect,
    getCosmWasmClient,
    getSigningCosmWasmClient,
  } = useChain(process.env.NEXT_PUBLIC_CHAIN!)

  const { queryClient } = useQuery()
  const { tx } = useTx()

  const [revalidateCounter, setRevalidateCounter] = useState<number>(0)
  const revalidate = () => setRevalidateCounter(revalidateCounter + 1)

  const [burnAmount, setBurnAmount] = useState<number>(0)

  const [redBalance, setRedBalance] = useState<number>()
  const [blueBalance, setBlueBalance] = useState<number>()
  const [blackBalance, setBlackBalance] = useState<number>()

  const burn = useCallback(async () => {
    if (!wallet || !address || !burnAmount) return
    const redMessageComposer = new Cw20BaseMessageComposer(
      address,
      process.env.NEXT_PUBLIC_RED_CONTRACT_ADDRESS!,
    )
    const blueMessageComposer = new Cw20BaseMessageComposer(
      address,
      process.env.NEXT_PUBLIC_BLUE_CONTRACT_ADDRESS!,
    )
    const burnMessageComposer = new BlackBurnMessageComposer(
      address,
      process.env.NEXT_PUBLIC_BLACKBURN_CONTRACT_ADDRESS!,
    )

    console.log(redMessageComposer, blueMessageComposer, burnMessageComposer)

    const msgs = [
      redMessageComposer.send({
        amount: String(burnAmount * 1_000_000),
        contract: burnMessageComposer.contractAddress,
        msg: 'e30=',
      }),
      blueMessageComposer.send({
        amount: String(burnAmount * 1_000_000),
        contract: burnMessageComposer.contractAddress,
        msg: 'e30=',
      }),
      burnMessageComposer.claim(),
    ]

    console.log(msgs)

    tx(msgs, {}, () => {
      revalidate()
    })
  }, [getSigningCosmWasmClient, burnAmount, wallet, address, tx])

  useEffect(() => {
    async function effect() {
      if (!wallet || !address) return
      console.log(address)

      const cosmWasmClient = await getCosmWasmClient()

      const redClient = new Cw20BaseQueryClient(
        cosmWasmClient,
        process.env.NEXT_PUBLIC_RED_CONTRACT_ADDRESS!,
      )
      const blueClient = new Cw20BaseQueryClient(
        cosmWasmClient,
        process.env.NEXT_PUBLIC_BLUE_CONTRACT_ADDRESS!,
      )
      const blackClient = new Cw20BaseQueryClient(
        cosmWasmClient,
        process.env.NEXT_PUBLIC_BLACK_CONTRACT_ADDRESS!,
      )
      try {
        const redBal = await redClient.balance({ address })
        const blueBal = await blueClient.balance({ address })
        const blackBal = await blackClient.balance({ address })

        setRedBalance(parseInt(redBal.balance) / 1_000_000)
        setBlueBalance(parseInt(blueBal.balance) / 1_000_000)
        setBlackBalance(parseInt(blackBal.balance) / 1_000_000)
      } catch {}
    }

    effect()
  }, [wallet, address, revalidateCounter])

  return (
    <main
      onLoad={disconnect}
      className="w-screen min-h-screen overflow-x-hidden bg-black"
    >
      <nav className="fixed top-0 left-0 right-0">
        <div className="flex flex-row items-start justify-center h-24 max-w-4xl mx-auto">
          <a
            href="https://daodao.zone/dao/juno1tdtlknd7teett06r3xcqflm8jevyuz50ph8atlfge0zkvf0e6gfqq8nafj"
            rel="noopener noreferrer"
            target="_blank"
            className="from-[#B20808] to-[#955B5B] text-center h-16 bg-gradient-to-tr hover:bg-gradient-to-t border border-r-0 border-t-0 border-white text-white font-mono flex justify-center items-center lg:rounded-t-none lg:rounded-l-lg w-full"
          >
            <div className="flex flex-col">
              <p className="text-xl font-semibold">TEAM RED</p>
              {wallet && <p>{redBalance} $RED</p>}
            </div>
          </a>
          <a className="flex items-center text-center cursor-pointer justify-center w-full h-full font-mono text-white bg-gradient-to-t from-[#000000] to-[#313131] border-2 border-t-0 border-white rounded-b-lg shadow-inner">
            <div className="flex flex-col">
              <p className="text-2xl font-bold">TEAM BLACK</p>
              {wallet && <p>{blackBalance} $BLACK</p>}
            </div>
          </a>
          <a
            href="https://daodao.zone/dao/juno1zrh3a437jcdv0jkm0k7eflww57s9zlwzesdvu83xhtt74y4yfcmsykhtcz"
            rel="noopener noreferrer"
            target="_blank"
            className="from-[#0C08B2] to-[#5C5B95] text-center bg-gradient-to-tl hover:bg-gradient-to-t border border-l-0 border-t-0 border-white text-white font-mono flex justify-center items-center lg:rounded-t-none lg:rounded-r-lg w-full h-16"
          >
            <div className="flex flex-col">
              <p className="text-xl font-semibold">TEAM BLUE</p>
              {wallet && <p>{blueBalance} $BLUE</p>}
            </div>
          </a>
        </div>
      </nav>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-3xl p-12 mx-auto font-mono text-center text-white border-2 border-white rounded-lg">
          <h1 className="text-2xl font-semibold">Get BLACK (Burn RED/BLUE)</h1>
          <h2 className="mt-2 text-base font-medium">
            Must have equal parts RED/BLUE
          </h2>

          <div className="mt-4">
            <a
              onClick={() => (wallet ? disconnect() : connect())}
              className="mr-2 text-sm text-purple-500 underline cursor-pointer hover:text-purple-700"
            >
              {wallet ? 'Disconnect' : 'Connect Wallet'}
            </a>
          </div>

          <div className="flex flex-row justify-between mt-8">
            <p className="ml-2 text-sm">RED/BLUE TOKENS</p>
            <a
              onClick={() => {
                if (redBalance && blueBalance)
                  setBurnAmount(min([redBalance, blueBalance])!)
              }}
              className="mr-2 text-sm text-purple-500 underline cursor-pointer hover:text-purple-700"
            >
              MAX{' '}
              {redBalance && blueBalance
                ? `(${min([redBalance, blueBalance])})`
                : ''}
            </a>
          </div>
          <div className="relative mt-1.5 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image src="/redblue.png" width={20} height={21} alt="red&blue" />
            </div>
            <input
              type="number"
              name="redblue"
              id="redblue"
              className="block w-full h-12 pl-10 placeholder-white bg-black border-white rounded-md focus:placeholder-white/25 focus:ring-purple-500 sm:text-sm"
              placeholder="0.00"
              value={burnAmount}
              onChange={(e) => setBurnAmount(parseFloat(e.currentTarget.value))}
            />
          </div>

          <ArrowDownIcon className="w-6 h-6 mx-auto my-4 text-white/50" />

          <div className="relative mt-1.5 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image src="/black.png" width={20} height={21} alt="black" />
            </div>
            <input
              disabled
              type="number"
              name="black"
              id="black"
              className="block w-full h-12 pl-10 bg-black rounded-md border-white/25 placeholder-white/50 focus:ring-purple-500 sm:text-sm"
              placeholder="0.00"
              value={burnAmount.toFixed(2)}
            />
          </div>

          <button
            onClick={burn}
            className={classNames(
              !wallet
                ? 'border-white/25 text-white/25 cursor-not-allowed'
                : 'border-white text-white hover:bg-white hover:text-black',
              'inline-flex justify-center items-center border rounded-md w-full py-3.5 px-4 mt-6',
            )}
          >
            Burn RED/BLUE
          </button>
        </div>
      </div>
    </main>
  )
}

export default Home
