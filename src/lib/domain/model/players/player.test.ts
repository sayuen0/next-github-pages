import { Player } from '@/lib/domain/model/players/player';

describe('Player class', () => {
  describe('.subtractFromStack', () => {
    const testCases = [
      {
        name: 'Regular subtraction',
        initialStack: 1000,
        subtractAmount: 500,
        expectedStackAfterSubtraction: 500,
        expectedSubtractedAmount: 500,
      },
      {
        name: 'Subtraction exceeding stack',
        initialStack: 300,
        subtractAmount: 500,
        expectedStackAfterSubtraction: 0,
        expectedSubtractedAmount: 300,
      },
      {
        name: 'Invalid subtraction amount (negative)',
        initialStack: 1000,
        subtractAmount: -100,
        expectedStackAfterSubtraction: 1000,
        expectedSubtractedAmount: 0,
      },
      {
        name: 'Subtraction from zero stack',
        initialStack: 0,
        subtractAmount: 100,
        expectedStackAfterSubtraction: 0,
        expectedSubtractedAmount: 0,
      },
    ];

    testCases.forEach(
      ({
        name,
        initialStack,
        subtractAmount,
        expectedStackAfterSubtraction,
        expectedSubtractedAmount,
      }) => {
        it(name, () => {
          const player = new Player('Test Player', initialStack);
          const subtractedAmount = player.subtractFromStack(subtractAmount);
          expect(player.getStack()).toBe(expectedStackAfterSubtraction);
          expect(subtractedAmount).toBe(expectedSubtractedAmount);
        });
      },
    );
  });
});
