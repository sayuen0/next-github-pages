import { PokerCard } from '@/lib/domain/model/cards/card';
import { OnePair } from '@/lib/domain/model/hands/onePair';

describe('.PokerHand Class', () => {
  describe('.findPairs', () => {
    const testCases = [
      {
        name: 'Pocket pair, is a one pair',
        input: PokerCard.NewPokerCards('2H', '2D'),
        expected: new Set([2]),
      },
      {
        name: '5 cards, is a one pair',
        input: PokerCard.NewPokerCards('2H', '5D', '8S', 'QS', 'QD'),
        expected: new Set([12]),
      },
      {
        name: '5 cards, no pair',
        input: PokerCard.NewPokerCards('2H', '5D', '8S', 'QS', 'JD'),
        expected: new Set([]),
      },
      {
        name: '6 cards, multiple pairs',
        input: PokerCard.NewPokerCards('2H', '2D', '5C', '5D', 'KS', 'KD'),
        expected: new Set([2, 5, 13]),
      },
      {
        name: '7 cards, one pair',
        input: PokerCard.NewPokerCards('2H', '5D', '5S', '6D', '8S', '9C', 'JD'),
        expected: new Set([5]),
      },
      {
        name: '7 cards, no pair',
        input: PokerCard.NewPokerCards('2H', '3D', '5S', '6C', '7H', '9D', 'JS'),
        expected: new Set([]),
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = OnePair.findPairs(input);
        expect(result).toEqual(expected);
      });
    });
  });
});
