// 単一のゲームをデモンストレートする
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import assert from 'node:assert';
import { Player } from '@/lib/domain/model/players/player';

describe('single game with bet', () => {
  it('should run a single game without errors', () => {
    const baseStack = 30000;
    const [p1, p2, p3, p4] = ['A', 'B', 'C', 'D'].map(
      (name) => new Player(name, baseStack),
    );
    const game = new UltimateTexasHoldem(
      new Player('dealer', 1000000000000),
      p1,
      p2,
      p3,
      p4,
    );

    /*
      before deal
     */
    game.startNewRound();

    // TODO: ゲームに参加できるか(bb+ anti + bb * 3)を持っているかを判定する
    game.betTable.betBlindAndAnti(p1, 100);
    game.betTable.betBlindAndAnti(p2, 100);
    game.betTable.betBlindAndAnti(p3, 100);
    game.betTable.betBlindAndAnti(p4, 100);

    game.betTable.betTrips(p1, 100);
    game.betTable.betTrips(p2, 100);
    game.betTable.betTrips(p3, 100);
    game.betTable.betTrips(p4, 100);

    /*
      no more bet (preflop)
     */
    game.dealPreFlop();
    game.betTable.betPreFlop(p1, 3);
    game.betTable.betPreFlop(p2, 4);
    // 3と4はチェック

    /*
     * flop
     */
    game.dealFlop();
    game.betTable.betFlop(p3);

    /**
     * turn And River
     */
    game.dealTurnRiver();
    // 4がフォールド
    game.fold(p4);

    game.openDealerCard();

    const result = game.defineWinner();

    assert(true, 'Single game test completed successfully');
  });
});
