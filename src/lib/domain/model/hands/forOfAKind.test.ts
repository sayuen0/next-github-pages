import { PokerCard } from '@/lib/domain/model/cards/card';
import { FourOfAKind } from '@/lib/domain/model/hands/forOfAKind';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/hands';

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

  describe('.calculateScore', () => {
    const testCases = [
      {
        name: 'Four of a Kind with high kicker',
        cards: PokerCard.NewPokerCards('AH', 'AD', 'AC', 'AS', 'KD'),
        expectedScore: PokerHandRank.FOUR_OF_A_KIND * HAND_RANK_SCALE + 14 * 100 + 13,
      },
      {
        name: 'Four of a Kind with low kicker',
        cards: PokerCard.NewPokerCards('2H', '2D', '2C', '2S', '3D'),
        expectedScore: PokerHandRank.FOUR_OF_A_KIND * HAND_RANK_SCALE + 2 * 100 + 3,
      },
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const score = FourOfAKind.calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
