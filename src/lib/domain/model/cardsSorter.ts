import { PokerCard } from '@/lib/domain/model/card';

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
}
