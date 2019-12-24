import { E } from '@mosteast/base-error'

export class Invalid_bag_input extends E {
  constructor(invalid: string[] | string, solution = '', opt: { prefix?: string, suffix?: string } = {
    prefix: `Invalid arguments: `,
    suffix: '',
  }) {
    super()

    if (typeof invalid === 'string') {
      invalid = [ invalid ]
    }

    const esc = invalid.map(it => `{${it}}`)
    this.init(`${opt.prefix ?? ''}${esc.join(', ')}${opt.suffix ?? ''}`, solution)
    this.data = {
      invalid,
    }
  }
}
