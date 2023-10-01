import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

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
}
