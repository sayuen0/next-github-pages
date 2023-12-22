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

  public get cardValue(): CardValue {
    return this._cardValue;
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

  static NewPokerCards(...values: CardValue[]): PokerCard[] {
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

/**
 * デバッグ用
 */
