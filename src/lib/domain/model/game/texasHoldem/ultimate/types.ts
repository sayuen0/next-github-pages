// 循環参照を防止するため共通で使うモジュールはここに配置

import { PokerCard } from '@/lib/domain/model/cards/card';
import { HandResult } from '@/lib/domain/model/hands/pokerHand';
import { Player } from '@/lib/domain/model/players/player';

export interface GameResult {
  communityCards: PokerCard[];
  playerResults: PlayerResult[];
  dealerResult: HandResult;
  dealerQualified: boolean;
}

export type WinLoseTie = 'win' | 'lose' | 'tie';

export interface PlayerResult {
  player: Player;
  hand: HandResult;
  result: WinLoseTie;
}

export function prettyPrint(result: GameResult): string {
  // 「プレイヤーAのどの5枚のカードで何の役が完成、ディーラーはどの5枚のカードで何の役が完成、プレイヤーはディーラーに勝利or敗北」
  // という情報を出力する
  // 例: プレイヤーA: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, ディーラー: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, プレイヤーはディーラーに勝利
  // 例: プレイヤーA: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, ディーラー: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, プレイヤーはディーラーと引き分け
  // 例: プレイヤーA: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, ディーラー: [♠A, ♠K, ♠Q, ♠J, ♠10] ロイヤルストレートフラッシュ, プレイヤーはディーラーに敗北
  const playerResults = result.playerResults.map((r) => {
    return `${r.player.name}: [${r.hand.cards.map((c) => c.cardValue).join(', ')}] ${
      r.hand.hand.name
    }`;
  });
  const dealerResult = `ディーラー: [${result.dealerResult.cards
    .map((c) => c.cardValue)
    .join(', ')}] ${result.dealerResult.hand.name} `;
  const dealerQualified = result.dealerQualified
    ? 'ディーラーはクオリファイ'
    : 'ディーラーはノンクオリファイ';
  const playerResult = result.playerResults[0].result;
  const winLoseTie =
    playerResult === 'win'
      ? 'プレイヤーはディーラーに勝利'
      : playerResult === 'lose'
      ? 'プレイヤーはディーラーに敗北'
      : 'プレイヤーはディーラーと引き分け';
  return `${playerResults.join(
    ', ',
  )}, ${dealerResult}\n${dealerQualified}\n${winLoseTie}`;
}
