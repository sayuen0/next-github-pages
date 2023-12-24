// 単一のゲームをデモンストレートする
import { UltimateTexasHoldem } from '@/lib/domain/model/game/texasHoldem/ultimate';
import assert from 'node:assert';

describe('single game', () => {
  it('should run a single game without errors', () => {
    const game = new UltimateTexasHoldem();
    console.log('Starting single game');
    game.startNewRound();

    console.log('Dealing flop');
    game.dealFlop();

    console.log('Dealing turn...');
    game.dealTurn();

    console.log('Dealing river...');
    game.dealRiver();

    console.log('Opening dealer card');
    game.openDealerCard();

    assert(true, 'Single game test completed successfully');
  });
});
