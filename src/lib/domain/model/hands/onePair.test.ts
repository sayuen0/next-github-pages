import { PokerCard } from '@/lib/domain/model/cards/card';
import { OnePair } from '@/lib/domain/model/hands/onePair';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

describe('OnePair class', () => {
  const testCases = [
    {
      name: 'High card (Not One Pair)',
      input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', '5S'),
      expected: false,
    },
    {
      name: 'Straight (No Pair)',
      input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', '5S', '6H'),
      expected: false,
    },
    {
      name: 'Flush (No Pair)',
      input: PokerCard.NewPokerCards('2S', '3S', '6S', '7S', '9S'),
      expected: false,
    },
    {
      name: 'One Pair',
      input: PokerCard.NewPokerCards('2S', '2D', '3H', '4C', '5S'),
      expected: true,
    },
    {
      name: 'Two Pair',
      input: PokerCard.NewPokerCards('2S', '2D', '3H', '3C', '5S'),
      expected: true,
    },
    {
      name: 'Three of a Kind',
      input: PokerCard.NewPokerCards('2S', '2D', '2H', '4C', '5S'),
      expected: true,
    },
    {
      name: 'Four of a Kind',
      input: PokerCard.NewPokerCards('2S', '2D', '2H', '2C', '5S'),
      expected: true,
    },
    {
      name: 'Full House',
      input: PokerCard.NewPokerCards('2S', '2D', '2H', '3C', '3S'),
      expected: true,
    },
    {
      name: 'Straight with a pair',
      input: PokerCard.NewPokerCards('AS', 'AD', '2D', '3H', '4C', '5S'),
      expected: true,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = OnePair.isHand(input);
      expect(result).toBe(expected);
    });
  });

  describe('.find', () => {
    describe('.find', () => {
      const testCases = [
        {
          name: 'Simple one pair',
          input: PokerCard.NewPokerCards('2H', '2D', '3S', '4C', '5H'),
          expected: PokerCard.NewPokerCards('2H', '2D', '5H', '4C', '3S'),
        },
        {
          name: 'One pair with higher cards',
          input: PokerCard.NewPokerCards('9H', '9C', 'JH', 'QC', 'KH', '2S', '3D'),
          expected: PokerCard.NewPokerCards('9H', '9C', 'KH', 'QC', 'JH'),
        },
        {
          name: 'One pair with Ace',
          input: PokerCard.NewPokerCards('AH', 'AC', '7D', '5S', '3H'),
          expected: PokerCard.NewPokerCards('AH', 'AC', '7D', '5S', '3H'),
        },
        // 他のテストケースを追加
      ];

      testCases.forEach(({ name, input, expected }) => {
        it(name, () => {
          const result = OnePair.find(input);
          expect(result).toEqual(expected);
        });
      });
    });
  });

  describe('.calculateScore', () => {
    const testCases = [
      {
        name: 'One pair with high cards',
        cards: PokerCard.NewPokerCards('2H', '2D', '5S', '9C', 'KD'),
        expectedScore:
          PokerHandRank.ONE_PAIR * HAND_RANK_SCALE +
          2 * 1_000_000 +
          13 * 10_000 +
          9 * 100 +
          5,
      },
      {
        name: 'One pair with Ace as high card',
        cards: PokerCard.NewPokerCards('AH', '2D', '2C', '9C', 'KD'),
        expectedScore:
          PokerHandRank.ONE_PAIR * HAND_RANK_SCALE +
          2 * 1_000_000 +
          14 * 10_000 +
          13 * 100 +
          9,
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const hand = new OnePair();
        const score = hand.calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
