import { PokerCard } from '@/lib/domain/model/card';
import { Flush } from '@/lib/domain/model/hands/flush';

describe('Flush class', () => {
  // isHandメソッドのテスト
  describe('.isHand', () => {
    const testCases = [
      {
        name: 'Flush with 5 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S'),
        expected: true,
      },
      {
        name: 'Flush with 6 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S', '9S'),
        expected: true,
      },
      {
        name: 'Flush with 7 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S', '9S', '8S'),
        expected: true,
      },
      {
        name: 'Not a Flush with 5 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S'),
        expected: false,
      },
      {
        name: 'Not a Flush with 6 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S', '9S'),
        expected: false,
      },
      {
        name: 'Not a Flush with 7 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S', '9S', '8S'),
        expected: false,
      },
      {
        name: '7 cards with 5 of them being Flush',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S', '9D', '8D'),
        expected: true,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Flush.isHand(input);
        expect(result).toBe(expected);
      });
    });
  });

  // isDrawメソッドのテスト
  describe('.isDraw', () => {
    const testCases = [
      {
        name: 'Flush draw with 5 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0D'),
        expected: false,
      },
      {
        name: 'Flush draw with 6 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S', '9D'),
        expected: true,
      },
      {
        name: 'Flush draw with 7 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0S', '9S', '8D'),
        expected: false,
      },
      {
        name: 'Not a flush draw with 5 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S'),
        expected: false,
      },
      {
        name: 'Not a flush draw with 6 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S', '9D'),
        expected: false,
      },
      {
        name: 'Not a flush draw with 7 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S', '9S', '8D'),
        expected: false,
      },
      {
        name: '6 cards with 4 of them being Flush draw but not Flush',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QS', 'JS', '0D', '9D'),
        expected: true,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Flush.isDraw(input);
        expect(result).toBe(expected);
      });
    });
  });
});
