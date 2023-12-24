import { StraightFlush } from '@/lib/domain/model/hands/straightFlush';
import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

export class RoyalStraightFlush extends PokerHand {
  static readonly score: number = PokerHandRank.ROYAL_STRAIGHT_FLUSH;

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

  static find(cards: PokerCard[]): PokerCard[] {
    if (!this.isHand(cards)) return [];

    const straightFlushCards = StraightFlush.find(cards);
    const sortedCards = CardsSorter.byNumber(straightFlushCards);

    return sortedCards.filter((card) => [10, 11, 12, 13, 14].includes(card.cardNumber));
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      ロイヤルストレートフラッシュのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - 14(エース)
     */
    return this.score * HAND_RANK_SCALE + 14;
  }
}
