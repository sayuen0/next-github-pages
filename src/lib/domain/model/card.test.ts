import {sanitizeCardValue} from "@/lib/domain/model/card";

describe('sanitizeCardValue', () => {
  type TestCase = {
    input: string;
    expected: string;
  };


  const sanitizeCardValueTestCases: TestCase[] = [
    { input: '10S', expected: '0S' },
    { input: '11S', expected: 'JS' },
    { input: '10S', expected: '0S' },
    { input: '11S', expected: 'JS' },
    { input: '12S', expected: 'QS' },
    { input: '13S', expected: 'KS' },
    { input: '10s', expected: '0S' },
    { input: '11s', expected: 'JS' },
    { input: '12s', expected: 'QS' },
    { input: '13s', expected: 'KS' },
    { input: '1S', expected: '1S' },
    { input: '1s', expected: '1S' },
    { input: 'AS', expected: 'AS' },
    { input: 'aS', expected: 'AS' },
    { input: '', expected: '' }
  ];

  test.each(sanitizeCardValueTestCases)('returns $expected when input is $input', (testCase) => {
    expect(sanitizeCardValue(testCase.input)).toBe(testCase.expected);
  });
});
