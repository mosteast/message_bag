import { Invalid_bag_input } from '../index'

export class Invalid_json_argument extends Invalid_bag_input {
  constructor(input: string[] | string, solution = 'Instead of building JSON by hand, consider using a proper library to do it, like `JSON.stringify(value)`') {
    super(input)
  }
}
