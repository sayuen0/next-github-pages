import { PokerCard } from '@/lib/domain/model/card';

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
}
