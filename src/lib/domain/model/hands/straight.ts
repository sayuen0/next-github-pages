import { PokerCard } from '@/lib/domain/model/cards/card';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';
import { PokerHand, PokerHandRank } from '@/lib/domain/model/hands/hands';

export class Straight extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT;

  /**
   * 5枚以上のカードが引数として渡された場合、ストレートかどうかを判定する
   * @param cards
   */
  static isHand(cards: PokerCard[]): boolean {
    // 4枚以下の場合はストレートではない
    if (cards.length < 5) {
      return false;
    }

    // まずカードを数字順にソート
    const sortedCards = CardsSorter.byNumber(cards);

    // エースの特別な扱い：A-2-3-4-5 の場合もストレートとして扱う
    if (this.isAceToFiveStraight(sortedCards)) {
      return true;
    }

    // Check all possible 5 consecutive cards
    for (let i = 0; i <= sortedCards.length - 5; i++) {
      if (this.isConsecutive(sortedCards, i, 5)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 5枚以上のカードが引数として渡された場合、ストレートドローかどうかを判定する
   * @param cards
   */
  public static isDraw(cards: PokerCard[]): boolean {
    // ゲーム上めくれている枚数が4枚以下のケースは考慮不要
    // 6枚超過の場合はストレートドローではない(7枚の時点で、もうカード追加の可能性はないため)
    if (cards.length <= 4 || cards.length > 6) {
      return false;
    }

    const sortedCards = CardsSorter.byNumber(cards);

    // 4連続しているカードの確認
    for (let i = 0; i < sortedCards.length - 3; i++) {
      if (this.isConsecutive(sortedCards, i, 4)) {
        return true;
      }
    }

    // 中が抜けているカードの確認
    if (this.isMissingConsecutive(sortedCards)) {
      return true;
    }

    return false;
  }

  /**
   * カードのシーケンスにで一つだけ欠けがあるどうかを判定する
   * @param sortedCards
   */
  public static isMissingConsecutive(sortedCards: PokerCard[]): boolean {
    // 7枚以上ある時点でもう可能性はない
    if (sortedCards.length >= 7) {
      return false;
    }

    for (let i = 0; i <= sortedCards.length - 4; i++) {
      const diff1 = sortedCards[i + 1].cardNumber - sortedCards[i].cardNumber;
      const diff2 = sortedCards[i + 2].cardNumber - sortedCards[i + 1].cardNumber;
      const diff3 = sortedCards[i + 3].cardNumber - sortedCards[i + 2].cardNumber;

      if (
        (diff1 === 1 && diff2 === 2 && diff3 === 1) || // 欠けている数値が始まりの場合
        (diff1 === 1 && diff2 === 1 && diff3 === 2) || // 欠けている数値が終わりの場合
        (diff1 === 2 && diff2 === 1 && diff3 === 1) // 欠けている数値が真ん中の場合
      ) {
        return true;
      }
    }

    return false;
  }

  /*
   * エースを含むストレートかどうかを判定する
   */
  public static isAceToFiveStraight(cards: PokerCard[]): boolean {
    if (cards.length < 5) {
      return false;
    }
    const aceToFives = [14, 2, 3, 4, 5];
    const aceToFiveCount = cards.filter((card) => aceToFives.includes(card.cardNumber));
    return aceToFiveCount.length >= 5;
  }

  /**
   * カードのシーケンスが連続しているかどうかを判定する
   * @param cards
   * @param startIndex
   * @param length
   */
  public static isConsecutive(
    cards: PokerCard[],
    startIndex: number,
    length: number,
  ): boolean {
    for (let i = 0; i < length - 1; i++) {
      if (cards[startIndex + i].cardNumber + 1 !== cards[startIndex + i + 1].cardNumber) {
        return false;
      }
    }
    return true;
  }

  /**
   * ストレートが見つかった場合、そのストレートを構成するカードを返す
   * @param cards
   */
  static find(cards: PokerCard[]): PokerCard[] {
    const sortedCards = CardsSorter.byNumber(cards);

    for (let i = 0; i <= sortedCards.length - 5; i++) {
      if (this.isConsecutive(sortedCards, i, 5)) {
        return sortedCards.slice(i, i + 5);
      }
    }

    return [];
  }
}
