import { HoleCards } from '@/lib/domain/model/game/texasHoldem/holeCards';
import { CardValue, PokerCard } from '@/lib/domain/model/cards/card';

describe('HoleCards', () => {
  describe('isPocketPair', () => {
    type TestCase = {
      input1: CardValue; // テストのための1枚目のカード
      input2: CardValue; // テストのための2枚目のカード
      expected: boolean; // 期待する結果
    };

    const testCases: TestCase[] = [
      { input1: 'AH', input2: 'AS', expected: true },
      { input1: '5H', input2: '5D', expected: true },
      { input1: 'KH', input2: 'KD', expected: true },
      { input1: 'AH', input2: 'KH', expected: false },
      { input1: '5H', input2: '6D', expected: false },
    ];

    testCases.forEach(({ input1, input2, expected }) => {
      test(`returns ${expected} when cards are ${input1} and ${input2}`, () => {
        const card1 = new PokerCard(input1);
        const card2 = new PokerCard(input2);
        const holeCards = new HoleCards(card1, card2);
        expect(holeCards.isPocketPair()).toBe(expected);
      });
    });
  });

  describe('isSuited', () => {
    type TestCase = {
      input1: CardValue; // テストのための1枚目のカード
      input2: CardValue; // テストのための2枚目のカード
      expected: boolean; // 期待する結果
    };

    const testCases: TestCase[] = [
      { input1: 'AH', input2: 'KH', expected: true },
      { input1: '5H', input2: '7H', expected: true },
      { input1: 'QH', input2: 'QH', expected: true }, // 同じカードでもスートが一致するのでtrue
      { input1: 'AD', input2: 'KH', expected: false },
      { input1: '5H', input2: '5D', expected: false },
    ];

    testCases.forEach(({ input1, input2, expected }) => {
      test(`returns ${expected} when cards are ${input1} and ${input2}`, () => {
        const card1 = new PokerCard(input1);
        const card2 = new PokerCard(input2);
        const holeCards = new HoleCards(card1, card2);
        expect(holeCards.isSuited()).toBe(expected);
      });
    });
  });
});
