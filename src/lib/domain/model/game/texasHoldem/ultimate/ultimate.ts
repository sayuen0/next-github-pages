import { PokerCard } from '@/lib/domain/model/cards/card';
import Deck from '@/lib/domain/model/cards/deck';
import { HandResult, PokerHand } from '@/lib/domain/model/hands/pokerHand';
import { Player } from '@/lib/domain/model/players/player';
import { OnePair } from '@/lib/domain/model/hands/onePair';
import { HandEvaluator } from '@/lib/domain/model/hands/handEvaluator';
import { BetTable } from '@/lib/domain/model/game/texasHoldem/ultimate/betTable';
import {
  GameResult,
  WinLoseTie,
} from '@/lib/domain/model/game/texasHoldem/ultimate/types';

// ゲームの進行状態を示すenum
export enum GamePhase {
  Start = 1,
  PreFlop,
  Flop,
  TurnRiver,
  ShowDown,
}

export type GamePhaseString = keyof typeof GamePhase;

export function getGamePhaseString(state: GamePhase): GamePhaseString {
  return GamePhase[state] as GamePhaseString;
}

/**
 * 多人数のアルティメットポーカーを想定
 */
export class UltimateTexasHoldem {
  private state: GamePhase;
  private players: Player[];
  private dealer: Player;
  private deck: Deck;
  private _betTable: BetTable;

  constructor(dealer: Player, ...players: Player[]) {
    if (players.length == 0) {
      throw new Error('プレイヤーがいません');
    }
    this._betTable = new BetTable(players);
    this.dealer = dealer;
    this.players = players;
    this._communityCards = [];
    this.deck = new Deck();
    this.state = GamePhase.Start;
  }

  public get gameState(): GamePhase {
    return this.state;
  }

  private _communityCards: PokerCard[];

  public get communityCards(): PokerCard[] {
    return this._communityCards;
  }

  /*
   * 新しいラウンドを開始する
   * - プレイヤーの手札をリセットする
   * - コミュニティカードをリセットする
   * - デッキをシャッフルする
   *
   */
  public startNewRound(): void {
    this.allPlayers().forEach((p) => {
      p.resetHoleCard();
      p.fold = false;
    });
    this._communityCards = [];
    this.deck = new Deck();
    this.deck.shuffle();
    this.state = GamePhase.Start;
  }

  // プレイヤーに"順に"2枚のカードを配る
  public dealPreFlop(): void {
    // ステータスがStartでない場合はエラー
    this.checkGameState(GamePhase.Start, 'dealPreFlop');

    for (let i = 0; i < 2; i++) {
      this.allPlayers().forEach((p) => {
        const card = this.deck.drawTop();
        if (card) {
          card.visible = true;
          p.addHoleCard(card);
        }
      });
    }

    // 配り終えたら自身のステートを進める
    this.proceedGameState();
  }

  public dealFlop(): void {
    // ステートがPreFlopでない場合はエラー
    this.checkGameState(GamePhase.PreFlop, 'dealFlop');

    for (let i = 0; i < 3; i++) {
      const card = this.deck.drawTop();
      if (card) {
        card.visible = true; // コミュニティカードを可視に設定
        this._communityCards.push(card);
      }
    }

    // 配り終えたら自身のステートを進める
    this.proceedGameState();
  }

  public fold(player: Player): void {
    player.fold = true;
  }

  public dealTurnRiver(): void {
    this.checkGameState(GamePhase.Flop, 'dealTurnRiver');

    this.dealCommunityCard();
    this.dealCommunityCard();

    this.proceedGameState();
  }

  public showDown(): void {
    this.checkGameState(GamePhase.TurnRiver, 'showDown');

    this.dealer.showDown();
    this.proceedGameState();
  }

  /**
   * プレイヤーのハンドとコミュニティカードから結果を返す
   * @param p
   */
  public evaluatePlayerHand(p: Player): HandResult {
    this.checkGameState(GamePhase.ShowDown, 'evaluatePlayerHand');
    return HandEvaluator.evaluateHand([...p.holeCard, ...this._communityCards]);
  }

