import { HandEvaluator } from '@/lib/domain/model/hands/handEvaluator';
import { PokerCard } from '@/lib/domain/model/cards/card';

describe('HandEvaluator class', () => {
  describe('.evaluateHand', () => {
    describe('5枚のケース', () => {
      const testCases = [
        {
          name: 'Royal Straight Flush',
          input: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH'),
          expectedHand: 'RoyalStraightFlush',
        },
        {
          name: 'Straight Flush',
          input: PokerCard.NewPokerCards('9H', '0H', 'JH', 'QH', 'KH'),
          expectedHand: 'StraightFlush',
        },
        {
          name: 'Four of a Kind',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', '9C', 'AH'),
          expectedHand: 'FourOfAKind',
        },
        {
          name: 'Full House',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', 'AD'),
          expectedHand: 'FullHouse',
        },
        {
          name: 'Flush',
          input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H'),
          expectedHand: 'Flush',
        },
        {
          name: 'Straight',
          input: PokerCard.NewPokerCards('9H', '0D', 'JD', 'QH', 'KS'),
          expectedHand: 'Straight',
        },
        {
          name: 'Three of a Kind',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', '2D'),
          expectedHand: 'ThreeOfAKind',
        },
        {
          name: 'Two Pair',
          input: PokerCard.NewPokerCards('9H', '9D', 'AH', 'AD', '2S'),
          expectedHand: 'TwoPair',
        },
        {
          name: 'One Pair',
          input: PokerCard.NewPokerCards('9H', '9D', 'AH', '3D', '2S'),
          expectedHand: 'OnePair',
        },
        {
          name: 'High Card',
          input: PokerCard.NewPokerCards('9H', '8D', '7S', '5H', '3D'),
          expectedHand: 'HighCard',
        },
      ];

      testCases.forEach(({ name, input, expectedHand }) => {
        it(name, () => {
          const result = HandEvaluator.evaluateHand(input);
          const className = (result.hand as any).name;
          expect(className).toEqual(expectedHand);
          // オプション: さらに、result.cards が期待されるカードセットを含んでいることを検証
        });
      });
    });
    describe('6枚のケース', () => {
      const testCases = [
        {
          name: 'Royal Straight Flush with extra card',
          input: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH', '2D'),
          expectedHand: 'RoyalStraightFlush',
        },
        {
          name: 'Straight Flush with extra card',
          input: PokerCard.NewPokerCards('9H', '0H', 'JH', 'QH', 'KH', '2D'),
          expectedHand: 'StraightFlush',
        },
        {
          name: 'Four of a Kind with extra pair',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', '9C', 'AH', 'AD'),
          expectedHand: 'FourOfAKind',
        },
        {
          name: 'Full House with extra card',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', 'AD', '2D'),
          expectedHand: 'FullHouse',
        },
        {
          name: 'Flush with extra card',
          input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H', '2D'),
          expectedHand: 'Flush',
        },
        {
          name: 'Straight with extra card',
          input: PokerCard.NewPokerCards('9H', '0D', 'JD', 'QH', 'KS', '2D'),
          expectedHand: 'Straight',
        },
        {
          name: 'Three of a Kind with extra pair',
          input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', '8D', '2D'),
          expectedHand: 'ThreeOfAKind',
        },
        {
          name: 'Two Pair with extra card',
          input: PokerCard.NewPokerCards('9H', '9D', 'AH', 'AD', '2S', '3D'),
          expectedHand: 'TwoPair',
        },
        {
          name: 'One Pair with extra card',
          input: PokerCard.NewPokerCards('9H', '9D', 'AH', '3D', '2S', '4D'),
          expectedHand: 'OnePair',
        },
        {
          name: 'High Card with extra card',
          input: PokerCard.NewPokerCards('9H', '8D', '7S', '5H', '3D', '2C'),
          expectedHand: 'HighCard',
        },
        {
          name: 'Straight Draw resulting in High Card',
          input: PokerCard.NewPokerCards('2H', '3D', '4S', '5C', '7H', '9D'),
          expectedHand: 'HighCard',
        },
        {
          name: 'Flush Draw resulting in High Card',
          input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '9D', 'JC'),
          expectedHand: 'HighCard',
        },
      ];

      testCases.forEach(({ name, input, expectedHand }) => {
        it(name, () => {
          const result = HandEvaluator.evaluateHand(input);
          const className = (result.hand as any).name;
          expect(className).toEqual(expectedHand);
          // オプション: さらに、result.cards が期待されるカードセットを含んでいることを検証
        });
      });
    });
  });

  describe('7枚のケース', () => {
    const testCases = [
      {
        name: 'Royal Straight Flush with extra cards',
        input: PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH', '2D', '3D'),
        expectedHand: 'RoyalStraightFlush',
      },
      {
        name: 'Straight Flush with extra cards',
        input: PokerCard.NewPokerCards('9H', '0H', 'JH', 'QH', 'KH', '2D', '3D'),
        expectedHand: 'StraightFlush',
      },
      {
        name: 'Four of a Kind with extra cards',
        input: PokerCard.NewPokerCards('9H', '9D', '9S', '9C', 'AH', 'AD', '2D'),
        expectedHand: 'FourOfAKind',
      },
      {
        name: 'Full House with extra cards',
        input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', 'AD', '2D', '3D'),
        expectedHand: 'FullHouse',
      },
      {
        name: 'Flush with extra cards',
        input: PokerCard.NewPokerCards('2H', '4H', '6H', '8H', '0H', '2D', '3D'),
        expectedHand: 'Flush',
      },
      {
        name: 'Straight with extra cards',
        input: PokerCard.NewPokerCards('9H', '0D', 'JD', 'QH', 'KS', '2D', '3D'),
        expectedHand: 'Straight',
      },
      {
        name: 'Three of a Kind with extra cards',
        input: PokerCard.NewPokerCards('9H', '9D', '9S', 'AH', '7D', '2D', '3D'),
        expectedHand: 'ThreeOfAKind',
      },
      {
        name: 'Two Pair with extra cards',
        input: PokerCard.NewPokerCards('9H', '9D', 'AC', 'AD', '2S', '3D', '4D'),
        expectedHand: 'TwoPair',
      },
      {
        name: 'One Pair with extra cards',
        input: PokerCard.NewPokerCards('9H', '9D', 'AH', '3D', '2S', '4D', '6D'),
        expectedHand: 'OnePair',
      },
      {
        name: 'High Card with extra cards',
        input: PokerCard.NewPokerCards('9H', '8D', '7S', '5H', '3D', '2C', '4D'),
        expectedHand: 'HighCard',
      },
    ];

    testCases.forEach(({ name, input, expectedHand }) => {
      it(name, () => {
        const result = HandEvaluator.evaluateHand(input);
        const className = (result.hand as any).name;
        expect(className).toEqual(expectedHand);
      });
    });
  });
});
