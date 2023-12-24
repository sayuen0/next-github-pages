import { Player } from '@/lib/domain/model/players/player';

interface BetBlock {
  playerID: string;
  blind: number;
  anti: number;
  trips: number;
  play: number;
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
    const betAmount = player.subtractFromStack(singleAmount * 2);
    const betRecord = this.getBetRecord(player);
    // 上で2倍しているので常に偶数になる
    betRecord.blind = betAmount / 2;
    betRecord.anti = betAmount / 2;
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

  private getBlindBet(player: Player): number {
    const blindBet = this.betBlocks.find((b) => b.playerID === player.id)?.blind;
    if (!blindBet) {
      throw new Error(`プレイヤーID=${player.id} のブラインドベットが見つかりません`);
    }
    return blindBet;
  }

  private applyBet(player: Player, betAmount: number): void {
    const betRecord = this.getBetRecord(player);
    betRecord.play += betAmount;
  }
}
