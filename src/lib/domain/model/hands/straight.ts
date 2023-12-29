import { PokerCard } from '@/lib/domain/model/cards/card';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';

export class Straight extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT;

  /**
   * 5枚以上のカードが引数として渡された場合、ストレートかどうかを判定する
   * @param cards
   */
  static isHand(cards: PokerCard[]): boolean {
    return Straight.find(cards).length > 0;
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
    const aceToFives = [14, 2, 3, 4, 5];
    const aceToFiveCards = cards.filter((card) => aceToFives.includes(card.cardNumber));

    // エースハイストレートを成すカードが正確に5枚存在することを確認
    // (A, A, 2, 3, 4)とかはダメ
    return (
      aceToFiveCards.length === 5 &&
      new Set(aceToFiveCards.map((c) => c.cardNumber)).size === 5
    );
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
    // カード枚数が足りない場合はfalse
    if (cards.length < length - startIndex) {
      return false;
    }

    let lastCardNumber = cards[startIndex].cardNumber;
    let consecutiveCount = 1;

    for (let i = startIndex + 1; i < cards.length; i++) {
      if (cards[i].cardNumber === lastCardNumber + 1) {
        lastCardNumber = cards[i].cardNumber;
        consecutiveCount++;
        if (consecutiveCount === length) {
          return true;
        }
      } else if (cards[i].cardNumber !== lastCardNumber) {
        // カードが連続していない場合、連続カウントをリセット
        return false;
      }
      // 同じ数字のカードが続く場合は無視してカウント続行
    }
    return true;
  }

  /**
   * ストレートが見つかった場合、そのストレートを構成するカードを返す
   * @param cards
   */
  static find(cards: PokerCard[]): PokerCard[] {
    const sortedCards = CardsSorter.byNumber(cards);

    // 重複を排除したカードのリストを作成
    const uniqueCards = sortedCards.filter(
      (card, index, self) =>
        index === self.findIndex((t) => t.cardNumber === card.cardNumber),
    );

    let highestStraight: PokerCard[] = [];

    // 通常のストレートを検出
    for (let i = 0; i <= uniqueCards.length - 5; i++) {
      if (this.isConsecutive(uniqueCards, i, 5)) {
        const currentStraight = uniqueCards.slice(i, i + 5);
        if (
          highestStraight.length === 0 ||
          currentStraight[4].cardNumber > highestStraight[4].cardNumber
        ) {
          highestStraight = currentStraight;
        }
      }
    }

    // 最も高いストレートを返す
    if (highestStraight.length > 0) {
      return highestStraight;
    }

    // エースハイストレート（A-2-3-4-5）を検出
    if (this.isAceToFiveStraight(uniqueCards)) {
      return sortedCards.filter((card) => [2, 3, 4, 5, 14].includes(card.cardNumber));
    }

    return [];
  }

  calculateScore(cards: PokerCard[]): number {
    /*
      ストレートのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - ストレートの最も高いカードの数値
      ただし、A-2-3-4-5のストレートの場合は、最も高いカードは5として扱う
     */
    const straightCards = Straight.find(cards);
    const sortedCards = CardsSorter.byNumber(straightCards);
    const isAceToFiveStraight = Straight.isAceToFiveStraight(sortedCards);
    const highestCardNumber = isAceToFiveStraight ? 5 : sortedCards[4].cardNumber;
    return Straight.score * HAND_RANK_SCALE + highestCardNumber;
  }
}
