import { PokerCard } from '@/lib/domain/model/card';
import { StraightFlush } from '@/lib/domain/model/hands/straightFlush';

describe('StraightFlush class', () => {
  describe('isHand', () => {
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

  // isDrawメソッドのテスト
  describe('.isDraw', () => {
    const testCases = [
      {
        name: 'Straight Flush Draw with 5 cards',
        input: PokerCard.NewPokerCards('3S', '4S', '5S', '7S', '8H'),
        expected: true,
      },
      {
        name: 'Straight Flush Draw with 6 cards',
        input: PokerCard.NewPokerCards('3S', '4S', '5S', '7S', '8H', '0H'),
        expected: true,
      },
      {
        name: 'Not a Straight Flush Draw, different Straight Draw and Flush Draw',
        input: PokerCard.NewPokerCards('2S', '4S', '6S', '8S', '3H', '5H'),
        expected: false,
      },
      {
        name: 'Not a Straight Flush Draw with 5 cards',
        input: PokerCard.NewPokerCards('2S', '4S', '5S', '7S', '8H'),
        expected: false,
      },
      {
        name: 'Not a Straight Flush Draw with 6 cards',
        input: PokerCard.NewPokerCards('AS', '2S', '4S', '6S', '8S', '9H'),
        expected: false,
      },
      {
        name: 'Not a Straight Flush Draw with 7 cards',
        input: PokerCard.NewPokerCards('AS', '2S', '4S', '6S', '8S', '9H', 'KH'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = StraightFlush.isDraw(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('.find', () => {
    const testCases = [
      {
        name: '5 cards, straight flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '5 cards, no straight flush',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6D'),
        expected: [],
      },
      {
        name: '6 cards, straight flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8D'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '7 cards, straight flush present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8D', '9D'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '7 cards, only one suit present but not in sequence',
        input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H', 'QH', 'KH'),
        expected: [],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = StraightFlush.find(input);
        expect(result).toEqual(expected);
      });
    });
  });
});
