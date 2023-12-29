import { PokerCard } from '@/lib/domain/model/cards/card';
import { Straight } from '@/lib/domain/model/hands/straight';
import { HAND_RANK_SCALE, PokerHandRank } from '@/lib/domain/model/hands/pokerHand';

describe('Straight class', () => {
  describe('Straight.isHand', () => {
    const testCases = [
      {
        name: '4枚以下の場合はストレートではない',
        input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C'),
        expected: false,
      },
      {
        name: 'A,2,3,4,5 should be straight',
        input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', '5S'),
        expected: true,
      },
      {
        name: '2,3,4,5,6 should be straight',
        input: PokerCard.NewPokerCards('2S', '3D', '4H', '5C', '6S'),
        expected: true,
      },
      {
        name: '2,3,4,5,6 of Hearts should be straight',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
        expected: true,
      },
      {
        name: '3,4,5,6,8 should not be straight',
        input: PokerCard.NewPokerCards('3S', '4D', '5H', '6C', '8S'),
        expected: false,
      },
      {
        name: '10,J,Q,K,A of mixed suits should be straight',
        input: PokerCard.NewPokerCards('0S', 'JD', 'QH', 'KC', 'AS'),
        expected: true,
      },
      {
        name: '10,J,Q,K,A of Spades should be straight',
        input: PokerCard.NewPokerCards('0S', 'JS', 'QS', 'KS', 'AS'),
        expected: true,
      },
      {
        name: '10,6,8,9,7 not in order should be straight',
        input: PokerCard.NewPokerCards('0S', '6D', '8H', '9C', '7S'),
        expected: true,
      },
      {
        name: '4,7,6,8,5,1 (6 cards with duplication) should be straight',
        input: PokerCard.NewPokerCards('4S', '7D', '6H', '8C', '5S', 'AS'),
        expected: true,
      },
      {
        name: 'Q,8,9,8,8,10,J (7 cards with duplication) should be straight',
        input: PokerCard.NewPokerCards('QS', '8D', '9H', '8C', '8S', '0H', 'JS'),
        expected: true,
      },
      {
        name: 'Q,8,10,8,8,10,J (7 cards with duplication) should not be straight',
        input: PokerCard.NewPokerCards('QS', '8D', '0H', '8C', '8S', '0D', 'JS'),
        expected: false,
      },
      {
        name: '2,3,4,5,6,7,8 should be a straight as it contains a sequence of 5 cards',
        input: PokerCard.NewPokerCards('2S', '3D', '4H', '5C', '6S', '7D', '8H'),
        expected: true,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      test(name, () => {
        expect(Straight.isHand(input)).toBe(expected);
      });
    });
  });

  describe('isDraw', () => {
    const testCases = [
      {
        name: '4 cards are given',
        input: PokerCard.NewPokerCards('AH', '2D', '4S', '5C'),
        expected: false,
      },
      {
        name: 'valid 5 cards are given',
        input: PokerCard.NewPokerCards('AH', '2D', '3S', '4C', '5H'),
        expected: true,
      },
      {
        name: 'valid 6 cards are given',
        input: PokerCard.NewPokerCards('AH', '2D', '3S', '4C', '5H', '6S'),
        expected: true,
      },
      {
        name: '7 cards are given',
        input: PokerCard.NewPokerCards('AH', '2D', '3S', '4C', '5H', '6S', '7D'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Straight.isDraw(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Straight.isMissingConsecutive ', () => {
    const testCases = [
      {
        name: '4 cards are given, but one is missing for consecutive',
        input: PokerCard.NewPokerCards('AS', '2D', '4S', '5H'),
        expected: false,
      },
      {
        name: 'valid 5 cards are given, but one is missing for consecutive',
        input: PokerCard.NewPokerCards('2S', '3D', '5S', '6H', '0C'),
        expected: true,
      },
      {
        name: '5 cards are given, but two are missing for consecutive',
        input: PokerCard.NewPokerCards('2S', '3D', '6S', '7H', '8C'),
        expected: false,
      },
      {
        name: 'valid 6 cards are given, but one is missing for consecutive',
        input: PokerCard.NewPokerCards('2S', '3D', '5S', '6H', '9C', '0D'),
        expected: true,
      },
      {
        name: '6 cards are given, but two are missing for consecutive',
        input: PokerCard.NewPokerCards('2S', '3D', '6S', '7H', '8C', '9D'),
        expected: false,
      },
      {
        name: '7 cards are given, but one is missing for consecutive',
        input: PokerCard.NewPokerCards('2S', '3D', '5S', '6H', '7C', '8D', '9H'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Straight.isMissingConsecutive(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isAceToFiveStraight method', () => {
    const testCases = [
      {
        name: '5 cards from Ace to 5',
        input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', '5S'),
        expected: true,
      },
      {
        name: '5 cards in (A,2,3,4,5), but not straight',
        input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', 'AD'),
        expected: false,
      },
      {
        name: '6 cards from Ace to 6',
        input: PokerCard.NewPokerCards('AS', '2D', '3H', '4C', '5S', '6H'),
        expected: true,
      },
      {
        name: '5 cards from 2 to 6',
        input: PokerCard.NewPokerCards('2D', '3H', '4C', '5S', '6H'),
        expected: false,
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      test(name, () => {
        const result = Straight.isAceToFiveStraight(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isConsecutive method', () => {
    const cases = [
      {
        name: '4 cards, consecutive numbers',
        input: PokerCard.NewPokerCards('4D', '5S', '6H', '7C'),
        startIndex: 0,
        length: 4,
        expected: true,
      },
      {
        name: '4 cards, non-consecutive numbers',
        input: PokerCard.NewPokerCards('4D', '6S', '7H', '8C'),
        startIndex: 0,
        length: 4,
        expected: false,
      },
      {
        name: '5 cards, consecutive numbers at start',
        input: PokerCard.NewPokerCards('2D', '3S', '4H', '5C', '7S'),
        startIndex: 0,
        length: 4,
        expected: true,
      },
      {
        name: '5 cards, consecutive numbers at end',
        input: PokerCard.NewPokerCards('3D', '5S', '6H', '7C', '8S'),
        startIndex: 1,
        length: 4,
        expected: true,
      },
      {
        name: '5 cards, all non-consecutive',
        input: PokerCard.NewPokerCards('2D', '4S', '6H', '8C', '0S'),
        startIndex: 0,
        length: 4,
        expected: false,
      },
      {
        name: '6 cards, consecutive numbers in the middle',
        input: PokerCard.NewPokerCards('2D', '4S', '5H', '6C', '7S', '9H'),
        startIndex: 1,
        length: 4,
        expected: true,
      },
      {
        name: '7 cards, consecutive numbers at start',
        input: PokerCard.NewPokerCards('2D', '3S', '4H', '5C', '7S', '9H', '0C'),
        startIndex: 0,
        length: 4,
        expected: true,
      },
      {
        name: "7 cards, contains pairs, but it's straight",
        input: PokerCard.NewPokerCards('7S', '8H', '9S', '0H', '0D', 'JC', 'KC'),
        startIndex: 0,
        length: 5,
        expected: true,
      },
      {
        name: '7 cards, all non-consecutive',
        input: PokerCard.NewPokerCards('2D', '4S', '6H', '8C', '0S', '0D', 'QC'),
        startIndex: 0,
        length: 4,
        expected: false,
      },
    ];

    cases.forEach((test) => {
      it(test.name, () => {
        const result = Straight.isConsecutive(test.input, test.startIndex, test.length);
        expect(result).toBe(test.expected);
      });
    });
  });

  describe('.find', () => {
    const testCases = [
      {
        name: '5 cards, straight present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '5 cards, no straight',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '6H', '7H'),
        expected: [],
      },
      {
        name: '6 cards, straight present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '6 cards, no straight',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '7H', '8H'),
        expected: [],
      },
      {
        name: '7 cards, straight present',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '8H', '9H'),
        expected: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H'),
      },
      {
        name: '7cards, includes low straight and high straight, must find high straight',
        input: PokerCard.NewPokerCards('2H', '3H', '4H', '5H', '6H', '7H', '8H'),
        expected: PokerCard.NewPokerCards('4H', '5H', '6H', '7H', '8H'),
      },
      {
        name: "7 cards, contains pairs, but it's straight",
        input: PokerCard.NewPokerCards('7S', 'KC', 'JC', '8H', '9S', '0H', '0D'),
        expected: PokerCard.NewPokerCards('7S', '8H', '9S', '0H', 'JC'),
      },
      {
        name: '5 cards 5 high straight present',
        input: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', 'AD'),
        expected: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', 'AD'),
      },
      {
        name: "6 cards 5 high straight present, Ace can't be used as 1",
        input: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', 'AD', '6H'),
        expected: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '6H'),
      },
      {
        name: '7 cards, no straight',
        input: PokerCard.NewPokerCards('9H', '9D', 'AC', 'AD', '2S', '3D', '4D'),
        expected: [],
      },
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = Straight.find(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('.calculateScore', () => {
    const testCases = [
      {
        name: 'Regular straight',
        cards: PokerCard.NewPokerCards('6H', '7D', '8S', '9C', '0D'),
        expectedScore: PokerHandRank.STRAIGHT * HAND_RANK_SCALE + 10,
      },
      {
        name: 'Ace high straight',
        cards: PokerCard.NewPokerCards('0H', 'JD', 'QS', 'KC', 'AD'),
        expectedScore: PokerHandRank.STRAIGHT * HAND_RANK_SCALE + 14,
      },
      {
        name: 'Ace to five straight',
        cards: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', 'AD'),
        expectedScore: PokerHandRank.STRAIGHT * HAND_RANK_SCALE + 5,
      },
      // 他のテストケースを追加
    ];

    testCases.forEach(({ name, cards, expectedScore }) => {
      it(name, () => {
        const score = new Straight().calculateScore(cards);
        expect(score).toBe(expectedScore);
      });
    });
  });
});
