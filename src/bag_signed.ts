import { MD5 } from 'crypto-js'
import { Bag } from './bag'
import { Invalid_signature } from './error/invalid_signature/index'

export class Bag_signed extends Bag {
  /**
   * Verify bag signature with API key and secret
   * @param key - API key
   * @param secret - API secret
   */
  signature_verify(key: string, secret: string = ''): true {
    const ruler = this.signature_generate(key, secret)
    const signature = this.meta.signature

    if (ruler !== signature) {
      throw new Invalid_signature()
    }

    return true
  }

  /**
   * Only generate but not store signature
   * @param key
   * @param secret
   */
  signature_generate(key: string, secret: string = ''): string {
    const json_part = this.get_ordered_sign_json()
    const key_part = key ? (key + secret + this.meta.timestamp) : ''
    const hash = MD5(json_part + key_part).toString()
    return hash
  }

  /**
   * Generate and store signature
   * @param key
   * @param secret
   */
  sign(key: string, secret: string = ''): void {
    this.meta.signature = this.signature_generate(key, secret)
  }

  get_ordered_sign_json(): string {
    const map = { ...this.payload }
    return JSON.stringify(map, Object.keys(map).sort())
  }
}
