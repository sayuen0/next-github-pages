import { PokerCard } from '@/lib/domain/model/cards/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';
import { Straight } from '@/lib/domain/model/hands/straight';
import { Flush } from '@/lib/domain/model/hands/flush';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

export class StraightFlush extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT_FLUSH;

  static isHand(cards: PokerCard[]): boolean {
    // ストレートかつフラッシュであることを確認する
    return Straight.isHand(cards) && Flush.isHand(cards);
  }

  /**
   * ストレートドローかつ、その4枚がちょうど同じスートであるかどうかを判定する
   * @param cards
   */
  static isDraw(cards: PokerCard[]): boolean {
    if (cards.length < 4 || cards.length > 6) {
      return false;
    }

    const sortedCards = CardsSorter.byNumber(cards);

    for (let i = 0; i <= sortedCards.length - 3; i++) {
      if (
        (Straight.isConsecutive(sortedCards, i, 3) &&
          this.areSameSuit(sortedCards.slice(i, i + 3))) ||
        (Straight.isConsecutive(sortedCards, i, 4) &&
          this.areSameSuit(sortedCards.slice(i, i + 4)))
      ) {
        return true;
      }
    }

    return false;
  }

  static find(cards: PokerCard[]): PokerCard[] {
    const straightCards = Straight.isHand(cards) ? Straight.find(cards) : [];
    const flushCards = Flush.isHand(cards) ? Flush.find(cards) : [];

    // Check if the found straight and flush cards are the same
    if (CardsSorter.isSameSet(straightCards, flushCards)) {
      return straightCards;
    }

    return [];
  }
}
