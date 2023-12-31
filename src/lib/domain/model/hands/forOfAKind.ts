import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';

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

  static findSet(cards: PokerCard[]): Set<number> {
    const sets = new Set<number>();
    const groupedCards = this.groupByNumber(cards);

    for (const [cardNumber, cards] of Object.entries(groupedCards)) {
      if (cards.length === 4) {
        sets.add(Number(cardNumber));
      }
    }

    return sets;
  }

  static find(cards: PokerCard[]): PokerCard[] {
    const sets = this.findSet(cards);
    if (sets.size === 0) {
      return [];
    }

    const setNumber = sets.values().next().value;
    const fourOfAKindCards = cards.filter((card) => card.cardNumber === setNumber)!;

    const kickerCard = cards.find((card) => card.cardNumber !== setNumber)!;
    return [...fourOfAKindCards, kickerCard];
  }

  calculateScore(cards: PokerCard[]): number {
    /*
      フォーカードのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - フォーカードの数値 * 100
      - キッカーの数値
     */
    const sets = FourOfAKind.findSet(cards);
    const sortedCards = cards.sort((a, b) => b.cardNumber - a.cardNumber);
    const setNumber = sets.values().next().value;
    return (
      FourOfAKind.score * HAND_RANK_SCALE +
      setNumber * 100 +
      sortedCards.find((card) => card.cardNumber !== setNumber)!.cardNumber
    );
  }
}
