import { Bag, T_purpose } from './bag'
import { Invalid_bag_input } from './error/invalid_bag_input/index'

it('should instantiate', async () => {
  const purpose: T_purpose = [ 'a', 'b' ]
  const bag = new Bag(purpose)
  expect(bag.purpose[0]).toBe(purpose[0])
  expect(bag.purpose[1]).toBe(purpose[1])
  expect(bag.ok).toBe(true)
  expect(bag.reply).toBe(false)
  expect(bag.payload).toBe(undefined)
  expect(typeof bag.meta?.timestamp).toBe('number')
})

it('should throw when purpose is invalid', async () => {
  expect(() => {
    // @ts-ignore
    new Bag([ 'a' ])
  }).toThrow(Invalid_bag_input)

  expect(() => {
    Bag.from({
      payload: [ 'a' ],
    })
  }).toThrow(Invalid_bag_input)

  expect(() => {
    Bag.from_json(`{
      "purpose": [ SOMETHING_WRONG ],
    }`)
  }).toThrow(Invalid_bag_input)

  expect(() => {
    Bag.from_json(`{
    "purpose": [ "a", "b" ]
    }`)
  }).not.toThrow()

})
