import { PokerCard } from '@/lib/domain/model/card';
import { CardsSorter } from '@/lib/domain/model/cardsSorter';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

export class Straight extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT;

  static isHand(cards: PokerCard[]): boolean {
    // 4枚以下の場合はストレートではない
    if (cards.length <= 4) {
      return false;
    }

    // まずカードを数字順にソート
    const sortedCards = CardsSorter.byNumber(cards);

    // エースの特別な扱い：A-2-3-4-5 の場合もストレートとして扱う
    if (this.isAceToFiveStraight(sortedCards)) {
      return true;
    }

    let consecutiveCount = 1;

    for (let i = 0; i < sortedCards.length - 1; i++) {
      const currentCard = sortedCards[i];
      const nextCard = sortedCards[i + 1];

      // カードが連続しているかどうかを確認
      if (nextCard.cardNumber === currentCard.cardNumber + 1) {
        consecutiveCount++;
      } else if (consecutiveCount < 5 && nextCard.cardNumber !== currentCard.cardNumber) {
        // 連続していない場合、カウントをリセット（ただし、重複しているカードは無視）
        consecutiveCount = 1;
      }
    }

    return consecutiveCount >= 5;
  }

  private static isAceToFiveStraight(cards: PokerCard[]): boolean {
    const aceToFives = [14, 2, 3, 4, 5];
    return cards.every((card) => aceToFives.includes(card.cardNumber));
  }
}
