import { PokerCard } from '@/lib/domain/model/cards/card';
import { PokerHand } from '@/lib/domain/model/hands/pokerHand';
import { RoyalStraightFlush } from '@/lib/domain/model/hands/royalStraightFlush';
import { HighCard } from '@/lib/domain/model/hands/highCard';
import { StraightFlush } from '@/lib/domain/model/hands/straightFlush';
import { FourOfAKind } from '@/lib/domain/model/hands/forOfAKind';
import { FullHouse } from '@/lib/domain/model/hands/fullHouse';
import { Flush } from '@/lib/domain/model/hands/flush';
import { Straight } from '@/lib/domain/model/hands/straight';
import { ThreeOfAKind } from '@/lib/domain/model/hands/threeOfAKind';
import { TwoPair } from '@/lib/domain/model/hands/twoPair';
import { OnePair } from '@/lib/domain/model/hands/onePair';

/**
 *
 */
class HandEvaluator {
  static evaluateHand(cards: PokerCard[]): { hand: PokerHand; cards: PokerCard[] } {
    // 1. 各ポーカーハンドの 'isHand' メソッドを使用して、カードセットが特定のハンドに該当するかをチェック
    // 2. 該当するハンドが見つかった場合、そのハンドの 'find' メソッドを使用して構成カードを取得
    // 3. ハンドと構成カードを返す

    const hands = [
      RoyalStraightFlush,
      StraightFlush,
      FourOfAKind,
      FullHouse,
      Flush,
      Straight,
      ThreeOfAKind,
      TwoPair,
      OnePair,
      HighCard,
    ];

    for (const Hand of hands) {
      if (Hand.isHand(cards)) {
        return { hand: Hand, cards: Hand.find(cards) };
      }
    }

    // ...他のハンドのチェック...
    // ハイカードのチェック
    return { hand: HighCard, cards: HighCard.find(cards) };
  }
}
