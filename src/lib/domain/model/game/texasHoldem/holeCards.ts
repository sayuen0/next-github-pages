import { PokerCard } from '@/lib/domain/model/cards/card';

/**
 * 手札を表現する型
 */
const handRanges = [
  // ペア
  'AA',
  'KK',
  'QQ',
  'JJ',
  '00',
  '99',
  '88',
  '77',
  '66',
  '55',
  '44',
  '33',
  '22',

  // 異なるランクのスーテッドとオフスーツ
  'AKs',
  'AQs',
  'AJs',
  'A0s',
  'A9s',
  'A8s',
  'A7s',
  'A6s',
  'A5s',
  'A4s',
  'A3s',
  'A2s',
  'AKo',
  'AQo',
  'AJo',
  'A0o',
  'A9o',
  'A8o',
  'A7o',
  'A6o',
  'A5o',
  'A4o',
  'A3o',
  'A2o',
  'KQs',
  'KJs',
  'K0s',
  'K9s',
  'K8s',
  'K7s',
  'K6s',
  'K5s',
  'K4s',
  'K3s',
  'K2s',
  'KQo',
  'KJo',
  'K0o',
  'K9o',
  'K8o',
  'K7o',
  'K6o',
  'K5o',
  'K4o',
  'K3o',
  'K2o',
  'QJs',
  'Q0s',
  'Q9s',
  'Q8s',
  'Q7s',
  'Q6s',
  'Q5s',
  'Q4s',
  'Q3s',
  'Q2s',
  'QJo',
  'Q0o',
  'Q9o',
  'Q8o',
  'Q7o',
  'Q6o',
  'Q5o',
  'Q4o',
  'Q3o',
  'Q2o',
  'J0s',
  'J9s',
  'J8s',
  'J7s',
  'J6s',
  'J5s',
  'J4s',
  'J3s',
  'J2s',
  'J0o',
  'J9o',
  'J8o',
  'J7o',
  'J6o',
  'J5o',
  'J4o',
  'J3o',
  'J2o',
  '09s',
  '08s',
  '07s',
  '06s',
  '05s',
  '04s',
  '03s',
  '02s',
  '09o',
  '08o',
  '07o',
  '06o',
  '05o',
  '04o',
  '03o',
  '02o',
  '98s',
  '97s',
  '96s',
  '95s',
  '94s',
  '93s',
  '92s',
  '98o',
  '97o',
  '96o',
  '95o',
  '94o',
  '93o',
  '92o',
  '87s',
  '86s',
  '85s',
  '84s',
  '83s',
  '82s',
  '87o',
  '86o',
  '85o',
  '84o',
  '83o',
  '82o',
  '76s',
  '75s',
  '74s',
  '73s',
  '72s',
  '76o',
  '75o',
  '74o',
  '73o',
  '72o',
  '65s',
  '64s',
  '63s',
  '62s',
  '65o',
  '64o',
  '63o',
  '62o',
  '54s',
  '53s',
  '52s',
  '54o',
  '53o',
  '52o',
  '43s',
  '42s',
  '43o',
  '42o',
  '32s',
  '32o',
];

export type HandRange = (typeof handRanges)[number];

const should4BetRange: HandRange[] = [
  // pocket pair(except 22)
  'AA',
  'KK',
  'QQ',
  'JJ',
  '00',
  '99',
  '88',
  '77',
  '66',
  '55',
  '44',
  '33',

  // ace any high

  'AKs',
  'AQs',
  'AJs',
  'A0s',
  'A9s',
  'A8s',
  'A7s',
  'A6s',
  'A5s',
  'A4s',
  'A3s',
  'A2s',
  'AKo',
  'AQo',
  'AJo',
  'A0o',
  'A9o',
  'A8o',
  'A7o',
  'A6o',
  'A5o',
  'A4o',
  'A3o',
  'A2o',

  // king any suited and king gte 5 off-suit
  'KQs',
  'KJs',
  'K0s',
  'K9s',
  'K8s',
  'K7s',
  'K6s',
  'K5s',
  'K4s',
  'K3s',
  'K2s',
  'KQo',
  'KJo',
  'K0o',
  'K9o',
  'K8o',
  'K7o',
  'K6o',
  'K5o',

  // queen gte 6 suited and queen gte 8 off-suit
  'QJs',
  'Q0s',
  'Q9s',
  'Q8s',
  'Q7s',
  'Q6s',
  'QJo',
  'Q0o',
  'Q9o',
  'Q8o',

  // jack gte 8 suited and jack 10 off-suit
  'J0s',
  'J9s',
  'J8s',
  'J0o',
];

export const should4BetRangeSet = new Set(should4BetRange);

/**
 * ホールカード(手札)を表すクラス
 */
export class HoleCards {
  private card1: PokerCard;
  private card2: PokerCard;

  constructor(card1: PokerCard, card2: PokerCard) {
    this.card1 = card1;
    this.card2 = card2;
  }

  get cards(): [PokerCard, PokerCard] {
    return [this.card1, this.card2];
  }

  static handRangeFrom(card1: PokerCard, card2: PokerCard): HandRange {
    // カード2枚を与えて、それに相当するハンドレンジを返す
    // 例；ASとKSを与えると、AKsを返す
    // 例；ASとKDを与えると、AKoを返す

    // 先に、card1とcard2のどちらが大きいかを判定して、2の方が大きかったらスワップ
    if (card1.cardNumber < card2.cardNumber) {
      [card1, card2] = [card2, card1];
    }

    if (card1.numberSymbol === card2.numberSymbol) {
      return `${card1.numberSymbol}${card2.numberSymbol}`;
    } else if (card1.suit === card2.suit) {
      return `${card1.numberSymbol}${card2.numberSymbol}s`;
    } else {
      return `${card1.numberSymbol}${card2.numberSymbol}o`;
    }
  }

  isPocketPair(): boolean {
    return this.card1.cardNumber === this.card2.cardNumber;
  }

  isSuited(): boolean {
    return this.card1.suit === this.card2.suit;
  }
}
