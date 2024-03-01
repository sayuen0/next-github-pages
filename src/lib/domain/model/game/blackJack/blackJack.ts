import { PokerCard } from '@/lib/domain/model/cards/card';
import { Player } from '@/lib/domain/model/players/player';
import Deck from '@/lib/domain/model/cards/deck';

/**
 * ブラックジャックのゲームを行うクラス
 */
export class Blackjack {
  /**
   * カードの束
   * 52よりはるかに多い、複数デッキからなる
   */
  private decks: PokerCard[] = [];

  /**
   * ディーラー
   */
  private dealer: Player;
  /**
   * プレイヤー(複数参加可能)
   */
  private players: {
    id: string;
    player: Player;
    doubled: boolean;
  }[] = [];

  constructor(dealer: Player, players: Player[]) {
    this.decks = this.createDecks();
    this.dealer = dealer;
    this.players = players.map((p) => ({ id: p.id, player: p, doubled: false }));
  }

  public get player(): Player[] {
    return this.players.map((p) => p.player);
  }

  /**
   * ゲームを開始する
   * バーンカードで消費したカード枚数を返す
   */
  public startGame(): number {
    return this.burnCard();
  }

  public dealCards(): void {
    // プレイヤーA,プレイヤーB、ディーラーの順番で1枚ずつカードを配る
    this.players.forEach((player) => {
      const p = player.player;
      const c = this.decks.shift()!;
      c.visible = true;
      p.addHoleCard(c);
    });
    const c = this.decks.shift()!;
    c.visible = true;
    this.dealer.addHoleCard(c);
    // 2枚目も同様に配る
    this.players.forEach((player) => {
      const p = player.player;
      const c = this.decks.shift()!;
      c.visible = true;
      p.addHoleCard(c);
    });
  }

  public isBlackjack(player: Player): boolean {
    // カードが2枚で、Aと10,J,Q,Kの組み合わせである場合
    if (player.holeCard.length !== 2) {
      return false;
    }
    return this.calculateScore(player) === 21;
  }

  public hit(player: Player): void {
    const card = this.decks.shift()!;
    card.visible = true;
    player.addHoleCard(card);
  }

  public stand(player: Player): void {
    // 何もしない
  }

  public doubleDown(player: Player): void {
    const card = this.decks.shift()!;
    card.visible = true;
    player.addHoleCard(card);

    // このプレイヤーはもうカードを引けない
  }

  /**
   * デッキを生成する
   * @private
   */
  private createDecks(): PokerCard[] {
    // 複数枚デッキを連ねて、それらをシャッフルする
    // ここでは6デッキとする
    const decks: PokerCard[] = [];
    for (let i = 0; i < 6; i++) {
      decks.push(...this.createDeck());
    }
    // シャッフルする。偏りのないように
    for (let i = 0; i < 6 * 52; i++) {
      const n1 = Math.floor(Math.random() * decks.length);
      const n2 = Math.floor(Math.random() * decks.length);
      const tmp = decks[n1];
      decks[n1] = decks[n2];
      decks[n2] = tmp;
    }

    return decks;
  }

  /**
   * デッキを生成する
   * @private
   */
  private createDeck(): PokerCard[] {
    const deck = new Deck();
    deck.shuffle();
    return deck.drawTopN(52);
  }

  /**
   * カードをバーンする
   * その枚数を返す
   * @private
   */
  private burnCard(): number {
    // 先頭一枚を引いて捨てる
    const card = this.decks.shift();
    // そのカードの数値を参照
    const n = card?.cardNumber;
    // その数値のカードを引いて捨てる
    for (let i = 0; i < n!; i++) {
      this.decks.shift();
    }
    return n ?? 0;
  }

  private calculateScore(player: Player): number {
    // ピクチャーカード(10,11,12,13)は10として扱う
    const cards = player.holeCard;
    const score = cards.reduce((acc, c) => {
      if (c.cardNumber >= 10) {
        return acc + 10;
      }
      return acc + c.cardNumber;
    }, 0);
    // エースは11として扱うが、21を超える場合は1として扱う
    const aceCount = cards.filter((c) => c.cardNumber === 1).length;
    for (let i = 0; i < aceCount; i++) {
      if (score + 10 <= 21) {
        return score + 10;
      }
    }
    return score;
  }
}
