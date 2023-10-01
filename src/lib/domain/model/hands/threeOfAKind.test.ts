import { PokerCard } from '@/lib/domain/model/card';
import { ThreeOfAKind } from '@/lib/domain/model/hands/threeOfAKind';

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
});
