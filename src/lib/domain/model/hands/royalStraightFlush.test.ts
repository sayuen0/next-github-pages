import { PokerCard } from '@/lib/domain/model/cards/card';
import { RoyalStraightFlush } from '@/lib/domain/model/hands/royalStraightFlush';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

describe('RoyalStraightFlush class', () => {
  describe('.isHand', () => {
    const testCases = [
      {
        name: 'royal straight flush present',
        input: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH'),
        expected: true,
      },
      {
        name: 'straight flush, but not royal',
        input: PokerCard.NewPokerCards('9H', '0H', 'JH', 'QH', 'KH'),
        expected: false,
      },
      {
        name: 'royal straight, but not flush',
        input: PokerCard.NewPokerCards('0H', 'JS', 'QC', 'KD', 'AH'),
        expected: false,
      },
      {
        name: 'flush, but not straight',
        input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = RoyalStraightFlush.isHand(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('find', () => {
    const testCasesForFind = [
      {
        name: 'Royal Straight Flush',
        cards: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH'),
        expected: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH'),
      },
      // 他のスーツのテストケースも追加可能
    ];

    testCasesForFind.forEach(({ name, cards, expected }) => {
      it(name, () => {
        const result = RoyalStraightFlush.find(cards);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('calculateScore', () => {
    const testCasesForCalculateScore = [
      {
        name: 'Royal Straight Flush',
        cards: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH'),
        expectedScore: PokerHandRank.ROYAL_STRAIGHT_FLUSH * HAND_RANK_SCALE + 14,
      },
      // 他のスーツのテストケースも追加可能
    ];
    testCasesForCalculateScore.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const score = new RoyalStraightFlush().calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
