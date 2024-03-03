import { Player } from '@/lib/domain/model/players/player';
import {
  DistributionResult,
  GameResult,
  PlayerResult,
  WinLoseTie,
} from '@/lib/domain/model/game/texasHoldem/ultimate/types';
import { PokerHand } from '@/lib/domain/model/hands/pokerHand';

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
  HighCard = 0,
  OnePair = 0,
  TwoPair = 0,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 7,
  FullHouse = 8,
  FourOfAKind = 30,
  StraightFlush = 40,
  RoyalStraightFlush = 50,
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

  public betTrips(player: Player, betAmount: number): number {
    const trips = player.subtractFromStack(betAmount);
    const betRecord = this.getBetRecord(player);
    this.setBetRecord(player.id, { ...betRecord, trips });
    return trips;
  }

  public betPreFlop(player: Player, betMultiplier: 3 | 4): number {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet * betMultiplier);
    this.applyBet(player, betAmount);
    return betAmount;
  }

  public betFlop(player: Player): number {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet * 2);
    this.applyBet(player, betAmount);
    return betAmount;
  }

  public betTurnRiver(player: Player): number {
    const blindBet = this.getBlindBet(player);
    const betAmount = player.subtractFromStack(blindBet);
    this.applyBet(player, betAmount);
    return betAmount;
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

  /**
   * Blind, Anti, Trips, Playの配当を計算し、プレイヤーのスタックに加算する
   * @param gameResult
   */
  public distributeWinnings(gameResult: GameResult): DistributionResult[] {
    return gameResult.playerResults.map((playerResult: PlayerResult) => {
      const betRecord = this.getBetRecord(playerResult.player);

      const blindDistribution = this.calculateBlindDistribution(
        betRecord.blind,
        gameResult.dealerQualified,
        playerResult.result,
      );
      const antiDistribution = this.calculateAntiDistribution(
        playerResult,
        betRecord.anti,
      );
      const playDistribution = this.calculatePlayDistribution(
        playerResult,
        betRecord.play,
      );
      const tripsDistribution = this.calculateTripsDistribution(
        playerResult.hand.hand,
        betRecord.trips,
      );

      // Update player stack
      playerResult.player.addToStack(
        blindDistribution + antiDistribution + playDistribution + tripsDistribution,
      );

      // Reset bets for next round
      this.setBetRecord(playerResult.player.id, {
        ...betRecord,
        blind: 0,
        anti: 0,
        play: 0,
        trips: 0,
      });

      return {
        playerName: playerResult.player.name,
        blind: blindDistribution,
        anti: antiDistribution,
        trips: tripsDistribution,
        play: playDistribution,
      };
    });
  }

  /**
   *  以下に従いプレイヤーのブラインド配当を決定する
   * - ディーラーがクオリファイしていない: 勝敗に関わらず等倍
   * - ディーラーがクオリファイしている:
   *   - プレイヤーが勝利: 2倍
   *   - チョップ: 等倍
   *   - プレイヤーが敗北: 0倍
   */
  public calculateBlindDistribution(
    anti: number,
    isDealerQualified: boolean,
    result: WinLoseTie,
  ): number {
    if (!isDealerQualified) {
      return anti;
    }
    switch (result) {
      case 'win': {
        return anti * 2;
      }
      case 'tie': {
        return anti;
      }
      default: {
        return 0;
      }
    }
  }

  /**
   * 以下に従いプレイヤーのアンティ配当を決定する
   *  - プレイヤーが勝利: アンティレートの倍数分
   *  - チョップ: 等倍
   *  - プレイヤーが敗北: 0
   */
  public calculateAntiDistribution(playerResult: PlayerResult, blind: number): number {
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

  /**
   * 以下に従いプレイヤーのトリップス配当を決定する
   * - トリップスレートの倍数分(プレイヤーの勝敗に関わらない)
   * ※レート判定に用いている役はプレイヤーの完成役である
   * 実際のゲームではプレイヤーの勝敗に関わらないので、ボードのみで完成した最高役に関しても配当をもらえる場合があるが、
   * ボードの5枚よりプレイヤーのホールカード2枚を加えた役の強さは常にボード5枚からなる役の強さ以上なので、プレイヤーのハンドを用いて判定する
   */
  public calculateTripsDistribution(hand: PokerHand, trips: number): number {
    return Math.floor(TripsRate[hand.name as keyof typeof TripsRate] * trips);
  }

  /**
   * 以下に従いプレイヤーのプレイ配当を決定する
   * - プレイヤーが勝利: プレイベットの2倍
   * - チョップ: プレイベットの1倍
   * - プレイヤーが敗北: 0
   * @param playerResult
   * @param play
   */
  public calculatePlayDistribution(playerResult: PlayerResult, play: number): number {
    if (playerResult.result == 'lose') {
      return 0;
    }
    if (playerResult.result == 'tie') {
      return play;
    }

    return play * 2;
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
