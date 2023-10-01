import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';
import { Straight } from '@/lib/domain/model/hands/straight';
import { Flush } from '@/lib/domain/model/hands/flush';

export class StraightFlush extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT_FLUSH;

  static isHand(cards: PokerCard[]): boolean {
    // ストレートかつフラッシュであることを確認する
    return Straight.isHand(cards) && Flush.isHand(cards);
  }
}

describe('StraightFlush class', () => {
  const testCases = [
    {
      name: 'Straight Flush',
      input: PokerCard.NewPokerCards('2S', '3S', '4S', '5S', '6S'),
      expected: true,
    },
    {
      name: 'Not Straight',
      input: PokerCard.NewPokerCards('2S', '3S', '4S', '6S', '7S'),
      expected: false,
    },
    {
      name: 'Not Flush',
      input: PokerCard.NewPokerCards('2S', '3S', '4D', '5S', '6S'),
      expected: false,
    },
    {
      name: 'Neither Straight nor Flush',
      input: PokerCard.NewPokerCards('2S', '3S', '4D', '6S', '7S'),
      expected: false,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = StraightFlush.isHand(input);
      expect(result).toBe(expected);
    });
  });
});
