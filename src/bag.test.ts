import { Bag, T_purpose } from './bag'
import { Bag_signed } from './bag_signed'
import { Invalid_bag_input } from './error/invalid_bag_input/index'
import { SHA256 } from 'crypto-js'

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

it('should verify bag signature', async () => {
  const bag1 = new Bag_signed([ 'a', 'b' ])
  const key1 = 'key1'
  const secret1 = 'secret1'
  bag1.sign(key1, secret1)
  expect(bag1.signature_generate(key1, secret1)).toBe(bag1.meta.signature)

  const bag2 = Bag_signed.from<Bag_signed>(bag1)
  expect(bag2.signature_verify(key1, secret1)).toBeTruthy()
})

it('identical bags should have identical signature', async () => {
  const bag1 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2 })
  const bag2 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2 })

  const key = 'a', secret = 'b'

  expect(bag1.signature_generate(key, secret)).toBe(bag2.signature_generate(key, secret))

  const bag3 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2 }, true)
  const bag4 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2 }, false)

  expect(bag3.signature_generate(key, secret)).toBe(bag4.signature_generate(key, secret))

  const bag5 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2 })
  const bag6 = new Bag_signed([ 'a', 'b' ], { a: 1, b: 2222 })

  console.log(bag5, bag6)

  expect(bag5.signature_generate(key, secret)).not.toBe(bag6.signature_generate(key, secret))
})

it('should respond', async () => {
  const b = new Bag('a/b', { data: 1 })
  b.reply_to('1b671a64-40d5-491e-99b0-da01ff1f3341')
  expect(b.reply).toBeTruthy()
})
