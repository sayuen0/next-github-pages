import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/hands';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

export class OnePair extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.ONE_PAIR;

  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 2) {
      return false;
    }

    // カードを数値によってグループ化
    const groupedCards = this.groupByNumber(cards);

    // 同じ数値のカードが2枚存在する（＝ペアが存在する）場合のみtrueを返す
    return Object.values(groupedCards).some((group) => group.length >= 2);
  }

  static findSet(cards: PokerCard[]): Set<number> {
    const sortedCards = CardsSorter.byNumber(cards);
    let pairs = new Set<number>();

    for (let i = 0; i <= sortedCards.length - 2; i++) {
      if (sortedCards[i].cardNumber === sortedCards[i + 1].cardNumber) {
        pairs.add(sortedCards[i].cardNumber);
        i += 1; // Skip the next card that is part of the current pair
      }
    }

    return pairs; // Always return a Set (can be empty if no pairs are found)
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
    ワンペアのスコアは次のように決まる
    - (全役共通) 役のスコア * スケール値
    - ペアの数値 * 1_000_000
    - ペア以外の最も高いカードの数値 * 10_000
    - 次に高いカードの数値 * 100
    - 最も低いカードの数値
     */
    const pairs = this.findSet(cards);
    // ペアを見つけた後、ペアでないカードをソート
    const sortedCards = CardsSorter.byNumber(
      cards.filter((card) => !pairs.has(card.cardNumber)),
      'desc',
    );
    // ペアの数値を取得
    const pairNumber = pairs.values().next().value;
    // 最後に計算
    return (
      this.score * HAND_RANK_SCALE +
      pairNumber * 1_000_000 +
      sortedCards[0].cardNumber * 10_000 +
      sortedCards[1].cardNumber * 100 +
      sortedCards[2].cardNumber
    );
  }
}
