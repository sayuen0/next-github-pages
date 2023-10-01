import { PokerCard } from '@/lib/domain/model/card';
import { PokerHand } from '@/lib/domain/model/hands/hands';

export class HighCard extends PokerHand {
  static isHand(cards: PokerCard[]): boolean {
    return true;
  }

  static isDraw(cards: PokerCard[]): boolean {
    return true;
  }
}
