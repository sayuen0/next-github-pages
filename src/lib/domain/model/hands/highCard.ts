import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

export class HighCard extends PokerHand {
  static readonly score: number = PokerHandRank.HIGH_CARD;

  static isHand(cards: PokerCard[]): boolean {
    return true;
  }

  static isDraw(cards: PokerCard[]): boolean {
    return true;
  }
}
