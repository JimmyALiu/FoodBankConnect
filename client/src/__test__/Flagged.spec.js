import { expect, test } from 'vitest'
import { findDuplicates } from '../utils/utils'
import { FBMGuest } from "../../../server/routes/helper";


test('findDuplicates flags exact duplicates', () => {
    const clients = [
      { firstname: "John", lastname: "Doe", street_address: "123 Main", city: "A", state: "X" },
      { firstname: "Jim", lastname: "Bob", street_address: "123 Ave", city: "B", state: "Y" },
      { firstname: "John", lastname: "Doe", street_address: "123 Main", city: "A", state: "X" }
    ]
  
    const result = findDuplicates(clients)
    expect(result).toStrictEqual([
      { firstname: "John", lastname: "Doe", street_address: "123 Main", city: "A", state: "X", notes: "Duplicate Entry" },
    ])
})