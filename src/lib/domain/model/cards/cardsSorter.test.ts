import { PokerCard } from '@/lib/domain/model/cards/card';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

describe('CardsSorter', () => {
  describe('byNumber', () => {
    type TestCase = {
      name: string;
      input: PokerCard[];
      expected: PokerCard[];
      order?: 'asc' | 'desc';
    };

    const testCases: TestCase[] = [
      {
        name: '3 cards in ascending order',
        input: [...PokerCard.NewPokerCards('5H', '2D', 'JS')],
        expected: [...PokerCard.NewPokerCards('2D', '5H', 'JS')],
      },
      {
        name: '3 cards in descending order',
        input: [...PokerCard.NewPokerCards('5H', '2D', 'JS')],
        expected: [...PokerCard.NewPokerCards('JS', '5H', '2D')],
        order: 'desc',
      },
      {
        name: '5 cards descending',
        input: [...PokerCard.NewPokerCards('5H', '2D', 'JS', 'AC', '9C')],
        order: 'desc',
        expected: [...PokerCard.NewPokerCards('AC', 'JS', '9C', '5H', '2D')],
      },
      {
        name: '5 cards ascending',
        input: [...PokerCard.NewPokerCards('5H', '2D', 'JS', 'AC', '9C')],
        order: 'asc',
        expected: [...PokerCard.NewPokerCards('2D', '5H', '9C', 'JS', 'AC')],
      },
      {
        name: '6 cards ascending',
        input: [...PokerCard.NewPokerCards('KH', '3D', '9C', 'AC', '5H', '7S')],
        order: 'asc',
        expected: [...PokerCard.NewPokerCards('3D', '5H', '7S', '9C', 'KH', 'AC')],
      },
      {
        name: '6 cards descending',
        input: [...PokerCard.NewPokerCards('KH', '3D', '9C', 'AC', '5H', '7S')],
        order: 'desc',
        expected: [...PokerCard.NewPokerCards('AC', 'KH', '9C', '7S', '5H', '3D')],
      },
      {
        name: '7 cards in ascending order',
        input: [...PokerCard.NewPokerCards('KH', '3D', 'AS', '2S', '7D', '8H', '0D')],
        expected: [...PokerCard.NewPokerCards('2S', '3D', '7D', '8H', '0D', 'KH', 'AS')],
      },
    ];

    testCases.forEach(({ name, input, expected, order }) => {
      test(name, () => {
        const result = CardsSorter.byNumber(input, order);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('bySuits', () => {
    const testCases = [
      {
        name: 'should sort 3 cards by suits',
        input: PokerCard.NewPokerCards('2H', '3D', '4S'),
        expected: PokerCard.NewPokerCards('4S', '2H', '3D'),
      },
      {
        name: 'should sort 5 cards by suits',
        input: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '6D'),
        expected: PokerCard.NewPokerCards('3D', '6D', '4S', '2H', '5C'),
      },
      {
        name: 'should sort 6 cards by suits',
        input: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '6D', '7S'),
        expected: PokerCard.NewPokerCards('4S', '7S', '3D', '6D', '2H', '5C'),
      },
      {
        name: 'should prioritize diamond flush among 6 cards and the last one as spade',
        input: [...PokerCard.NewPokerCards('2D', '3D', '4D', '5D', '6D', '7D', 'AS')],
        expected: PokerCard.NewPokerCards('2D', '3D', '4D', '5D', '6D', '7D', 'AS'),
      },

      {
        name: 'should sort 7 cards by suits',
        input: [...PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '6D', '7S', '8H')],
        expected: [...PokerCard.NewPokerCards('4S', '7S', '2H', '8H', '3D', '6D', '5C')],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      test(name, () => {
        const result = CardsSorter.bySuits(input);
        expect(result).toEqual(expected);
      });
    });
  });
});
