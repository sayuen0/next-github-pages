import { PokerCard } from '@/lib/domain/model/cards/card';

export enum PokerHandRank {
  ROYAL_STRAIGHT_FLUSH = 10,
  STRAIGHT_FLUSH = 9,
  FOUR_OF_A_KIND = 8,
  FULL_HOUSE = 7,
  FLUSH = 6,
  STRAIGHT = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}

/*
  役のスケール値
  役のスコア計算の際、異なる役間のスコアを比較するために用いる
 */
export const HAND_RANK_SCALE = 10000000000;

export abstract class PokerHand {
  static readonly score: PokerHandRank;

  static isHand(card: PokerCard[]): boolean {
    throw new Error('Not implemented');
  }

  // Helper method to group cards by their number
  protected static groupByNumber(cards: PokerCard[]): { [key: number]: PokerCard[] } {
    return cards.reduce((groups: { [key: number]: PokerCard[] }, card: PokerCard) => {
      if (!groups[card.cardNumber]) {
        groups[card.cardNumber] = [];
      }
      groups[card.cardNumber].push(card);
      return groups;
    }, {});
  }

  // Checks if all the poker cards have the same suit
  protected static areSameSuit(cards: PokerCard[]): boolean {
    const cardSuits = new Set(cards.map((card) => card.suit));
    return cardSuits.size === 1;
  }

  // 役の数値スコアを計算する
  protected static calculateScore(cards: PokerCard[]): number {
    throw new Error('Not implemented');
  }
}
