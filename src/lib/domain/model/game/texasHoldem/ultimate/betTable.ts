import { Player } from '@/lib/domain/model/players/player';
import {
  GameResult,
  PlayerResult,
} from '@/lib/domain/model/game/texasHoldem/ultimate/types';

interface BetBlock {
  playerID: string;
  blind: number;
  anti: number;
  trips: number;
  play: number;
}

enum BlindRate {
  HighCard = 1,
  OnePair = 1,
  TwoPair = 1,
  ThreeOfAKind = 1,
  Straight = 2,
  Flush = 2.5,
  FullHouse = 4,
  FourOfAKind = 11,
  StraightFlush = 51,
  RoyalStraightFlush = 501,
}

enum TripsRate {
  HighCard = 1,
  OnePair = 1,
  TwoPair = 1,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 8,
  FullHouse = 9,
  FourOfAKind = 31,
  StraightFlush = 41,
  RoyalStraightFlush = 51,
}

/**
 * 掛け額を管理するクラス
 */
export class BetTable {
  private betBlocks: BetBlock[];

  constructor(players: Player[]) {
    this.betBlocks = players.reduce((acc, p) => {
      acc.push({ playerID: p.id, play: 0, blind: 0, anti: 0, trips: 0 });
      return acc;
    }, new Array<BetBlock>());
  }

  /**
   *
   * @param player 誰がベットするか
   * @param singleAmount Blindにこの額をかけ、アンティにこの額をかけるので、プレイヤーはこの額の2倍をベットする
   */
  public betBlindAndAnti(player: Player, singleAmount: number): void {
    let betAmount = player.subtractFromStack(singleAmount * 2);
    // スタックが奇数だった場合、1点をプレイヤーに返却
    if (betAmount % 2 !== 0) {
      player.addToStack(1);
      betAmount -= 1;
    }

    const betRecord = this.getBetRecord(player);
    this.setBetRecord(player.id, {
      ...betRecord,
      blind: betAmount / 2,
      anti: betAmount / 2,
    });
  }

  public betTrips(player: Player, betAmount: number): void {
    const trips = player.subtractFromStack(betAmount);
    const betRecord = this.getBetRecord(player);
    this.setBetRecord(player.id, { ...betRecord, trips });
  }

  public betPreFlop(player: Player, betMultiplier: 3 | 4): void {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet * betMultiplier);
    this.applyBet(player, betAmount);
  }

  public betFlop(player: Player): void {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet * 2);
    this.applyBet(player, betAmount);
  }

  public betTurnRiver(player: Player): void {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet);
    this.applyBet(player, betAmount);
  }

  public getBetRecord(player: Player): BetBlock {
    const betRecord = this.betBlocks.find((b) => b.playerID === player.id);
    if (!betRecord) {
      throw new Error(`プレイヤーID=${player.id} のプレイヤーがいません`);
    }
    return betRecord;
  }

  /**
   * イミュータブルに、BetRecordをPlayerIDを用いて特定して更新する
   */
  public setBetRecord(playerID: string, betRecord: BetBlock): void {
    this.betBlocks = this.betBlocks.map((b) => {
      if (b.playerID === playerID) {
        return betRecord;
      }
      return b;
    });
  }

  public distributeWinnings(gameResult: GameResult): void {
    gameResult.playerResults.forEach((playerResult: PlayerResult) => {
      const betRecord = this.getBetRecord(playerResult.player);

      // 敗北
      betRecord.blind = 0;
      betRecord.anti = 0;
      betRecord.play = 0;
      betRecord.trips = 0;
    });
  }

  /**
   *  以下に従いプレイヤーのアンティ配当を決定する
   * - ディーラーがクオリファイしていない: 等倍
   * - ディーラーがクオリファイしている:
   *   - プレイヤーが勝利: 2倍
   *   - プレイヤーが敗北: 0倍
   */
  public calculateAntiDistribution(
    anti: number,
    isDealerQualified: boolean,
    win: boolean,
  ): number {
    if (!isDealerQualified) {
      return anti;
    }
    if (win) {
      return anti * 2;
    }
    return 0;
  }

  /**
   * 以下に従いプレイヤーのブラインド配当を決定する
   *  - プレイヤーが勝利: ブラインドレートの倍数分
   *  - プレイヤーが敗北: 0
   */
  private calculateBlindDistribution(playerResult: PlayerResult, blind: number): number {
    if (playerResult.result == 'lose') {
      return 0;
    }
    if (playerResult.result == 'tie') {
      return blind;
    }

    return Math.floor(
      BlindRate[playerResult.hand.hand.name as keyof typeof BlindRate] * blind,
    );
  }

  private getBlindBet(player: Player): number {
    const blindBet = this.betBlocks.find((b) => b.playerID === player.id)?.blind;
    if (!blindBet) {
      throw new Error(`プレイヤーID=${player.id} のブラインドベットが見つかりません`);
    }
    return blindBet;
  }

  private applyBet(player: Player, betAmount: number): void {
    const betRecord = this.getBetRecord(player);
    if (betRecord.play > 0) {
      // すでにベットしてたらベットできない。スルーする
      return;
    }
    this.setBetRecord(player.id, { ...betRecord, play: betAmount });
  }
}
