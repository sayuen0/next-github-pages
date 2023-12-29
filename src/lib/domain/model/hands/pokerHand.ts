import { PokerCard } from '@/lib/domain/model/cards/card';

export enum PokerHandRank {
  ROYAL_STRAIGHT_FLUSH = 10,
  STRAIGHT_FLUSH = 9,
  FOUR_OF_A_KIND = 8,
  FULL_HOUSE = 7,
  FLUSH = 6,
  STRAIGHT = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}

/**
 役のスケール値
 役のスコア計算の際、異なる役間のスコアを比較するために用いる
 */
export const HAND_RANK_SCALE = 100_000_000_000;

export interface HandResult {
  hand: PokerHand;
  cards: PokerCard[];
}

/**
 * ポーカーの役を表す抽象クラス
 * このクラスを継承して、各役のクラスを作成する
 */
export abstract class PokerHand {
  static readonly score: PokerHandRank;

  public get name(): string {
    return this.constructor.name;
  }

  static isHand(card: PokerCard[]): boolean {
    throw new Error('Not implemented');
  }

  /*
  FIXME: findメソッドをPokerHandを継承している全クラスに実装を強制したいが、
  - static abstractはできない(TS1243)
  - インタフェースのimplementsはstaticメソッドに対してはできない(TS2564)
   */
  static find(cards: PokerCard[]): PokerCard[] {
    throw new Error('Not implemented');
  }

  // ペアをなしている2組を返す
  static findPairs(cards: PokerCard[]): Set<number> {
    const sortedCards = cards.sort((a, b) => b.cardNumber - a.cardNumber);
    let pairs = new Set<number>();

    for (let i = 0; i <= sortedCards.length - 2; i++) {
      if (sortedCards[i].cardNumber === sortedCards[i + 1].cardNumber) {
        pairs.add(sortedCards[i].cardNumber);
        i += 1; // Skip the next card that is part of the current pair
      }
    }

    return pairs; // Always return a Set (can be empty if no pairs are found)
  }

  // Helper method to group card by their number
  protected static groupByNumber(cards: PokerCard[]): { [key: number]: PokerCard[] } {
    return cards.reduce((groups: { [key: number]: PokerCard[] }, card: PokerCard) => {
      if (!groups[card.cardNumber]) {
        groups[card.cardNumber] = [];
      }
      groups[card.cardNumber].push(card);
      return groups;
    }, {});
  }

  // Checks if all the poker card have the same suit
  protected static areSameSuit(cards: PokerCard[]): boolean {
    const cardSuits = new Set(cards.map((card) => card.suit));
    return cardSuits.size === 1;
  }

  /*
    役の数値スコアを計算する <br>
    注意: ※その役が完成していると保証されていない状態で呼び出してはいけない。
    例えばハイカードのカードセットに対してストレートのスコア計算をしてもストレート完成を前提とした計算になってしまう。
   */
  public abstract calculateScore(cards: PokerCard[]): number;
}
