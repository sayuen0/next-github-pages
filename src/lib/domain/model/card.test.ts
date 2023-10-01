import {
  assertValidCard,
  CardValue,
  PokerCard,
  sanitizeCardValue,
  Suit,
} from '@/lib/domain/model/card';

describe('PokerCard', () => {
  describe('cardNumber', () => {
    type CardNumberTestCase = {
      input: CardValue; // テストのためのカード
      expected: number; // 期待するカードの数値
    };

    const cardNumberTestCases: CardNumberTestCase[] = [
      { input: 'AH', expected: 14 },
      { input: 'JH', expected: 11 },
      { input: 'QD', expected: 12 },
      { input: 'KS', expected: 13 },
      { input: '0C', expected: 10 },
      { input: '9H', expected: 9 },
    ];

    cardNumberTestCases.forEach(({ input, expected }) => {
      test(`returns ${expected} when card is ${input}`, () => {
        const card = new PokerCard(input);
        expect(card.cardNumber).toBe(expected);
      });
    });
  });

  describe('suit', () => {
    type SuitTestCase = {
      input: CardValue; // テストのためのカード
      expected: Suit; // 期待するスート
    };

    const suitTestCases: SuitTestCase[] = [
      { input: 'AH', expected: Suit.Heart },
      { input: 'JD', expected: Suit.Diamond },
      { input: 'QS', expected: Suit.Spade },
      { input: 'KC', expected: Suit.Club },
    ];

    suitTestCases.forEach(({ input, expected }) => {
      test(`returns ${expected} when card is ${input}`, () => {
        const card = new PokerCard(input);
        expect(card.suit).toBe(expected);
      });
    });
  });
});

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
    { input: '', expected: '' },
  ];

  test.each(sanitizeCardValueTestCases)(
    'returns $expected when input is $input',
    (testCase) => {
      expect(sanitizeCardValue(testCase.input)).toBe(testCase.expected);
    },
  );
});

describe('assertValidCard', () => {
  type TestCase = {
    name: string;
    input: string;
    shouldThrow: boolean; // Expected error if input is invalid
    expected: string; // Expected return value if input is valid
  };
  const testCases: TestCase[] = [
    { name: '正常な入力', input: 'AH', shouldThrow: false, expected: 'AH' },
    { name: '正常な入力2', input: '2D', shouldThrow: false, expected: '2D' },
    { name: '正常な入力3', input: '10C', shouldThrow: false, expected: '0C' },
    { name: '数値オーバー', input: '14H', shouldThrow: true, expected: '' },
    { name: '数値のみ入力', input: '5', shouldThrow: true, expected: '' },
    { name: 'スーツのみ入力', input: 'D', shouldThrow: true, expected: '' },
    {
      name: '数値とスーツの順番が逆',
      input: 'S7',
      shouldThrow: true,
      expected: '',
    },
    { name: 'スペースを含む', input: 'A H', shouldThrow: true, expected: 'AH' },
    { name: '不正なスーツ', input: 'AP', shouldThrow: true, expected: '' },
    { name: '小文字', input: 'jc', shouldThrow: false, expected: 'JC' },
  ];
  testCases.forEach((tc) => {
    if (tc.shouldThrow) {
      test(`${tc.name}: throws error when input is "${tc.input}"`, () => {
        expect(() => assertValidCard(tc.input)).toThrow();
      });
    } else {
      test(`${tc.name}: returns "${tc.expected}" when input is "${tc.input}"`, () => {
        expect(assertValidCard(tc.input)).toBe(tc.expected);
      });
    }
  });
});
