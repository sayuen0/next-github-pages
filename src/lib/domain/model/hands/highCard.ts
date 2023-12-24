import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';

export class HighCard extends PokerHand {
  static readonly score: number = PokerHandRank.HIGH_CARD;

  static isHand(cards: PokerCard[]): boolean {
    return true;
  }

  static isDraw(cards: PokerCard[]): boolean {
    return true;
  }

  static find(cards: PokerCard[]): PokerCard[] {
    return cards.sort((a, b) => b.cardNumber - a.cardNumber).slice(0, 5);
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      ハイカードのスコアは次のように決まる
      (全役共通) 役のスコア * スケール値
      - 最も高いカードの数値 * 100,000,000
      - 次に高いカードの数値 * 1,000,000
      - 3番目に高いカードの数値 * 10,000
      - 4番目に高いカードの数値 * 100
      - 最も低いカードの数値
     */
    const sortedCards = cards.sort((a, b) => b.cardNumber - a.cardNumber);
    return (
      this.score * HAND_RANK_SCALE +
      sortedCards[0].cardNumber * 100_000_000 +
      sortedCards[1].cardNumber * 1_000_000 +
      sortedCards[2].cardNumber * 10_000 +
      sortedCards[3].cardNumber * 100 +
      sortedCards[4].cardNumber
    );
  }
}
