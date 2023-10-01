import { PokerCard } from '@/lib/domain/model/card';
import { OnePair } from '@/lib/domain/model/hands/onePair';

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

  describe('.findSet', () => {
    const testCases = [
      {
        name: 'Pocket pair, is a pair',
        input: PokerCard.NewPokerCards('2H', '2D'),
        expected: new Set([2]),
      },
      {
        name: '5 cards, is a pair',
        input: PokerCard.NewPokerCards('2H', '5D', '8S', 'QS', 'QD'),
        expected: new Set([12]),
      },
      {
        name: '5 cards, no pair',
        input: PokerCard.NewPokerCards('2H', '5D', '8S', 'QS', 'JD'),
        expected: new Set([]),
      },
      {
        name: '6 cards, multiple pairs',
        input: PokerCard.NewPokerCards('2H', '2D', '5C', '5D', 'KS', 'KD'),
        expected: new Set([2, 5, 13]),
      },
      {
        name: '7 cards, one pair',
        input: PokerCard.NewPokerCards('2H', '5D', '5S', '6D', '8S', '9C', 'JD'),
        expected: new Set([5]),
      },
      {
        name: '7 cards, no pair',
        input: PokerCard.NewPokerCards('2H', '3D', '5S', '6C', '7H', '9D', 'JS'),
        expected: new Set([]),
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = OnePair.findSet(input);
        expect(result).toEqual(expected);
      });
    });
  });
});
