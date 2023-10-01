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
});
