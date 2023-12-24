import { ThreeOfAKind } from '@/lib/domain/model/hands/threeOfAKind';
import { PokerCard } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/hands';
import { OnePair } from '@/lib/domain/model/hands/onePair';

export class FullHouse extends PokerHand {
  static readonly score = PokerHandRank.FULL_HOUSE;

  /**
   * フルハウスであるかどうかを判定する
   * @param cards
   */
  static isHand(cards: PokerCard[]): boolean {
    const threeOfAKindValues = ThreeOfAKind.findSet(cards);
    if (threeOfAKindValues.size < 1) {
      return false;
    }

    // スリーカードが2組以上見つかったらフルハウスである
    if (threeOfAKindValues.size > 1) {
      return true;
    }

    const remainingCards = cards.filter(
      (card) => !threeOfAKindValues.has(card.cardNumber),
    );

    return OnePair.isHand(remainingCards);
  }

  /**
   * フルハウスのドローであるかどうかを判定する
   * @param cards
   */
  static isDraw(cards: PokerCard[]): boolean {
    if (cards.length < 5) {
      return false;
    }

    const threeOfAKindValues = ThreeOfAKind.findSet(cards);
    const remainingCards = cards.filter(
      (card) => !threeOfAKindValues?.has(card.cardNumber),
    );

    // スリーカード1組は、フルハウスドローである
    if (threeOfAKindValues?.size === 1) {
      return true;
    }

    // ツーペアはフルハウスドローである
    const pairValues = OnePair.findSet(cards);
    if (pairValues.size >= 2) {
      return true;
    }

    return false;
  }

  static calculateScore(cards: PokerCard[]): number {
    /*
      フルハウスのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - スリーカードの数値 * 100
      - ツーペアの数値
     */
    const threeOfAKindValues = ThreeOfAKind.findSet(cards);
    const remainingCards = cards.filter(
      (card) => !threeOfAKindValues.has(card.cardNumber),
    );
    const pairValues = OnePair.findSet(remainingCards);
    const threeOfAKindNumber = threeOfAKindValues.values().next().value;
    const pairNumber = pairValues.values().next().value;
    // 最後に計算
    return this.score * HAND_RANK_SCALE + threeOfAKindNumber * 100 + pairNumber;
  }
}
