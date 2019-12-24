import { E } from '@mosteast/base-error/build'
import { Fillable } from 'fillable'
import { v4 as uuid4 } from 'uuid'
import { Invalid_bag_input } from './error/invalid_bag_input/index'
import { Invalid_json_argument } from './error/invalid_bag_input/invalid_json_argument/index'

export type T_uuid = string

export type T_payload = any

export interface T_bag_meta {
  jwt?: string
  timestamp?: number
  signature?: string

  [key: string]: any
}

export type T_purpose = [ string, string ] | string

/**
 * Message bag (input or output) structure
 *
 * Every message should have this structure.
 */
export class Bag extends Fillable {
  /**
   * Message UUID
   */
  id: T_uuid

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
  purpose: T_purpose

  /**
   * Data it self
   *
   * You can think of it as purpose's arguments mostly.
   */
  payload?: T_payload

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
   * request should be false
   * response should have an indicate which bag to respond: '1b671a64-40d5-491e-99b0-da01ff1f3341'
   * @type {boolean}
   */
  reply: false | string = false

  constructor(purpose: T_purpose, payload?, ok: boolean = true, meta?) {
    super()
    if (typeof purpose == 'string') {
      purpose = <T_purpose>purpose.split('/')
    }

    if (purpose.length != 2) {
      throw new Invalid_bag_input([ 'purpose' ], '`purpose` should has 2 elements: `[target, action]`, example: `["user", "login"]`, `["order", "pay"]`')
    }

    this.id = uuid4()
    this.purpose = purpose
    this.payload = payload
    this.ok = ok
    this.meta = meta ?? {}

    if (!this.meta?.timestamp) {
      this.meta.timestamp = Date.now()
    }
  }

  reply_to(id: T_uuid) {
    this.reply = id
  }

  verify(): boolean {
    return true
  }

  /**
   * From bag-like object
   * @param bag
   */
  static from<T extends Bag>(bag: Bag | any): T {

    if (typeof bag !== 'object') {
      throw new Invalid_bag_input([ 'bag' ], '{bag} should be object-like: `{ "purpose": ... }`')
    }

    if (!bag.purpose) {
      throw new Invalid_bag_input([ 'purpose' ], `Example: ['user', 'login'] or ['order', 'pay']`)
    }

    const r = <T>new this(bag.purpose, bag.payload, bag.ok, bag.meta)
    r.error = bag.error
    r.status = bag.status
    return r
  }

  /**
   * From raw json string
   * @param json
   */
  static from_json<T extends Bag>(json: string): T {
    let bag!: Bag

    try {
      bag = JSON.parse(json)
    } catch (e) {
      if (e) {
        throw new Invalid_json_argument('json')
      }
    }

    return this.from<T>(bag)
  }
}

