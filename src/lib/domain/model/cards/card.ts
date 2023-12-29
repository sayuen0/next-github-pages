export enum Suit {
  Spade = 'S',
  Diamond = 'D',
  Heart = 'H',
  Club = 'C',
}

export function convertSuitToDirectoryName(suit: Suit): string {
  const suitMap: { [key in Suit]: string } = {
    [Suit.Spade]: 'Spade',
    [Suit.Diamond]: 'Diamond',
    [Suit.Heart]: 'Heart',
    [Suit.Club]: 'Club',
  };

  return suitMap[suit];
}

export enum UnicodeSuit {
  Spade = '♠️',
  Diamond = '🔶',
  Heart = '❤️',
  Club = '♣️',
}

// Suitと変数名が一致するPrettySuitを、その変数名を登場させずに取得する
export function getUnicodeSuit(suit: Suit): UnicodeSuit {
  const prettySuitMap: { [key in Suit]: UnicodeSuit } = {
    [Suit.Spade]: UnicodeSuit.Spade,
    [Suit.Diamond]: UnicodeSuit.Diamond,
    [Suit.Heart]: UnicodeSuit.Heart,
    [Suit.Club]: UnicodeSuit.Club,
  };

  return prettySuitMap[suit];
}

export enum NumberSymbol {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '0',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export type CardValue = `${NumberSymbol}${Suit}`;

const suits: readonly Suit[] = Object.values(Suit);
const numbers: readonly NumberSymbol[] = Object.values(NumberSymbol);

let combinations: CardValue[] = [];
for (const suit of suits) {
  for (const number of numbers) {
    combinations.push(`${number}${suit}` as CardValue);
  }
}

export const CardValues = combinations;

export class PokerCard {
  private readonly _cardValue: CardValue;

  constructor(cardValue: CardValue) {
    this._cardValue = assertValidCard(cardValue);
  }

  private _visible: boolean = false;

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(value: boolean) {
    this._visible = value;
  }

  public get cardValue(): CardValue {
    return this._cardValue;
  }

  public get prettyCardValue(): string {
    const suit = getUnicodeSuit(this.suit);
    const number = this.numberSymbol;
    return `${number}${suit}`;
  }

  public get cardNumber(): number {
    const cardCharacter = this._cardValue.slice(0, -1);
    if (cardCharacter === 'A') {
      return 14; // Modify 'A' to have a score of 14
    } else if (cardCharacter === 'J') {
      return 11;
    } else if (cardCharacter === 'Q') {
      return 12;
    } else if (cardCharacter === 'K') {
      return 13;
    } else if (cardCharacter === '0') {
      return 10;
    } else {
      return Number(cardCharacter);
    }
  }

  public get suit(): Suit {
    const suitCharacter = this._cardValue.slice(-1);

    const matchedSuitEntry = Object.entries(Suit).find(
      ([, value]) => value === suitCharacter,
    );

    if (matchedSuitEntry) {
      return matchedSuitEntry[1] as Suit;
    }
    // 実質デッドルート
    throw new Error('Invalid suit character');
  }

  public get numberSymbol(): NumberSymbol {
    return this._cardValue.slice(0, 1) as NumberSymbol;
  }

  /**
   * テスト用
   */
  static NewPokerCards(...values: CardValue[]): PokerCard[] {
    // 重複したカードを渡してはいけない(トランプの中で同一の数・スーツが2枚以上存在することはない)
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      throw new Error('Duplicate values are not allowed');
    }
    return values.map((v) => new PokerCard(v));
  }
}

export function sanitizeCardValue(input: string): string {
  if (!input) return input;
  const valueMap: { [key: string]: string } = {
    '10': '0',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
  };

  const suit = input.charAt(input.length - 1).toUpperCase();
  const value = input.slice(0, -1).toUpperCase();

  if (valueMap[value]) {
    return valueMap[value] + suit;
  }
  return value + suit;
}

export function assertValidCard(input: string): CardValue {
  const sanitizedValue = sanitizeCardValue(input);

  if (!CardValues.includes(sanitizedValue as CardValue)) {
    throw new Error(`Invalid card value: ${input}`);
  }

  return sanitizedValue as CardValue;
}
