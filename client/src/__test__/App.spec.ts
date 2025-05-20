import {expect, test} from 'vitest'
import { demo_sum, findDuplicates } from '../utils/utils.ts'

test('demo_sum', () => {
  expect(demo_sum(1, 2)).toBe(3)
})

test('findDuplicates', () => {
  const arr = [
    { "First Name": "John", "Last Name": "Doe", Address: "123 Main St", City: "Springfield", State: "IL" },
    { "First Name": "Jane", "Last Name": "Doe", Address: "456 Elm St", City: "Springfield", State: "IL" },
    { "First Name": "John", "Last Name": "Doe", Address: "123 Main St", City: "Springfield", State: "IL" },
    { "First Name": "Jane", "Last Name": "Doe", Address: "456 Elm St", City: "Springfield", State: "IL" }
  ]
  const result = findDuplicates(arr)
  expect(result).toEqual([
    {
      "First Name": "John",
      "Last Name": "Doe",
      "Address": "123 Main St",
      "City": "Springfield",
      "State": "IL",
      "Issue": "Duplicate Entry",
    },
    {
      "First Name": "Jane",
      "Last Name": "Doe",
      "Address": "456 Elm St",
      "City": "Springfield",
      "State": "IL",
      "Issue": "Duplicate Entry",
    },
  ])
})
