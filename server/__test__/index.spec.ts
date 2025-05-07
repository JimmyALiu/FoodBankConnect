import { multiply } from '../index'

test('dummy test', () => {
    expect(true).toBe(true);
});
    
test('multiply two numbers correctly', () => {
    expect(multiply(3, 5)).toBe(15);
});