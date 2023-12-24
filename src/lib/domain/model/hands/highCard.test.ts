import { HighCard } from '@/lib/domain/model/hands/highCard';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/hands';

describe('HighCard class', () => {
  const testCases = [
    {
      name: 'Simple high card',
      cards: PokerCard.NewPokerCards('2H', '3D', '5S', '9C', 'KD'),
      expectedScore:
        PokerHandRank.HIGH_CARD * HAND_RANK_SCALE +
        13 * 100_000_000 +
        9 * 1_000_000 +
        5 * 10_000 +
        3 * 100 +
        2,
    },
    {
      name: 'High card with Ace',
      cards: PokerCard.NewPokerCards('AH', '3D', '5S', '9C', 'KD'),
      expectedScore:
        PokerHandRank.HIGH_CARD * HAND_RANK_SCALE +
        14 * 100_000_000 +
        13 * 1_000_000 +
        9 * 10_000 +
        5 * 100 +
        3,
    },
    // 他のテストケースを追加
  ];

  testCases.forEach(({ name, cards, expectedScore }) => {
    it(name, () => {
      const score = HighCard.calculateScore(cards);
      expect(score).toBe(expectedScore);
    });
  });
});
