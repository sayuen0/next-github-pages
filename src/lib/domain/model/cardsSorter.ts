import { PokerCard, Suit } from '@/lib/domain/model/card';

enum SuitStrength {
  Spade = 4,
  Heart = 3,
  Diamond = 2,
  Club = 1,
}

export class CardsSorter {
  static byNumber(
    pokerCards: PokerCard[],
    order: 'asc' | 'desc' = 'asc',
  ): PokerCard[] {
    return [...pokerCards].sort((a, b) => {
      if (order === 'asc') {
        return a.cardNumber - b.cardNumber;
      }
      return b.cardNumber - a.cardNumber;
    });
  }

  static bySuits(pokerCards: PokerCard[]): PokerCard[] {
    const suitCount: { [key in Suit]: number } = {
      [Suit.Spade]: 0,
      [Suit.Heart]: 0,
      [Suit.Diamond]: 0,
      [Suit.Club]: 0,
    };

    // 揃っている絵柄の数を数える
    pokerCards.forEach((card) => {
      suitCount[card.suit]++;
    });

    // 絵柄の数が多い順に並べる
    const sortedSuits = Object.entries(suitCount)
      .sort((a, b) => {
        if (b[1] - a[1] === 0) {
          return (
            SuitStrength[b[0] as keyof typeof SuitStrength] -
            SuitStrength[a[0] as keyof typeof SuitStrength]
          );
        }
        return b[1] - a[1];
      })
      .map((entry) => entry[0] as Suit);

    // 絵柄の数が多い順に並べた絵柄の順番でカードを並べる
    let sortedCards: PokerCard[] = [];
    sortedSuits.forEach((suit) => {
      const cardsOfSuit = pokerCards.filter((card) => card.suit === suit);
      sortedCards = [...sortedCards, ...this.byNumber(cardsOfSuit, 'asc')];
    });

    return sortedCards;
  }
}
