const StorageAccessibleWrapper = artifacts.require('StorageAccessibleWrapper')
const ExternalStorageReader = artifacts.require('ExternalStorageReader')

const truffleAssert = require('truffle-assertions')

contract('StorageAccessible', () => {
  const fromHex = string => parseInt(string, 16)
  const keccak = numbers => web3.utils.soliditySha3(
    ...numbers.map(v => ({ type: 'uint256', value: v }))
  )

  describe('getStorageAt', async () => {
    it('can read statically sized words', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoo(42)

      assert.equal(42, await instance.getStorageAt(await instance.SLOT_FOO(), 1))
    })
    it('can read fields that are packed into single storage slot', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setBar(7)
      await instance.setBam(13)

      const data = await instance.getStorageAt(await instance.SLOT_BAR(), 1)

      assert.equal(7, fromHex(data.slice(34, 66)))
      assert.equal(13, fromHex(data.slice(18, 34)))
    })
    it('can read arrays in one go', async () => {
      const instance = await StorageAccessibleWrapper.new()
      const slot = await instance.SLOT_BAZ()
      await instance.setBaz([1, 2])

      const length = await instance.getStorageAt(slot, 1)
      assert.equal(fromHex(length), 2)

      const data = await instance.getStorageAt(keccak([slot]), length)
      assert.equal(1, fromHex(data.slice(2, 66)))
      assert.equal(2, fromHex(data.slice(66, 130)))
    })
    it('can read mappings', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setQuxKeyValue(42, 69)
      assert.equal(69, await instance.getStorageAt(keccak([42, await instance.SLOT_QUX()]), 1))
    })

    it('can read structs', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoobar(19, 21)

      const packed = await instance.getStorageAt(await instance.SLOT_FOOBAR(), 10)
      assert.equal(19, fromHex(packed.slice(2, 66)))
      assert.equal(21, fromHex(packed.slice(66, 130)))
    })
  })

  describe('simulateDelegatecall', async () => {
    it('can invoke a function in the context of a previously deployed contract', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoo(42)

      // Deploy and use reader contract to access foo
      const reader = await ExternalStorageReader.new()
      const getFooCall = reader.contract.methods.getFoo().encodeABI()
      const result = await instance.simulateDelegatecall.call(reader.address, getFooCall)
      assert.equal(42, fromHex(result))
    })

    it('can simulate a function with side effects (without executing)', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoo(42)

      // Deploy and use reader contract to simulate setting foo
      const reader = await ExternalStorageReader.new()
      const replaceFooCall = reader.contract.methods.setAndGetFoo(69).encodeABI()
      let result = await instance.simulateDelegatecall.call(reader.address, replaceFooCall)
      assert.equal(69, fromHex(result))

      // Make sure foo is not actually changed
      const getFooCall = reader.contract.methods.getFoo().encodeABI()
      result = await instance.simulateDelegatecall.call(reader.address, getFooCall)
      assert.equal(42, fromHex(result))
    })

    it('can simulate a function that reverts', async () => {
      const instance = await StorageAccessibleWrapper.new()

      const reader = await ExternalStorageReader.new()
      const doRevertCall = reader.contract.methods.doRevert().encodeABI()
      truffleAssert.reverts(instance.simulateDelegatecall.call(reader.address, doRevertCall))
    })

    it('allows detection of reverts when invoked from other smart contract', async () => {
      const instance = await StorageAccessibleWrapper.new()

      const reader = await ExternalStorageReader.new()
      truffleAssert.reverts(reader.invokeDoRevertViaStorageAccessible(instance.address))
    })
  })

  describe('simulateStaticDelegatecall', () => {
    it('can be called from a static context', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoo(42)

      const reader = await ExternalStorageReader.new()
      const getFooCall = reader.contract.methods.getFoo().encodeABI()
      // invokeStaticDelegatecall is marked as view
      const result = await reader.invokeStaticDelegatecall(instance.address, getFooCall)
      assert.equal(42, result)
    })

    it('cannot simulate state changes', async () => {
      const instance = await StorageAccessibleWrapper.new()
      await instance.setFoo(42)

      const reader = await ExternalStorageReader.new()
      const replaceFooCall = reader.contract.methods.setAndGetFoo(69).encodeABI()
      truffleAssert.reverts(reader.invokeStaticDelegatecall(reader.address, replaceFooCall))
    })
  })
})
