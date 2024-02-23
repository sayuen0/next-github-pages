import { NumberSymbol, PokerCard, Suit } from '@/lib/domain/model/cards/card';
import { StartingHand } from '@/lib/domain/model/cards/holeCards';

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

  /**
   * スターティングハンドに従い、その組み合わせに該当するハンドをランダムに2枚引く
   * @param startingHand
   */
  public drawStartingHand(startingHand: StartingHand): [PokerCard, PokerCard] {
    try {
      // startingHandは、AAなどのポケットペア、AKsなどのスーテッド、AKoなどのオフスーテッドとなる
      const rank1 = startingHand[0];
      const rank2 = startingHand[1];
      // rank1とrank2が同じ場合はポケットペア
      if (rank1 === rank2) {
        const pairedCards = this.cards.filter((card) => card.numberSymbol === rank1);
        // 返す2枚を決める(先頭2枚)
        // それらをデッキから取り除く
        this.cards = this.cards.filter(
          (card) => card !== pairedCards[0] && card !== pairedCards[1],
        );
        return [pairedCards[0], pairedCards[1]];
      }
      // rank1とrank2が異なる場合
      const suited = startingHand.endsWith('s');
      const cards = this.cards.filter(
        (card) => card.numberSymbol === rank1 || card.numberSymbol === rank2,
      );
      // suitedである場合、同じスートのカードを抽出
      if (suited) {
        const suitedCards = cards.filter((card) => card.suit === cards[0].suit);
        // それらのカードをデッキから取り除く
        this.cards = this.cards.filter(
          (card) => card !== suitedCards[0] && card !== suitedCards[1],
        );
        return [suitedCards[0], suitedCards[1]];
      }
      // off suitedである場合、異なるスートのカードを抽出
      const offSuitedCards = cards.filter((card) => card.suit !== cards[0].suit);
      // それらのカードをデッキから取り除く
      this.cards = this.cards.filter(
        (card) => card !== offSuitedCards[0] && card !== offSuitedCards[1],
      );
      return [offSuitedCards[0], offSuitedCards[1]];
    } catch {
      throw new Error('Invalid starting hand');
    }
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
