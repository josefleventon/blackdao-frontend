/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/amino";
import { Addr, Uint128, InstantiateMsg, ExecuteMsg, Binary, Cw20ReceiveMsg, QueryMsg, DepositInfoResponse, SupplyInfoResponse } from "./BlackBurn.types";
import { BlackBurnQueryClient, BlackBurnClient } from "./BlackBurn.client";
export const blackBurnQueryKeys = {
  contract: ([{
    contract: "blackBurn"
  }] as const),
  address: (contractAddress: string | undefined) => ([{ ...blackBurnQueryKeys.contract[0],
    address: contractAddress
  }] as const),
  supplyInfo: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...blackBurnQueryKeys.address(contractAddress)[0],
    method: "supply_info",
    args
  }] as const),
  depositInfo: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...blackBurnQueryKeys.address(contractAddress)[0],
    method: "deposit_info",
    args
  }] as const)
};
export interface BlackBurnReactQuery<TResponse, TData = TResponse> {
  client: BlackBurnQueryClient | undefined;
  options?: Omit<UseQueryOptions<TResponse, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
    initialData?: undefined;
  };
}
export interface BlackBurnDepositInfoQuery<TData> extends BlackBurnReactQuery<DepositInfoResponse, TData> {
  args: {
    address: Addr;
  };
}
export function useBlackBurnDepositInfoQuery<TData = DepositInfoResponse>({
  client,
  args,
  options
}: BlackBurnDepositInfoQuery<TData>) {
  return useQuery<DepositInfoResponse, Error, TData>(blackBurnQueryKeys.depositInfo(client?.contractAddress, args), () => client ? client.depositInfo({
    address: args.address
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface BlackBurnSupplyInfoQuery<TData> extends BlackBurnReactQuery<SupplyInfoResponse, TData> {}
export function useBlackBurnSupplyInfoQuery<TData = SupplyInfoResponse>({
  client,
  options
}: BlackBurnSupplyInfoQuery<TData>) {
  return useQuery<SupplyInfoResponse, Error, TData>(blackBurnQueryKeys.supplyInfo(client?.contractAddress), () => client ? client.supplyInfo() : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface BlackBurnClaimMutation {
  client: BlackBurnClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useBlackBurnClaimMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, BlackBurnClaimMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, BlackBurnClaimMutation>(({
    client,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.claim(fee, memo, funds), options);
}
export interface BlackBurnReceiveMutation {
  client: BlackBurnClient;
  msg: Cw20ReceiveMsg;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useBlackBurnReceiveMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, BlackBurnReceiveMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, BlackBurnReceiveMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.receive(msg, fee, memo, funds), options);
}