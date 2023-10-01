import { PokerCard } from '@/lib/domain/model/card';
import { FullHouse } from '@/lib/domain/model/hands/fullHouse';

describe('FullHouse class', () => {
  // isHandメソッドのテスト
  describe('.isHand', () => {
    const testCases = [
      {
        name: '5 cards, not a fullhouse',
        input: PokerCard.NewPokerCards('2H', '3D', '5C', '8S', 'JC'),
        expected: false,
      },
      {
        name: '5 cards, is a fullhouse',
        input: PokerCard.NewPokerCards('2H', '2D', '5C', '5D', '5S'),
        expected: true,
      },
      {
        name: '6 cards, not a fullhouse but a two pair',
        input: PokerCard.NewPokerCards('2H', '2D', '5C', '5D', '8S', 'JC'),
        expected: false,
      },
      {
        name: '6 cards, not a fullhouse but a three of a kind',
        input: PokerCard.NewPokerCards('2H', '2D', '2C', '5D', '8S', 'JC'),
        expected: false,
      },
      {
        name: '6 cards, is a fullhouse',
        input: PokerCard.NewPokerCards('2H', '2D', '5C', '5D', '5S', 'JC'),
        expected: true,
      },
      {
        name: '7 cards, not a fullhouse',
        input: PokerCard.NewPokerCards('2H', '3D', '4C', '6S', '7D', '9C', 'JS'),
        expected: false,
      },
      {
        name: '7 cards, is a fullhouse',
        input: PokerCard.NewPokerCards('2H', '2D', '4C', '4D', '4S', '8C', 'JS'),
        expected: true,
      },
      {
        name: '6 cards, two three of a kinds, is a fullhouse',
        input: PokerCard.NewPokerCards('2H', '2D', '2C', '3S', '3D', '3C'),
        expected: true,
      },
      {
        name: '7 cards, two three of a kinds, is a fullhouse',
        input: PokerCard.NewPokerCards('2H', '2D', '2C', '3S', '3D', '3C', 'KH'),
        expected: true,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = FullHouse.isHand(input);
        expect(result).toBe(expected);
      });
    });
  });

  // isDrawメソッドのテスト
  describe('.isDraw', () => {
    const testCases = [
      {
        name: 'Is a FullHouseDraw, Three of a kind',
        input: PokerCard.NewPokerCards('2H', '2D', '2C', '8S', 'JS'),
        expected: true,
      },
      {
        name: 'Is a FullHouseDraw, Two pairs',
        input: PokerCard.NewPokerCards('2H', '2D', '8C', '8S', 'JS'),
        expected: true,
      },
      {
        name: 'Is not a FullHouseDraw, One pair',
        input: PokerCard.NewPokerCards('2H', '2D', '4C', '8S', 'JS'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = FullHouse.isDraw(input);
        expect(result).toBe(expected);
      });
    });
  });
});
