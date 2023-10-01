import { PokerCard } from '@/lib/domain/model/card';

abstract class PokerHand {
  readonly score!: number;

  abstract isHand(card: PokerCard[]): boolean;
}

// TODO: 全役定義する

export class RoyalStraightFlush {
  readonly score = 10;

  isHand(card: PokerCard[]): boolean {
    // TODO: returns if it is straight & flush & minimum card is 10
    return false;
  }
}
