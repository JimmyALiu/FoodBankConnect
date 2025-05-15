import {expect, test} from 'vitest'
import { demo_sum } from '../utils/utils.js'

test('demo_sum', () => {
  expect(demo_sum(1, 2)).toBe(3)
})
