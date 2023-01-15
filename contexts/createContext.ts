import React, { useContext } from 'react'

/**
 * Create a React context with a default value and provide a name for it to be thrown when the
 *  context is used without a provider.
 * @param name
 * @param defaultValue
 */
const createContext = <A>(name: string, defaultValue?: A) => {
  const ctx = React.createContext<A | undefined>(defaultValue)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error(`${name} must be inside a provider with a value`)
    return c
  }

  return [useCtx, ctx.Provider] as const
}

export default createContext
