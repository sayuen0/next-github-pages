import { PokerCard } from '@/lib/domain/model/card';
import { FourOfAKind } from '@/lib/domain/model/hands/forOfAKind';

describe('FourOfAKind class', () => {
  const testCases = [
    {
      name: 'Four of a Kind',
      input: PokerCard.NewPokerCards('AS', 'AD', 'AH', 'AC', '7S'),
      expected: true,
    },
    {
      name: 'Three of a Kind',
      input: PokerCard.NewPokerCards('AS', 'AD', 'AH', 'KC', '7S'),
      expected: false,
    },
    {
      name: 'Two Pair',
      input: PokerCard.NewPokerCards('AS', 'AD', 'KH', 'KC', '7S'),
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
      const result = FourOfAKind.isHand(input);
      expect(result).toBe(expected);
    });
  });
});
