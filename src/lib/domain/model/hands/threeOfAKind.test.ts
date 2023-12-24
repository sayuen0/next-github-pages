import { PokerCard } from '@/lib/domain/model/cards/card';
import { ThreeOfAKind } from '@/lib/domain/model/hands/threeOfAKind';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

describe('ThreeOfAKind class', () => {
  const testCases = [
    {
      name: 'Three of a Kind',
      input: PokerCard.NewPokerCards('AS', 'AD', 'AH', 'KC', '7S'),
      expected: true,
    },
    {
      name: 'Four of a Kind',
      input: PokerCard.NewPokerCards('AS', 'AD', 'AH', 'AC', '7S'),
      expected: true,
    },
    {
      name: 'Two Pair',
      input: PokerCard.NewPokerCards('AS', 'AD', 'QH', 'QC', '7S'),
      expected: false,
    },
    {
      name: 'One Pair',
      input: PokerCard.NewPokerCards('AS', 'AD', 'KH', '7C', '5S'),
      expected: false,
    },
    {
      name: 'No Pair',
      input: PokerCard.NewPokerCards('AS', 'KD', 'JH', '7C', '5S'),
      expected: false,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = ThreeOfAKind.isHand(input);
      expect(result).toBe(expected);
    });
  });

  describe('.findSet', () => {
    const testCases = [
      {
        name: 'No set with 5 cards',
        input: PokerCard.NewPokerCards('4H', '5D', '6S', '8H', 'QS'),
        expected: new Set(),
      },
      {
        name: 'One set with 5 cards',
        input: PokerCard.NewPokerCards('4H', '4D', '4S', '8H', 'QS'),
        expected: new Set([4]),
      },
      {
        name: 'No set with 6 cards',
        input: PokerCard.NewPokerCards('2H', '3D', '5S', '6H', '8S', 'JC'),
        expected: new Set(),
      },
      {
        name: 'One set with 6 cards',
        input: PokerCard.NewPokerCards('4H', '4D', '4S', 'KH', 'QS', 'JD'),
        expected: new Set([4]),
      },
      {
        name: 'Two sets with 6 cards',
        input: PokerCard.NewPokerCards('4H', '4D', '4S', 'KH', 'KS', 'KC'),
        expected: new Set([4, 13]),
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = ThreeOfAKind.findSet(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('.find', () => {
    const testCases = [
      {
        name: 'Simple three of a kind',
        input: PokerCard.NewPokerCards('2H', '2D', '2S', '4C', '5H'),
        expected: PokerCard.NewPokerCards('2H', '2D', '2S', '5H', '4C'),
      },
      {
        name: 'Three of a kind with higher cards',
        input: PokerCard.NewPokerCards('9H', '9C', '9S', 'JH', 'QC', 'KH', '2S'),
        expected: PokerCard.NewPokerCards('9H', '9C', '9S', 'KH', 'QC'),
      },
      {
        name: 'Three of a kind with Ace',
        input: PokerCard.NewPokerCards('AH', 'AC', 'AD', '7D', '5S', '3H', '2C'),
        expected: PokerCard.NewPokerCards('AH', 'AC', 'AD', '7D', '5S'),
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = ThreeOfAKind.find(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('.calculateScore', () => {
    const testCases = [
      {
        name: 'Three of a Kind with high cards',
        cards: PokerCard.NewPokerCards('2H', '2D', '2S', '9C', 'KD'),
        expectedScore:
          PokerHandRank.THREE_OF_A_KIND * HAND_RANK_SCALE + 2 * 10_000 + 13 * 100 + 9,
      },
      {
        name: 'Three of a Kind with low cards',
        cards: PokerCard.NewPokerCards('4H', '4D', '4S', '2D', '3C'),
        expectedScore:
          PokerHandRank.THREE_OF_A_KIND * HAND_RANK_SCALE + 4 * 10_000 + 3 * 100 + 2,
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const hand = new ThreeOfAKind();
        const score = hand.calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
