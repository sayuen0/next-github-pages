import { PokerCard } from '@/lib/domain/model/cards/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

export class FourOfAKind extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.FOUR_OF_A_KIND;

  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 4) {
      return false;
    }

    // カードを数値でグループ化する
    const groupedCards = this.groupByNumber(cards);

    // 4枚ちょうど同じ数値のカードが存在する場合にのみtrueを返す
    return Object.values(groupedCards).some((group) => group.length === 4);
  }
}
