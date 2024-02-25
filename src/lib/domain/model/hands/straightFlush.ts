import { PokerCard, Suit } from '@/lib/domain/model/cards/card';
import {
  HAND_RANK_SCALE,
  PokerHand,
  PokerHandRank,
} from '@/lib/domain/model/hands/pokerHand';
import { Straight } from '@/lib/domain/model/hands/straight';
import { Flush } from '@/lib/domain/model/hands/flush';
import { CardsSorter } from '@/lib/domain/model/cards/cardsSorter';

export class StraightFlush extends PokerHand {
  static readonly score: PokerHandRank = PokerHandRank.STRAIGHT_FLUSH;

  static isHand(cards: PokerCard[]): boolean {
    // スートごとカードを子配列に分類
    const cardsBySuit = new Map<Suit, PokerCard[]>();
    cards.forEach((c) => {
      if (!cardsBySuit.has(c.suit)) {
        cardsBySuit.set(c.suit, []);
      }
      cardsBySuit.get(c.suit)?.push(c);
    });

    // 子配列それぞれについて
    for (const [_, cards] of Array.from(cardsBySuit.entries())) {
      if (cards.length < 5) {
        continue;
      }
      const sortedCards = CardsSorter.byNumber(cards);

      // エースハイストレートフラッシュの検出（A-2-3-4-5）
      if (
        Straight.isAceToFiveStraight(sortedCards) &&
        Flush.hasSuitOfAtLeast(sortedCards, 5, 5)
      ) {
        return true;
      }

      // 通常のストレートフラッシュの検出
      for (let i = 0; i <= sortedCards.length - 5; i++) {
        if (
          Straight.isConsecutive(sortedCards, i, 5) &&
          Flush.hasSuitOfAtLeast(sortedCards.slice(i, i + 5), 5, 5)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * ストレートドローかつ、その4枚がちょうど同じスートであるかどうかを判定する
   * @param cards
   */
  static isDraw(cards: PokerCard[]): boolean {
    if (cards.length < 4 || cards.length > 6) {
      return false;
    }

    const sortedCards = CardsSorter.byNumber(cards);

    for (let i = 0; i <= sortedCards.length - 3; i++) {
      if (
        (Straight.isConsecutive(sortedCards, i, 3) &&
          this.areSameSuit(sortedCards.slice(i, i + 3))) ||
        (Straight.isConsecutive(sortedCards, i, 4) &&
          this.areSameSuit(sortedCards.slice(i, i + 4)))
      ) {
        return true;
      }
    }

    return false;
  }

  static find(cards: PokerCard[]): PokerCard[] {
    // スートごとカードを子配列に分類
    const cardsBySuit = new Map<Suit, PokerCard[]>();
    cards.forEach((c) => {
      if (!cardsBySuit.has(c.suit)) {
        cardsBySuit.set(c.suit, []);
      }
      cardsBySuit.get(c.suit)?.push(c);
    });

    // 子配列それぞれについて
    for (const [_, cards] of Array.from(cardsBySuit.entries())) {
      if (cards.length < 5) {
        continue;
      }
      const sortedCards = CardsSorter.byNumber(cards);

      // エースハイストレートフラッシュの検出（A-2-3-4-5）
      if (
        Straight.isAceToFiveStraight(sortedCards) &&
        Flush.hasSuitOfAtLeast(sortedCards, 5, 5)
      ) {
        return sortedCards.filter((card) => [2, 3, 4, 5, 14].includes(card.cardNumber));
      }

      // 通常のストレートフラッシュの検出
      for (let i = 0; i <= sortedCards.length - 5; i++) {
        if (
          Straight.isConsecutive(sortedCards, i, 5) &&
          Flush.hasSuitOfAtLeast(sortedCards.slice(i, i + 5), 5, 5)
        ) {
          return sortedCards.slice(i, i + 5);
        }
      }
    }

    return [];
  }

  calculateScore(cards: PokerCard[]): number {
    /*
      ストレートフラッシュのスコアは次のように決まる
      - (全役共通) 役のスコア * スケール値
      - ストレートフラッシュの最も高いカードの数値

      ただし、A-2-3-4-5 のストレートフラッシュの場合は、5を最も高いカードとして扱う
     */
    const straightFlushCards = StraightFlush.find(cards);
    // FIXME: findがたまにundefinedを返すので、そのチェックをする
    if (straightFlushCards.length === 0) {
      console.error('StraightFlush.find returned empty array');
      return 0;
    }
    const sortedCards = straightFlushCards.sort((a, b) => b.cardNumber - a.cardNumber);
    const isAceToFiveStraightFlush = Straight.isAceToFiveStraight(straightFlushCards);
    const highestCardNumber = isAceToFiveStraightFlush ? 5 : sortedCards[0].cardNumber;
    return StraightFlush.score * HAND_RANK_SCALE + highestCardNumber;
  }
}
