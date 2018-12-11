const { getParamFromTxEvent, assertRejects } = require('./utils')

const Thing = artifacts.require('Thing')
const ThingFactory = artifacts.require('ThingFactory')

contract('ThingFactory (ConstructedCloneFactory)', function(accounts) {
  let thingFactory

  before(async function() {
    thingFactory = await ThingFactory.new();
  })

  it('can create instances of Thing', async function() {
    assert(await thingFactory.createThing(43781478321,
      "0x4897325638912478239328626489216483217647238146321649321649321894"))
  })

  it('cannot create invalid instances of Thing', async function() {
    await assertRejects(thingFactory.createThing(0,
      "0x4897325638912478239328626489216483217647238146321649321649321894"))
  })

  describe('instance of Thing', function() {
    let thing

    before(async function() {
      thing = await getParamFromTxEvent(await thingFactory.createThing(43781478321, "0x4897325638912478239328626489216483217647238146321649321649321894"), 'thing', Thing);
    })

    it('can make weird stuff', async function() {
      const weirdStuff1 = await getParamFromTxEvent(await thing.makeWeirdStuff(0), 'weirdStuff');
      await thing.makeWeirdStuff(20);
      const weirdStuff3 = await getParamFromTxEvent(await thing.makeWeirdStuff(-20), 'weirdStuff');
      assert.equal(weirdStuff1, weirdStuff3);
    })
  })
})
