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
import { DEFAULT_OPTIONS, DEVICE_MODELS } from './common'


jest.setTimeout(120000)

describe('Standard', function () {
  // eslint-disable-next-line jest/expect-expect

  test.each(DEVICE_MODELS)('can start and stop container', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('main menu', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      expect(await sim.navigateAndCompareSnapshots('.', `${m.prefix.toLowerCase()}-mainmenu`, [1, 0, 0, 4, -5])).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('get app version', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())
      await app.initialize()
      const resp = app.getVersion()

      //console.log(resp)

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')
      expect(resp).toHaveProperty('test_mode')
      expect(resp).toHaveProperty('major')
      expect(resp).toHaveProperty('minor')
      expect(resp).toHaveProperty('patch')
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('get address', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      // Derivation path. First 3 items are automatically hardened!
      const path = [44, 60, 0, 0, 0]
      const resp = await app.getAddressAndPubKey(path, 'xpla')

      //console.log(resp)

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')

      expect(resp).toHaveProperty('bech32_address')
      expect(resp).toHaveProperty('compressed_pk')

      expect(resp.bech32_address).toEqual('xpla1jhj78sdamykdfgxpf33ysrd4seu5v2qasunq0j')
      expect(resp.compressed_pk.data.length).toEqual(33)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('show address', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      // Derivation path. First 3 items are automatically hardened!
      const path = [44, 60, 0, 0, 0]
      const respRequest = app.showAddressAndPubKey(path, 'xpla')
      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-show_address`)

      const resp = await respRequest
      //console.log(resp)

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')

      expect(resp).toHaveProperty('bech32_address')
      expect(resp).toHaveProperty('compressed_pk')

      expect(resp.bech32_address).toEqual('xpla1jhj78sdamykdfgxpf33ysrd4seu5v2qasunq0j')
      expect(resp.compressed_pk.data.length).toEqual(33)
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('show address HUGE', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      // Derivation path. First 3 items are automatically hardened!
      const path = [44, 60, 2147483647, 0, 4294967295]
      const resp = await app.showAddressAndPubKey(path, 'xpla')
      //console.log(resp)

      expect(resp.return_code).toEqual(0x6985)
      expect(resp.error_message).toEqual('Conditions not satisfied')
    } finally {
      await sim.close()
    }
  })

  test.each(DEVICE_MODELS)('show address HUGE Expert', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...DEFAULT_OPTIONS, model: m.name })
      const app = new XplaApp(sim.getTransport())

      // Activate expert mode
      await sim.clickRight()
      await sim.clickBoth()
      await sim.clickLeft()

      // Derivation path. First 3 items are automatically hardened!
      const path = [44, 60, 2147483647, 0, 4294967295]
      const respRequest = app.showAddressAndPubKey(path, 'xpla')

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-show_address_huge`)

      const resp = await respRequest
      //console.log(resp)

      expect(resp.return_code).toEqual(0x9000)
      expect(resp.error_message).toEqual('No errors')

      expect(resp).toHaveProperty('bech32_address')
      expect(resp).toHaveProperty('compressed_pk')

      expect(resp.bech32_address).toEqual('xpla1gtemugdhvt7jaa3zw34mtc74f07d3akhvqvwdd')
      expect(resp.compressed_pk.data.length).toEqual(33)
    } finally {
      await sim.close()
    }
  })

})
