import { NumberSymbol, PokerCard } from '@/lib/domain/model/cards/card';

/**
 * 手札を表現する型
 */
type Rank = (typeof NumberSymbol)[keyof typeof NumberSymbol];

type SameRank<R extends Rank> = `${R}${R}`;
type DifferentRank<R1 extends Rank, R2 extends Rank> = `${R1}${R2}s` | `${R1}${R2}o`;

type Combine<R1 extends Rank, R2 extends Rank> = R1 extends R2
  ? SameRank<R1>
  : DifferentRank<R1, R2>;

export type StartingHand = Combine<Rank, Rank>;

/**
 * ホールカード(手札)を表すクラス
 */
export class HoleCards {
  private card1: PokerCard;
  private card2: PokerCard;

  constructor(card1: PokerCard, card2: PokerCard) {
    this.card1 = card1;
    this.card2 = card2;
  }

  get cards(): [PokerCard, PokerCard] {
    return [this.card1, this.card2];
  }

  isPocketPair(): boolean {
    return this.card1.cardNumber === this.card2.cardNumber;
  }

  isSuited(): boolean {
    return this.card1.suit === this.card2.suit;
  }
}
