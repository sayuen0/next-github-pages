import { StraightFlush } from '@/lib/domain/model/hands/straightFlush';
import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand } from '@/lib/domain/model/hands/hands';
import { CardsSorter } from '@/lib/domain/model/cardsSorter';

export class RoyalStraightFlush extends PokerHand {
  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 5 || cards.length > 7) {
      return false;
    }
    // Check if hand is a straight flush
    const straightFlushCards = StraightFlush.find(cards);

    if (straightFlushCards.length === 0) {
      return false;
    }

    // Check if the lowest card of the straight flush is 10
    const sortedCards = CardsSorter.byNumber(straightFlushCards);

    return sortedCards[0].cardNumber === 10;
  }
}