  public evaluateDealerHand(): HandResult {
    return this.evaluatePlayerHand(this.dealer);
  }

  // 勝者を決定する
  public defineGameResult(): GameResult {
    // 自身のステータスがShowDownでない場合はエラー
    this.checkGameState(GamePhase.ShowDown, 'defineGameResult');

    // ショーダウン
    this.allPlayers().forEach((p) => p.showDown());

    // ディーラースコアの決定
    const dealerHandResult = this.evaluateDealerHand();
    const dealerScore = dealerHandResult.hand.calculateScore(dealerHandResult.cards);
    const dealerQualified = this.isDealerQualified(dealerHandResult);

    // プレイヤースコアの決定
    const playerResults = this.players.map((player) => {
      const playerHandResult = this.evaluatePlayerHand(player);
      const playerScore = playerHandResult.hand.calculateScore(playerHandResult.cards);

      // フォールドしたプレイヤーは敗北
      if (player.fold) {
        return {
          player: player,
          hand: playerHandResult,
          result: 'lose' as WinLoseTie,
        };
      }

      let result: WinLoseTie;
      if (playerScore > dealerScore) {
        result = 'win';
      } else if (playerScore < dealerScore) {
        result = 'lose';
      } else {
        result = 'tie';
      }

      return {
        player: player,
        hand: playerHandResult,
        result: result,
      };
    });

    return {
      communityCards: this._communityCards,
      playerResults: playerResults,
      dealerResult: dealerHandResult,
      dealerQualified: dealerQualified,
    };
  }

  /**
   * ゲームの配当を決定する
   * @param gameResult
   */
  public distributeWinnings(gameResult: GameResult): void {
    this.checkGameState(GamePhase.ShowDown, 'distributeWinnings');

    return this._betTable.distributeWinnings(gameResult);
  }

  public betBlindAndAnti(player: Player, blind: number): void {
    this.checkGameState(GamePhase.Start, 'betBlindAndAnti');

    this._betTable.betBlindAndAnti(player, blind);
  }

  public betTrips(player: Player, trips: number): number {
    this.checkGameState(GamePhase.Start, 'betTrips');
    return this._betTable.betTrips(player, trips);
  }

  public betPreFlop(player: Player, multiplier: 3 | 4): number {
    this.checkGameState(GamePhase.PreFlop, 'betPreFlop');
    return this._betTable.betPreFlop(player, multiplier);
  }

  public betFlop(player: Player): number {
    this.checkGameState(GamePhase.Flop, 'betFlop');
    return this._betTable.betFlop(player);
  }

  public betTurnRiver(player: Player): number {
    this.checkGameState(GamePhase.TurnRiver, 'betTurnRiver');
    return this._betTable.betTurnRiver(player);
  }

  // 自身のゲームステートを進め、次のゲームステートを返す
  private proceedGameState(): GamePhase {
    // ショーダウンだけスタートに戻す
    if (this.state === GamePhase.ShowDown) {
      this.state = GamePhase.Start;
      return this.state;
    }
    this.state++;
    return this.state;
  }

  private allPlayers(): Player[] {
    return [...this.players, this.dealer];
  }

  // ディーラーの手のスコアがワンペア以上の場合にクオリファイとみなす
  private isDealerQualified(dealerHandResult: {
    hand: PokerHand;
    cards: PokerCard[];
  }): boolean {
    return !(
      dealerHandResult.hand.calculateScore(dealerHandResult.cards) < OnePair.baseScore
    );
  }

  private dealCommunityCard(): void {
    const card = this.deck.drawTop();
    const newArr = [...this._communityCards];
    if (card) {
      card.visible = true; // コミュニティカードを可視に設定
      newArr.push(card);
    }
    this._communityCards = newArr;
  }

  private checkGameState(expectedState: GamePhase, action: string): void {
    if (this.state !== expectedState) {
      throw new Error(
        `ゲームステートが${expectedState}ではありません。${action}は実行できません。`,
      );
    }
  }
}
