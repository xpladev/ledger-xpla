/** ******************************************************************************
 *  (c) 2021-2022 Zondax GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */
import { DEFAULT_START_OPTIONS, DeviceModel } from '@zondax/zemu'

const Resolve = require('path').resolve

export const AMINO_JSON_TX = 0x0
export const TEXTUAL_TX = 0x1
export const APP_SEED = 'equip will roof matter pink blind book anxiety banner elbow sun young'

const APP_PATH_S  = Resolve('../app/output/app_s.elf')
const APP_PATH_X  = Resolve('../app/output/app_x.elf')
const APP_PATH_SP = Resolve('../app/output/app_s2.elf')

export const DEFAULT_OPTIONS = {
  ...DEFAULT_START_OPTIONS,
  logging: true,
  custom: `-s "${APP_SEED}"`,
  pressDelay: 1500,
  X11: false,
}

export const DEVICE_MODELS: DeviceModel[] = [
  { name: 'nanos',  prefix: 'S',  path: APP_PATH_S  },
  { name: 'nanox',  prefix: 'X',  path: APP_PATH_X  },
  { name: 'nanosp', prefix: 'SP', path: APP_PATH_SP },
]


export const example_tx_str_basic = {
  account_number: '108',
  chain_id: 'dimension_37-1',
  fee: {
    amount: [
      {
        amount: '170000000000000000',
        denom: 'axpla',
      },
    ],
    gas: '200000',
  },
  memo: '',
  msgs: [
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1kn3wugetjuy4zetlq6wadchfhvu3x740ae6z6x',
      },
    },
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
      },
    },
  ],
  sequence: '106',
}

export const example_tx_str_expert = {
  account_number: '108',
  chain_id: 'dimension_37-1',
  fee: {
    amount: [
      {
        amount: '170000000000000000',
        denom: 'axpla',
      },
    ],
    gas: '200000',
  },
  memo: '',
  msgs: [
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1kky4yzth6gdrm8ga5zlfwhav33yr7hl87jycah',
        validator_address: 'xplavaloper1kn3wugetjuy4zetlq6wadchfhvu3x740ae6z6x',
      },
    },
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1kky4yzth6gdrm8ga5zlfwhav33yr7hl87jycah',
        validator_address: 'xplavaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
      },
    },
  ],
  sequence: '106',
}

export const example_tx_str_combined = {
  account_number: '108',
  chain_id: 'cube_47-5',
  fee: {
    amount: [
      {
        amount: '170000000000000000',
        denom: 'axpla',
      },
    ],
    gas: '200000',
  },
  memo: '',
  msgs: [
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1648ynlpdw7fqa2axt0w2yp3fk542junl7rsvq6',
      },
    },
    {
      type: 'cosmos-sdk/MsgDelegate',
      value: {
        amount: {
          amount: '20139397000000000000',
          denom: 'axpla',
        },
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1648ynlpdw7fqa2axt0w2yp3fk542junl7rsvq6',
      },
    },
  ],
  sequence: '106',
}

export const example_tx_str_basic2 = {
  account_number: '482',
  chain_id: 'cube_47-5',
  fee: {
    amount: [],
    gas: '10000000',
  },
  memo: '',
  msgs: [
    {
      type: 'somechain/MsgNew',
      value: {
        coins: [
          {
            amount: '20139397000000000000',
            asset: 'axpla',
          },
        ],
        memo: 'memo_text_goes_here',
        signer: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
      },
    },
  ],
  sequence: '6',
}

export const example_tx_str_basic_extra_fields = {
  account_number: '108',
  chain_id: 'cube_47-5',
  extra_field: 'empty',
  fee: {
    amount: [
      {
        amount: '170000000000000000',
        denom: 'axpla',
      },
    ],
    gas: '200000',
  },
  foo: 'bar',
  memo: '',
  msgs: [
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1kn3wugetjuy4zetlq6wadchfhvu3x740ae6z6x',
      },
    },
    {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: {
        delegator_address: 'xpla1w34k53py5v5xyluazqpq65agyajavep2rflq6h',
        validator_address: 'xplavaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
      },
    },
  ],
  sequence: '106',
  unknown_field: 123456
}

export const ibc_denoms = {
  account_number: "0",
  chain_id: "cube_47-5",
  fee: {
    amount: [
      {
        amount: '85000000000000000',
        denom: 'axpla',
      }
    ],
    gas: '10000',
  },
  memo: "testmemo",
  msgs: [
    {
      inputs: [
        {
          address: "xplaaccaddr1d9h8qat5e4ehc5",
          coins: [
            {
              amount: '10',
              denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
            }
          ]
        }
      ],
      outputs: [
        {
          address: 'xplaaccaddr1da6hgur4wse3jx32',
          coins: [
            {
              amount: '10',
              denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
            }
          ]
        }
      ]
    }
  ],
  sequence: '1'
}

export const setWithdrawAddress = {
    account_number: '8',
    chain_id: 'testing',
    fee: {
      amount: [
        {
          amount: '170000000000000000',
          denom: 'axpla'
        }
      ],
      gas: '200000'
    },
    memo: '',
    msgs: [
      {
        type: 'cosmos-sdk/MsgSetWithdrawAddress',
        value: {
          delegator_address: 'xpla1hr9x0sjvel6z3vt9qny8sdd5gnnlgk0p69d6cv',
          withdraw_address: 'xpla12d64j98tjjpqkx70r08aspc4nvntqp2w6wr2de'
        }
      },
      {
        type: 'cosmos-sdk/MsgWithdrawDelegationReward',
        value: {
          delegator_address: 'xpla1hr9x0sjvel6z3vt9qny8sdd5gnnlgk0p69d6cv',
          validator_address: 'xplavaloper13dr26wdygna3s8fdl5tlc45m2le2ydyddxzj49'
        }
      }
    ],
    sequence: '7'
  }

  export const cliGovDeposit = {
    account_number: '8',
    chain_id: 'my-chain',
    fee: {
      amount: [],
      gas: '200000'
    },
    memo: 'A B C',
    msgs: [
      {
        type: 'cosmos-sdk/MsgDeposit',
        value: {
          amount: [{
            amount: '10000000000000000000',
            denom: 'axpla',
          }],
          depositor: 'xpla1xl2256vdh0j68khz9wq88hnyqcq0f5f4za2480',
          proposal_id: '1'
        }
      },
    ],
    sequence: '2'
  }
