import { PokerCard } from '@/lib/domain/model/card';
import { Straight } from '@/lib/domain/model/hands/straight';
import { FullHouse } from '@/lib/domain/model/hands/fullHouse';
import { ThreeOfAKind } from '@/lib/domain/model/hands/threeOfAKind';
import { OnePair } from '@/lib/domain/model/hands/onePair';
import { RoyalStraightFlush } from '@/lib/domain/model/hands/royalStraightFlush';

describe('hands', () => {
  test('役の判定', () => {
    /**
     * 役：ワンペア
     * カード： 2H, 2D, 5S, 8C, JS
     */
    let cards = PokerCard.NewPokerCards('2H', '2D', '5S', '8C', 'JS');
    expect(FullHouse.isHand(cards)).toBe(false);
    expect(OnePair.isHand(cards)).toBe(true);
    //... 他の役のテスト

    /**
     * 役：スリーカード
     * カード： 2H, 2D, 2C, 8S, JS
     */
    cards = PokerCard.NewPokerCards('2H', '2D', '2C', '8S', 'JS');
    expect(FullHouse.isHand(cards)).toBe(false);
    expect(ThreeOfAKind.isHand(cards)).toBe(true);
    //... 他の役のテスト

    /**
     * 役：フルハウス
     * カード： 2H, 2D, 2C, 8S, 8D, 8C
     */
    cards = PokerCard.NewPokerCards('2H', '2D', '2C', '8S', '8D', '8C');
    expect(FullHouse.isHand(cards)).toBe(true);
    //... 他の役のテスト

    /**
     * 役：ストレート
     * カード： AH, 2D, 3C, 4S, 5C
     */
    cards = PokerCard.NewPokerCards('AH', '2D', '3C', '4S', '5C');
    expect(Straight.isHand(cards)).toBe(true);
    //... 他の役のテスト

    /**
     * 役：ロイヤルストレートフラッシュ
     * カード： 10H, JH, QH, KH, AH
     */
    cards = PokerCard.NewPokerCards('0H', 'JH', 'QH', 'KH', 'AH');
    expect(RoyalStraightFlush.isHand(cards)).toBe(true);
    //... 他の役のテスト
  });
});
