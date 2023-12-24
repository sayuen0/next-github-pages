import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';
import { PokerCard } from '@/lib/domain/model/cards/card';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

export class OnePair extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.ONE_PAIR;

  /**
   * 役判定におけるスコア決定における基底スコア
   */
  static get baseScore(): number {
    return OnePair.score * HAND_RANK_SCALE;
  }

  static isHand(cards: PokerCard[]): boolean {
    if (cards.length < 2) {
      return false;
    }

    // カードを数値によってグループ化
    const groupedCards = this.groupByNumber(cards);

    // 同じ数値のカードが2枚存在する（＝ペアが存在する）場合のみtrueを返す
    return Object.values(groupedCards).some((group) => group.length >= 2);
  }

  static findPairs(cards: PokerCard[]): Set<number> {
    return super.findPairs(cards);
  }

  static find(cards: PokerCard[]): PokerCard[] {
    const pairs = this.findPairs(cards);

    // ペアが存在しない場合は空の配列を返す
    if (pairs.size === 0) {
      return [];
    }

    // ペアの数値を取得
    const pairNumber = pairs.values().next().value;

    // ペアを構成するカードを取得
    const pairCards = cards.filter((card) => card.cardNumber === pairNumber);

    // 残りのカードをソートして、ペア以外の最も高い3枚のカードを選択
    const remainingCards = CardsSorter.byNumber(
      cards.filter((card) => card.cardNumber !== pairNumber),
      'desc',
    ).slice(0, 3);

    // ペアと残りのカードを結合して返す
    return [...pairCards, ...remainingCards];
  }

  calculateScore(cards: PokerCard[]): number {
    /*
    ワンペアのスコアは次のように決まる
    - (全役共通) 役のスコア * スケール値
    - ペアの数値 * 1_000_000
    - ペア以外の最も高いカードの数値 * 10_000
    - 次に高いカードの数値 * 100
    - 最も低いカードの数値
     */
    const pairs = OnePair.findPairs(cards);
    // ペアを見つけた後、ペアでないカードをソート
    const sortedCards = CardsSorter.byNumber(
      cards.filter((card) => !pairs.has(card.cardNumber)),
      'desc',
    );
    // ペアの数値を取得
    const pairNumber = pairs.values().next().value;
    // 最後に計算
    return (
      OnePair.score * HAND_RANK_SCALE +
      pairNumber * 1_000_000 +
      sortedCards[0].cardNumber * 10_000 +
      sortedCards[1].cardNumber * 100 +
      sortedCards[2].cardNumber
    );
  }
}
