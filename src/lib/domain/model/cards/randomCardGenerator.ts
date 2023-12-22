/**
 * ランダムにカードを生成するクラス(デバッグ用)
 */
import { CardValue, NumberSymbol, PokerCard, Suit } from '@/lib/domain/model/cards/card';

export class RandomPokerCardGenerator {
  public static getRandomCard(): PokerCard {
    const allCards = this.allCardValues();
    const randomIndex = Math.floor(Math.random() * allCards.length);
    return new PokerCard(allCards[randomIndex]);
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
