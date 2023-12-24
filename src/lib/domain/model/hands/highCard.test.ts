import { HighCard } from '@/lib/domain/model/hands/highCard';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

describe('HighCard class', () => {
  describe('.find', () => {
    describe('.find', () => {
      const testCases = [
        {
          name: 'Simple high card',
          input: PokerCard.NewPokerCards('2H', '3D', '5S', '9C', 'KD', '6H', '8D'),
          expected: PokerCard.NewPokerCards('KD', '9C', '8D', '6H', '5S'),
        },
        {
          name: 'High card with Ace',
          input: PokerCard.NewPokerCards('AH', 'QD', 'JS', '0C', '7D', '4H', '3S'),
          expected: PokerCard.NewPokerCards('AH', 'QD', 'JS', '0C', '7D'),
        },
        // 他のテストケースを追加
      ];

      testCases.forEach(({ name, input, expected }) => {
        it(name, () => {
          const result = HighCard.find(input);
          expect(result).toEqual(expected);
        });
      });
    });
  });

  describe('.calculateScore', () => {
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
        const hand = new HighCard();
        const score = hand.calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
