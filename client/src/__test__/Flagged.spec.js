import { expect, test } from 'vitest'
import { findDuplicates } from '../utils/utils'


test('findDuplicates flags exact duplicates', () => {
    const clients = [
      { "First Name": "John", "Last Name": "Doe", Address: "123 Main", City: "A", State: "X" },
      { "First Name": "Jim", "Last Name": "Bob", Address: "123 Ave", City: "A", State: "X" },
      { "First Name": "John", "Last Name": "Doe", Address: "123 Main", City: "A", State: "X" }
    ]
  
    const result = findDuplicates(clients)
    expect(result).toStrictEqual([
      { "First Name": "John", "Last Name": "Doe", Address: "123 Main", City: "A", State: "X", Issue: "Duplicate Entry" },
    ])
})