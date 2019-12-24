import { E } from '@mosteast/base-error/build'
import { Invalid_bag_input } from './error/invalid_bag_input/index'
import { Invalid_json_argument } from './error/invalid_bag_input/invalid_json_argument/index'

export interface T_bag_meta {
  jwt?: string
  timestamp?: number
}

export type T_purpose = [ string, string ]

/**
 * Message bag (input or output) structure
 *
 * Every message should have this structure.
 */
export class Bag {
  /**
   * What the other end want to do
   *
   * It's like route in http.
   * When replying a bag, the purpose should be the same,
   * only this.reply set to true
   *
   * @example ['user', 'signup'] // is like 'user/signup'
   * @example ['order', 'pay'] // is like 'order/pay'
   */
  purpose!: T_purpose

  /**
   * Data it self
   *
   * You can think of it as purpose's arguments mostly.
   */
  payload?: any

  /**
   * Overall status
   * @type {boolean}
   */
  ok: boolean = true

  /**
   * Status string
   *
   * Defined and complied with both ends.
   *
   * @example 'invalid_jwt'
   */
  status?: string

  /**
   * Data about data
   *
   * @example { timestamp: 15142344234, jwt: 'xxx' }
   */
  meta!: T_bag_meta

  /**
   * Error data if not ok.
   */
  private error!: E | Error | object

  /**
   * Whether a Bag is a reply bag, like http response
   *
   * request: false
   * response: true
   * @type {boolean}
   */
  reply: boolean = false

  constructor(purpose: T_purpose, payload?, ok: boolean = true, meta?) {
    if (purpose.length != 2) {
      throw new Invalid_bag_input([ 'purpose' ], '`purpose` should has 2 elements: `[target, action]`, example: `["user", "login"]`, `["order", "pay"]`')
    }

    this.purpose = purpose
    this.payload = payload
    this.ok = ok
    this.meta = meta ?? {}

    if (!this.meta?.timestamp) {
      this.meta.timestamp = Date.now()
    }
  }

  /**
   * From bag-like object
   * @param bag
   */
  static from(bag: Bag | any) {

    if (typeof bag !== 'object') {
      throw new Invalid_bag_input([ 'bag' ], '{bag} should be object-like: `{ "purpose": ... }`')
    }

    if (!bag.purpose) {
      throw new Invalid_bag_input([ 'purpose' ], `Example: ['user', 'login'] or ['order', 'pay']`)
    }

    const r = new Bag(bag.purpose, bag.payload, bag.ok, bag.meta)
    r.error = bag.error
    r.status = bag.status
    return r
  }

  /**
   * From raw json string
   * @param json
   */
  static from_json(json: string): Bag {
    let bag!: Bag

    try {
      bag = JSON.parse(json)
    } catch (e) {
      if (e) {
        throw new Invalid_json_argument('json')
      }
    }

    return Bag.from(bag)
  }
}

export class Bag_ask extends Bag {}

export class Bag_reply extends Bag {
  reply = true

  static from_raw(json: string): Bag {
    const ins = Bag.from_json(json)
    ins.reply = true
    return ins
  }

  static from(bag_like: Bag | any): Bag {
    const ins = Bag.from(bag_like)
    ins.reply = true
    return ins
  }
}
