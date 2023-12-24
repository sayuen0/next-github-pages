import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/hands';
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
    if (!this.isHand(cards)) return [];

    const sortedCards = CardsSorter.byNumber(cards);

    // エースハイストレートフラッシュの検出（A-2-3-4-5）
    if (
      Straight.isAceToFiveStraight(sortedCards) &&
      Flush.hasSuitOfAtLeast(sortedCards, 5, 5)
    ) {
      return sortedCards.filter((card) => [2, 3, 4, 5, 14].includes(card.cardNumber));
    }

    // 通常のストレートフラッシュの検出
    for (let i = 0; i <= sortedCards.length - 5; i++) {
      if (
        Straight.isConsecutive(sortedCards, i, 5) &&
        Flush.hasSuitOfAtLeast(sortedCards.slice(i, i + 5), 5, 5)
      ) {
        return sortedCards.slice(i, i + 5);
      }
    }

    return [];
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      ストレートフラッシュのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - ストレートフラッシュの最も高いカードの数値

      ただし、A-2-3-4-5 のストレートフラッシュの場合は、5を最も高いカードとして扱う
     */
    const straightFlushCards = this.find(cards);
    const sortedCards = straightFlushCards.sort((a, b) => b.cardNumber - a.cardNumber);
    const isAceToFiveStraightFlush = Straight.isAceToFiveStraight(straightFlushCards);
    const highestCardNumber = isAceToFiveStraightFlush ? 5 : sortedCards[0].cardNumber;
    return this.score * HAND_RANK_SCALE + highestCardNumber;
  }
}
