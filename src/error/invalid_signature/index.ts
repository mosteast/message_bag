import { E } from '@mosteast/base-error/build'

export class Invalid_signature extends E {
  constructor(input = 'Invalid signature in message bag', solution = 'Consider using `@mosteast/message_bag` to generate and verify bag signature') {
    super(input, solution)
  }
}
