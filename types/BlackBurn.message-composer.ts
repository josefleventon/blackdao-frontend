/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "cosmwasm";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { Addr, Uint128, InstantiateMsg, ExecuteMsg, Binary, Cw20ReceiveMsg, QueryMsg, DepositInfoResponse, SupplyInfoResponse } from "./BlackBurn.types";
export interface BlackBurnMessage {
  contractAddress: string;
  sender: string;
  receive: ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds?: Coin[]) => MsgExecuteContractEncodeObject;
  claim: (funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class BlackBurnMessageComposer implements BlackBurnMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receive = this.receive.bind(this);
    this.claim = this.claim.bind(this);
  }

  receive = ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          receive: {
            amount,
            msg,
            sender
          }
        })),
        funds
      })
    };
  };
  claim = (funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim: {}
        })),
        funds
      })
    };
  };
}