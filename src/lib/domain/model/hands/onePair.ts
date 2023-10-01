import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';
import { PokerCard } from '@/lib/domain/model/card';

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

  // Helper method to group cards by their number
  private static groupByNumber(cards: PokerCard[]): { [key: number]: PokerCard[] } {
    return cards.reduce((groups: { [key: number]: PokerCard[] }, card: PokerCard) => {
      if (!groups[card.cardNumber]) {
        groups[card.cardNumber] = [];
      }
      groups[card.cardNumber].push(card);
      return groups;
    }, {});
  }
}
