import { PokerCard } from '@/lib/domain/model/card';
import { RoyalStraightFlush } from '@/lib/domain/model/hands/royalStraightFlush';

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
});
