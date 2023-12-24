import { PokerCard, Suit } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';

export class Flush extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.FLUSH;

  static isHand(cards: PokerCard[]): boolean {
    return this.hasSuitOfAtLeast(cards, 5, 7);
  }

  static isDraw(cards: PokerCard[]): boolean {
    return this.hasSuitOfAtLeast(cards, 4, 6);
  }

  /**
   * フラッシュが見つかった場合は、そのフラッシュのカードを返す
   * @param cards
   */
  static find(cards: PokerCard[]): PokerCard[] {
    if (!this.isHand(cards)) return [];
    const suits = ['H', 'D', 'C', 'S'];

    for (let suit of suits) {
      const sameSuitCards = cards.filter((card) => card.suit === suit);
      if (sameSuitCards.length >= 5) {
        return sameSuitCards.sort((a, b) => a.cardNumber - b.cardNumber);
      }
    }

    return [];
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      フラッシュのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - フラッシュの最も高いカードの数値
     */
    const flushCards = this.find(cards);
    const sortedCards = flushCards.sort((a, b) => b.cardNumber - a.cardNumber);
    return this.score * HAND_RANK_SCALE + sortedCards[0].cardNumber;
  }

  /**
   * 引数のカードの中に、指定した枚数以上の同じスートのカードが存在するかどうかを判定する
   * @param cards
   * @param target
   * @param limit
   * @private
   */
  static hasSuitOfAtLeast(cards: PokerCard[], target: number, limit: number): boolean {
    if (cards.length < target || cards.length > limit) {
      return false;
    }

    const suitCounts: { [key in Suit]?: number } = {};
    for (const card of cards) {
      suitCounts[card.suit] = (suitCounts[card.suit] ?? 0) + 1;
    }
    return Object.values(suitCounts)
      .filter((count): count is number => count !== undefined)
      .some((count) => count >= target);
  }
}
