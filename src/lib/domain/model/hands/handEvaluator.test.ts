import { HandEvaluator } from '@/lib/domain/model/hands/handEvaluator';
import { PokerCard } from '@/lib/domain/model/cards/card';

describe('HandEvaluator class', () => {
  describe('.evaluateHand', () => {
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
});
