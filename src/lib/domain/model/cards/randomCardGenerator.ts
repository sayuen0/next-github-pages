/**
 * ランダムにカードを生成するクラス(デバッグ用)
 */
import { CardValue, NumberSymbol, PokerCard, Suit } from '@/lib/domain/model/cards/card';

export class RandomPokerCardGenerator {
  public static getRandomCard(visible = false): PokerCard {
    const allCards = this.allCardValues();
    const randomIndex = Math.floor(Math.random() * allCards.length);
    const c = new PokerCard(allCards[randomIndex]);
    c.visible = visible;
    return c;
  }

  private static allCardValues(): CardValue[] {
    const suits = Object.values(Suit);
    const numberSymbols = Object.values(NumberSymbol);

    let combinations: CardValue[] = [];
    for (const suit of suits) {
      for (const number of numberSymbols) {
        combinations.push(`${number}${suit}` as CardValue);
      }
    }

    return combinations;
  }
}
