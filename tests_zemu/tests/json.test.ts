/** ******************************************************************************
 *  (c) 2018-2022 Zondax GmbH
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

import Zemu from '@zondax/zemu'
// @ts-ignore
import XplaApp from '@xpla/ledger-xpla-js'
import { DEFAULT_OPTIONS, DEVICE_MODELS, example_tx_str_basic, example_tx_str_basic2, ibc_denoms, setWithdrawAddress, cliGovDeposit } from './common'

// @ts-ignore
import { recoverPublicKey } from '@ethersproject/signing-key'
// @ts-ignore
import { keccak256 } from '@ethersproject/keccak256'
// @ts-ignore
import { computeAddress } from '@ethersproject/transactions'


function parseSignature(data: any): Buffer {
  const src = Buffer.from(data)
  const tar = new Buffer(65)
  let c = 0

  // DER 형식
  if (src[c++] != 48)
    return tar;
  
  // 총 길이
  //const tlen = src[c++]
  c++
 
  // r 시작
  if (src[c++] != 2)
    return tar;

  // r 길이
  const rlen = src[c++]

  // 뒤쪽에서부터 32바이트만 복사
  c += rlen
  src.copy(tar, 0, c - 32, c)

  // s 시작
  if (src[c++] != 2)
    return tar;

  // s 길이
  const slen = src[c++]

  // 뒤쪽에서부터 32바이트만 복사
  c += slen
  src.copy(tar, 32, c - 32, c)

  // v 복사
  tar[64] = src[src.length - 1]

  // 결과
  return tar
}


jest.setTimeout(120000)

describe('Json', function () {
  // eslint-disable-next-line jest/expect-expect

  test.each(DEVICE_MODELS)('can start and stop container', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('sign basic normal', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')
      //console.log('respPk', respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic`)

      const resp = await signatureRequest
      //console.log('resp', resp)

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))
      //console.log('pk', Uint8Array.from(Buffer.from(pk.substring(2), 'hex')))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      //console.log('msgHash', msgHash)
      const sig = parseSignature(resp.signature.data)
      //console.log('sig', Uint8Array.from(sig))
      const pub = computeAddress(recoverPublicKey(msgHash, sig));
      //console.log('pub', Uint8Array.from(Buffer.from(pub.substring(2), 'hex')))

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('sign basic normal2', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic2))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic2`)

      const resp = await signatureRequest

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      const sig = parseSignature(resp.signature.data)
      const pub = computeAddress(recoverPublicKey(msgHash, sig));

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('sign basic with extra fields', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic_extra_fields`)

      const resp = await signatureRequest

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      const sig = parseSignature(resp.signature.data)
      const pub = computeAddress(recoverPublicKey(msgHash, sig));

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('ibc denoms', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(ibc_denoms))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-ibc_denoms`)

      const resp = await signatureRequest

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      const sig = parseSignature(resp.signature.data)
      const pub = computeAddress(recoverPublicKey(msgHash, sig));

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('SetWithdrawAddress', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(setWithdrawAddress))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-setWithdrawAddress`)

      const resp = await signatureRequest

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      const sig = parseSignature(resp.signature.data)
      const pub = computeAddress(recoverPublicKey(msgHash, sig));

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('CLIGovDeposit', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      const path = [44, 60, 0, 0, 0]
      const tx = Buffer.from(JSON.stringify(cliGovDeposit))

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, 'xpla')
      expect(respPk.return_code).toEqual(0x9000)
      expect(respPk.error_message).toEqual('No errors')

      // do not wait here..
      const signatureRequest = app.sign(path, tx)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-govDeposit`)

      const resp = await signatureRequest

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const pk = computeAddress(Uint8Array.from(respPk.compressed_pk.data))

      const msgHash = Uint8Array.from(Buffer.from(keccak256(tx).substring(2), 'hex'))
      const sig = parseSignature(resp.signature.data)
      const pub = computeAddress(recoverPublicKey(msgHash, sig));

      expect(pub).toEqual(pk)
    } finally {
      await sim.close()
    }
  })

})
