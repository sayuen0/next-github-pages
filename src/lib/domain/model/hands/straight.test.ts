import { PokerCard } from '@/lib/domain/model/card';
import { Straight } from '@/lib/domain/model/hands/straight';

describe('Straight.isHand', () => {
  const testCases = [
    {
      name: '4枚以下の場合はストレートではない',
      input: PokerCard.NewPocketCards('AS', '2D', '3H', '4C'),
      expected: false,
    },
    {
      name: 'A,2,3,4,5 should be straight',
      input: PokerCard.NewPocketCards('AS', '2D', '3H', '4C', '5S'),
      expected: true,
    },
    {
      name: '2,3,4,5,6 should be straight',
      input: PokerCard.NewPocketCards('2S', '3D', '4H', '5C', '6S'),
      expected: true,
    },
    {
      name: '2,3,4,5,6 of Hearts should be straight',
      input: PokerCard.NewPocketCards('2H', '3H', '4H', '5H', '6H'),
      expected: true,
    },
    {
      name: '3,4,5,6,8 should not be straight',
      input: PokerCard.NewPocketCards('3S', '4D', '5H', '6C', '8S'),
      expected: false,
    },
    {
      name: '10,J,Q,K,A of mixed suits should be straight',
      input: PokerCard.NewPocketCards('0S', 'JD', 'QH', 'KC', 'AS'),
      expected: true,
    },
    {
      name: '10,J,Q,K,A of Spades should be straight',
      input: PokerCard.NewPocketCards('0S', 'JS', 'QS', 'KS', 'AS'),
      expected: true,
    },
    {
      name: '10,6,8,9,7 not in order should be straight',
      input: PokerCard.NewPocketCards('0S', '6D', '8H', '9C', '7S'),
      expected: true,
    },
    {
      name: '4,7,6,8,5,1 (6 cards with duplication) should be straight',
      input: PokerCard.NewPocketCards('4S', '7D', '6H', '8C', '5S', 'AS'),
      expected: true,
    },
    {
      name: 'Q,8,9,8,8,10,J (7 cards with duplication) should be straight',
      input: PokerCard.NewPocketCards('QS', '8D', '9H', '8C', '8S', '0H', 'JS'),
      expected: true,
    },
    {
      name: 'Q,8,10,8,8,10,J (7 cards with duplication) should not be straight',
      input: PokerCard.NewPocketCards('QS', '8D', '0H', '8C', '8S', '0D', 'JS'),
      expected: false,
    },
    {
      name: '2,3,4,5,6,7,8 should be a straight as it contains a sequence of 5 cards',
      input: PokerCard.NewPocketCards('2S', '3D', '4H', '5C', '6S', '7D', '8H'),
      expected: true,
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    test(name, () => {
      expect(Straight.isHand(input)).toBe(expected);
    });
  });
});
