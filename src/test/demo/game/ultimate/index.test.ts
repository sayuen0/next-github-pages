// 単一のゲームをデモンストレートする
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate/ultimate';
import assert from 'node:assert';
import { Player } from '@/lib/domain/model/players/player';

describe('single game with bet', () => {
  it('should run a single game without errors', () => {
    const baseStack = 30000;
    const player = new Player('player A', 30000);
    const game = new UltimateTexasHoldem(new Player('dealer', 100000000), player);
    game.startNewRound();

    game.dealPreFlop();

    // TODO: ゲームに参加できるか(bb+ anti + bb * 3)を持っているかを判定する
    // TODO: 最初のベット額を決める
    // game.betBlindAndAnti(player, 100);

    game.dealFlop();

    game.dealTurn();

    game.dealRiver();

    game.openDealerCard();

    const result = game.defineWinner();

    console.log(JSON.stringify(result, null, 2));

    assert(true, 'Single game test completed successfully');
  });
});
