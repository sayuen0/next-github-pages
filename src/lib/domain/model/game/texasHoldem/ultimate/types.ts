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
