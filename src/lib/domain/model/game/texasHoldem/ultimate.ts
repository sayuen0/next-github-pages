import { PokerCard } from '@/lib/domain/model/cards/card';
import Deck from '@/lib/domain/model/cards/deck';

/**
 * シングルプレイのみを想定
 */
export class UltimateTexasHoldem {
  private playerHand: PokerCard[];
  private dealerHand: PokerCard[];
  private communityCards: PokerCard[];
  private deck: Deck;

  constructor() {
    this.deck = new Deck();
    this.playerHand = [];
    this.dealerHand = [];
    this.communityCards = [];
  }

  public startNewRound(): void {
    this.playerHand = [];
    this.dealerHand = [];
    this.communityCards = [];
    this.deck = new Deck();
    this.deck.shuffle();

    // プレイヤーに2枚のカードを配る
    for (let i = 0; i < 2; i++) {
      const card = this.deck.drawTop();
      if (card) {
        card.visible = true; // プレイヤーのカードは可視
        this.playerHand.push(card);
      }
    }

    // ディーラーに2枚のカードを配る
    for (let i = 0; i < 2; i++) {
      const card = this.deck.drawTop();
      if (card) {
        card.visible = false; // 最初のカードのみ可視（または全て不可視）
        this.dealerHand.push(card);
      }
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

  public shuffleDeck(): void {
    this.deck.shuffle();
  }

  public openDealerCard(): void {
    this.dealerHand.forEach((c) => (c.visible = true));
  }

  private dealCommunityCard(): void {
    const card = this.deck.drawTop();
    if (card) {
      card.visible = true; // コミュニティカードを可視に設定
      this.communityCards.push(card);
    }
  }
}
