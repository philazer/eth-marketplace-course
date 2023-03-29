

import { useEffect } from "react"
import useSWR from "swr"

const adminAddresses = {
  "0x6a7c0c343fb4f0606b4a52753d77b59c1e52fc8da0c1689fafe3546a7c4744dd": true,
  "0x8bd0bd148d4a9da14cda7de24f21dc2a8888740b24577385e9095c527ccec69c": true
}

export const handler = (web3, provider) => () => {

  const { data, mutate, ...rest } = useSWR(() =>
    web3 ? "web3/accounts" : null,
    async () => {
      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]

      if (!account) {
        throw new Error("Cannot retreive an account. Please refresh the browser.")
      }

      return account
    }
  )

  useEffect(() => {
    const mutator = accounts => mutate(accounts[0] ?? null)
    provider?.on("accountsChanged", mutator)

    return () => {
      provider?.removeListener("accountsChanged", mutator)
    }
  }, [provider])

  return {
    data,
    isAdmin: (
      data &&
      adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest
  }
}
