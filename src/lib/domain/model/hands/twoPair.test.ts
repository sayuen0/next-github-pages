import { PokerCard } from '@/lib/domain/model/cards/card';
import { TwoPair } from '@/lib/domain/model/hands/twoPair';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

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

  describe('.find', () => {
    const testCases = [
      {
        name: 'Should find two eights, two sevens and ace as a kicker',
        cards: PokerCard.NewPokerCards('8H', '8D', '7S', '7C', 'AH'),
        expected: PokerCard.NewPokerCards('8H', '8D', '7S', '7C', 'AH'),
      },
      {
        name: 'Should not find two pairs when not present',
        cards: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '6H'),
        expected: [],
      },
      // 追加のテストケースをここに記述
    ];

    testCases.forEach(({ name, cards, expected }) => {
      it(name, () => {
        const result = TwoPair.find(cards);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('calculateScore', () => {
    const testCases = [
      {
        name: 'Two Pair with high single card',
        cards: PokerCard.NewPokerCards('2H', '2D', '3S', '3C', 'KD'),
        expectedScore:
          PokerHandRank.TWO_PAIR * HAND_RANK_SCALE + 3 * 10_000 + 2 * 100 + 13,
      },
      {
        name: 'Two Pair with low single card',
        cards: PokerCard.NewPokerCards('4H', '4D', '5S', '5C', '2D'),
        expectedScore:
          PokerHandRank.TWO_PAIR * HAND_RANK_SCALE + 5 * 10_000 + 4 * 100 + 2,
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const score = new TwoPair().calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
