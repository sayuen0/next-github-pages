import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';
import { CardsSorter } from '@/lib/domain/model/cardsSorter';

export class ThreeOfAKind extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.THREE_OF_A_KIND;

  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 3) {
      return false;
    }

    // カードを数値でグループ化する
    const groupedCards = this.groupByNumber(cards);

    // 3枚同じ数値のカードが存在する場合にのみtrueを返す
    return Object.values(groupedCards).some((group) => group.length >= 3);
  }

  static findSet(cards: PokerCard[]): Set<number> {
    const sortedCards = CardsSorter.byNumber(cards);
    let sets = new Set<number>();

    for (let i = 0; i <= sortedCards.length - 3; i++) {
      if (
        sortedCards[i].cardNumber === sortedCards[i + 1].cardNumber &&
        sortedCards[i].cardNumber === sortedCards[i + 2].cardNumber
      ) {
        sets.add(sortedCards[i].cardNumber);
        i += 2; // Skip the next two cards that are part of the current set
      }
    }

    return sets;
  }
}
