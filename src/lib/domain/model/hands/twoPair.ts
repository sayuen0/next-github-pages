import { PokerCard } from '@/lib/domain/model/cards/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

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
}
