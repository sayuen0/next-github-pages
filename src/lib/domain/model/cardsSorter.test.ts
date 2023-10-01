import { PokerCard } from '@/lib/domain/model/card';
import { CardsSorter } from '@/lib/domain/model/cardsSorter';

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
        input: [...PokerCard.NewPocketCards('5H', '2D', 'JS')],
        expected: [...PokerCard.NewPocketCards('2D', '5H', 'JS')],
      },
      {
        name: '3 cards in descending order',
        input: [...PokerCard.NewPocketCards('5H', '2D', 'JS')],
        expected: [...PokerCard.NewPocketCards('JS', '5H', '2D')],
        order: 'desc',
      },
      {
        name: '5 cards descending',
        input: [...PokerCard.NewPocketCards('5H', '2D', 'JS', 'AC', '9C')],
        order: 'desc',
        expected: [...PokerCard.NewPocketCards('AC', 'JS', '9C', '5H', '2D')],
      },
      {
        name: '5 cards ascending',
        input: [...PokerCard.NewPocketCards('5H', '2D', 'JS', 'AC', '9C')],
        order: 'asc',
        expected: [...PokerCard.NewPocketCards('2D', '5H', '9C', 'JS', 'AC')],
      },
      {
        name: '6 cards ascending',
        input: [...PokerCard.NewPocketCards('KH', '3D', '9C', 'AC', '5H', '7S')],
        order: 'asc',
        expected: [...PokerCard.NewPocketCards('3D', '5H', '7S', '9C', 'KH', 'AC')],
      },
      {
        name: '6 cards descending',
        input: [...PokerCard.NewPocketCards('KH', '3D', '9C', 'AC', '5H', '7S')],
        order: 'desc',
        expected: [...PokerCard.NewPocketCards('AC', 'KH', '9C', '7S', '5H', '3D')],
      },
      {
        name: '7 cards in ascending order',
        input: [...PokerCard.NewPocketCards('KH', '3D', 'AS', '2S', '7D', '8H', '0D')],
        expected: [...PokerCard.NewPocketCards('2S', '3D', '7D', '8H', '0D', 'KH', 'AS')],
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
        input: PokerCard.NewPocketCards('2H', '3D', '4S'),
        expected: PokerCard.NewPocketCards('4S', '2H', '3D'),
      },
      {
        name: 'should sort 5 cards by suits',
        input: PokerCard.NewPocketCards('2H', '3D', '4S', '5C', '6D'),
        expected: PokerCard.NewPocketCards('3D', '6D', '4S', '2H', '5C'),
      },
      {
        name: 'should sort 6 cards by suits',
        input: PokerCard.NewPocketCards('2H', '3D', '4S', '5C', '6D', '7S'),
        expected: PokerCard.NewPocketCards('4S', '7S', '3D', '6D', '2H', '5C'),
      },
      {
        name: 'should prioritize diamond flush among 6 cards and the last one as spade',
        input: [...PokerCard.NewPocketCards('2D', '3D', '4D', '5D', '6D', '7D', 'AS')],
        expected: PokerCard.NewPocketCards('2D', '3D', '4D', '5D', '6D', '7D', 'AS'),
      },

      {
        name: 'should sort 7 cards by suits',
        input: [...PokerCard.NewPocketCards('2H', '3D', '4S', '5C', '6D', '7S', '8H')],
        expected: [...PokerCard.NewPocketCards('4S', '7S', '2H', '8H', '3D', '6D', '5C')],
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
