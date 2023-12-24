import { PokerCard } from '@/lib/domain/model/cards/card';
import Deck from '@/lib/domain/model/cards/deck';
import { HandResult, PokerHand } from '@/lib/domain/model/hands/pokerHand';
import { Player } from '@/lib/domain/model/players/player';
import { OnePair } from '@/lib/domain/model/hands/onePair';
import { HandEvaluator } from '@/lib/domain/model/hands/handEvaluator';

export interface GameResult {
  communityCards: PokerCard[];
  playerResults: PlayerResult[];
  dealerResult: HandResult;
  dealerQualified: boolean;
}

export interface PlayerResult {
  player: Player;
  hand: HandResult;
  result: 'win' | 'lose' | 'tie';
}

/**
 * 多人数のアルティメットポーカーを想定
 */
export class UltimateTexasHoldem {
  private players: Player[];
  private dealer: Player;
  private communityCards: PokerCard[];
  private deck: Deck;

  constructor(dealer: Player, ...players: Player[]) {
    if (players.length == 0) {
      throw new Error('プレイヤーがいません');
    }
    this.dealer = dealer;
    this.players = players;
    this.communityCards = [];
    this.deck = new Deck();
  }

  public startNewRound(): void {
    const allPlayers = [...this.players, this.dealer];
    allPlayers.forEach((p) => p.resetHoleCard());
    this.communityCards = [];
    this.deck = new Deck();
    this.deck.shuffle();

    // プレイヤーに"順に"2枚のカードを配る
    for (let i = 0; i < 2; i++) {
      allPlayers.forEach((p) => {
        const card = this.deck.drawTop();
        if (card) {
          p.addHoleCard(card);
        }
      });
    }
  }

  public dealFlop(): void {
    for (let i = 0; i < 3; i++) {
      const card = this.deck.drawTop();
      if (card) {
        card.visible = true; // コミュニティカードを可視に設定
        this.communityCards.push(card);
      }
    }
  }

  public dealTurn(): void {
    this.dealCommunityCard();
  }

  public dealRiver(): void {
    this.dealCommunityCard();
  }

  public openDealerCard(): void {
    this.dealer.showDown();
  }

  /**
   * プレイヤーのハンドとコミュニティカードから結果を返す
   * @param p
   */
  public evaluatePlayerHand(p: Player): HandResult {
    return HandEvaluator.evaluateHand([...p.holeCard, ...this.communityCards]);
  }

  public evaluateDealerHand(): HandResult {
    return this.evaluatePlayerHand(this.dealer);
  }

  // 勝者を決定する
  public defineWinner(): GameResult {
    // ショーダウン
    const allPlayers = [this.dealer, ...this.players];
    allPlayers.forEach((p) => p.showDown());

    // ディーラースコアの決定
    const dealerHandResult = this.evaluateDealerHand();
    const dealerScore = dealerHandResult.hand.calculateScore(dealerHandResult.cards);
    const dealerQualified = this.isDealerQualified(dealerHandResult);

    // プレイヤースコアの決定
    const playerResults = this.players.map((player) => {
      const playerHandResult = this.evaluatePlayerHand(player);
      const playerScore = playerHandResult.hand.calculateScore(playerHandResult.cards);

      let result: 'win' | 'lose' | 'tie';
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
      communityCards: this.communityCards,
      playerResults: playerResults,
      dealerResult: dealerHandResult,
      dealerQualified: dealerQualified,
    };
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
    if (card) {
      card.visible = true; // コミュニティカードを可視に設定
      this.communityCards.push(card);
    }
  }
}
