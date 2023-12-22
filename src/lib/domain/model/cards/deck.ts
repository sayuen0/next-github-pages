import { NumberSymbol, PokerCard, Suit } from '@/lib/domain/model/cards/card';

class Deck {
  private cards: PokerCard[];

  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // ES6の配列分割代入を使用して要素を交換
    }
  }

  public drawTop(): PokerCard | undefined {
    return this.cards.shift();
  }

  private initializeDeck(): void {
    for (const suit of Object.values(Suit)) {
      for (const number of Object.values(NumberSymbol)) {
        this.cards.push(new PokerCard(`${number}${suit}`));
      }
    }
  }
}

export default Deck;
