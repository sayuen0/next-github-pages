import { Player } from '@/lib/domain/model/players/player';
import { Blackjack } from '@/lib/domain/model/game/blackJack/blackjack';
import assert from 'node:assert';

describe('ゲーム進行', () => {
  const baseStack = 1000;
  const [p1, p2, p3, p4] = ['A', 'B', 'C', 'D'].map(
    (name) => new Player(name, baseStack),
  );
  const game = new Blackjack(new Player('dealer', 1000000000000), [p1, p2, p3, p4]);
  const n = game.startGame();
  game.dealCards();

  it('should deal 2 cards to each player', () => {
    game.player.forEach((player) => {
      assert.strictEqual(player.holeCard.length, 2);
    });
  });

  it('should deal 1 card to each player', () => {
    // プレイヤーA, Bはもう一枚引く（ヒットする)
    game.hit(p1);
    game.hit(p2);
    assert.strictEqual(p1.holeCard.length, 3);
    assert.strictEqual(p2.holeCard.length, 3);
  });

  assert(true);
});
