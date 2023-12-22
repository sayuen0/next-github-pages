import { PokerCard } from '@/lib/domain/model/cards/card';

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
