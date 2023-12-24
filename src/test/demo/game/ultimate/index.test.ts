// 単一のゲームをデモンストレートする
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate';
import assert from 'node:assert';
import { Player } from '@/lib/domain/model/players/player';

describe('single game without bet', () => {
  it('should run a single game without errors', () => {
    const baseStack = 30000;
    const player = new Player('player A', 30000);
    const game = new UltimateTexasHoldem(new Player('dealer', 100000000), player);
    game.startNewRound();

    game.dealFlop();

    game.dealTurn();

    game.dealRiver();

    game.openDealerCard();

    const result = game.defineWinner();

    console.log(JSON.stringify(result, null, 2));

    assert(true, 'Single game test completed successfully');
  });
});
