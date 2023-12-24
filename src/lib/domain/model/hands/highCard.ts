import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/hands';

export class HighCard extends PokerHand {
  static readonly score: number = PokerHandRank.HIGH_CARD;

  static isHand(cards: PokerCard[]): boolean {
    return true;
  }

  static isDraw(cards: PokerCard[]): boolean {
    return true;
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      ハイカードのスコアは次のように決まる
      (全役共通) 役のスコア * スケール値
      - 最も高いカードの数値 * 10000
      - 次に高いカードの数値 * 1000
      - 3番目に高いカードの数値 * 100
      - 4番目に高いカードの数値 * 10
      - 最も低いカードの数値
     */
    const sortedCards = cards.sort((a, b) => b.cardNumber - a.cardNumber);
    return (
      this.score * HAND_RANK_SCALE +
      sortedCards.reduce((score, card, index) => {
        return score + card.cardNumber * Math.pow(10, 4 - index);
      }, 0)
    );
  }
}
