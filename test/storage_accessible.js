const StorageAccessibleWrapper = artifacts.require('StorageAccessibleWrapper')

contract('StorageAccessible', () => {
  const fromHex = string => parseInt(string, 16)
  const keccak = numbers => web3.utils.soliditySha3(
    ...numbers.map(v => ({ type: 'uint256', value: v }))
  )

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
