import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';
import { PokerCard } from '@/lib/domain/model/card';
import { CardsSorter } from '@/lib/domain/model/cardsSorter';

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
}
