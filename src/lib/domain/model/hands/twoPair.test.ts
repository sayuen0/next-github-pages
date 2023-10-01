import { PokerCard } from '@/lib/domain/model/card';
import { TwoPair } from '@/lib/domain/model/hands/twoPair';

describe('TwoPair class', () => {
  const testCases = [
    {
      name: 'Two Pairs',
      input: PokerCard.NewPokerCards('AS', 'AD', 'KH', 'KC', '7S'),
      expected: true,
    },
    {
      name: 'Three Pairs',
      input: PokerCard.NewPokerCards('AS', 'AD', 'KH', 'KC', '7S', '7C'),
      expected: true,
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
      const result = TwoPair.isHand(input);
      expect(result).toBe(expected);
    });
  });
});
