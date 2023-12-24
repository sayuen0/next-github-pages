import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';

export class TwoPair extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.TWO_PAIR;

  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 4) {
      return false;
    }

    // カードを数値によってグループ化
    const groupedCards = this.groupByNumber(cards);

    // ペアが2つ以上存在する場合のみtrueを返す
    return Object.values(groupedCards).filter((group) => group.length >= 2).length >= 2;
  }

  // ペアをなしている2組を返す
  static findPairs(cards: PokerCard[]): Set<number> {
    return super.findPairs(cards);
  }

  static find(cards: PokerCard[]): PokerCard[] {
    const pairs = this.findPairs(cards);
    if (pairs.size < 2) {
      return [];
    }

    const pairNumbers = Array.from(pairs.values()).sort((a, b) => b - a);
    const pairCards = cards
      .filter((card) => pairNumbers.includes(card.cardNumber))
      .slice(0, 4);

    const kickerCard = cards.find((card) => !pairNumbers.includes(card.cardNumber))!;
    return [...pairCards, kickerCard];
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      ツーペアのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - 高いペアの数値 * 10_000
      - 低いペアの数値 * 100
      - ペアでないカードの数値
     */
    const pairs = this.findPairs(cards);
    // ペアを見つけた後、ペアでないカードをソート
    const sortedCards = cards
      .filter((card) => !pairs.has(card.cardNumber))
      .sort((a, b) => b.cardNumber - a.cardNumber);
    // ペアの数値を取得
    const pairNumbers = Array.from(pairs.values()).sort((a, b) => b - a);

    // 最後に計算
    return (
      this.score * HAND_RANK_SCALE +
      pairNumbers[0] * 10_000 +
      pairNumbers[1] * 100 +
      sortedCards[0].cardNumber
    );
  }
}
