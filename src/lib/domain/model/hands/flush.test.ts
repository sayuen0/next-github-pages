import { PokerCard } from '@/lib/domain/model/cards/card';
import { Flush } from '@/lib/domain/model/hands/flush';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/hands';

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
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0S', '9D'),
        expected: false,
      },
      {
        name: 'Not a Flush with 7 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0C', '9C', '8S'),
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
        expected: true,
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
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0H'),
        expected: false,
      },
      {
        name: 'Not a flush draw with 6 cards',
        input: PokerCard.NewPokerCards('AS', 'KS', 'QD', 'JS', '0D', '9D'),
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

  describe('.find', () => {
    const testCases = [
      {
        name: '5 cards, flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '5 cards, no flush',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6D'),
        expected: [],
      },
      {
        name: '6 cards, flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8D'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '7 cards, flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8H', '9H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8H', '9H'),
      },
      {
        name: '7 cards, only one suit present but not 5 cards',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5D', '6D', '8D', '9D'),
        expected: [],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Flush.find(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('.calculateScore', () => {
    const testCases = [
      {
        name: 'Regular flush',
        cards: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H'),
        expectedScore: PokerHandRank.FLUSH * HAND_RANK_SCALE + 10,
      },
      {
        name: 'Ace high flush',
        cards: PokerCard.NewPokerCards('3H', '5H', '7H', '9H', 'AH'),
        expectedScore: PokerHandRank.FLUSH * HAND_RANK_SCALE + 14,
      },
      {
        name: 'Flush with low cards',
        cards: PokerCard.NewPokerCards('2D', '3D', '4D', '5D', '6D'),
        expectedScore: PokerHandRank.FLUSH * HAND_RANK_SCALE + 6,
      },
      {
        name: 'Flush with Ace can be used as 14',
        cards: PokerCard.NewPokerCards('2D', '3D', '4D', '5D', 'AD'),
        expectedScore: PokerHandRank.FLUSH * HAND_RANK_SCALE + 14,
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const score = Flush.calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
