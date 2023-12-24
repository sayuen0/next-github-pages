import { PokerCard } from '@/lib/domain/model/cards/card';
import { v4 as uuidv4 } from 'uuid';

export class Player {
  public readonly id: string;
  private folded: boolean = false;
  private name: string;
  private stack: number;

  constructor(name: string, initialStack: number) {
    this.id = uuidv4();
    this.name = name;
    this.stack = initialStack;
    this._holeCard = [];
  }

  private _holeCard: PokerCard[];

  public get holeCard(): PokerCard[] {
    return this._holeCard.filter((c) => c.visible);
  }

  public get fold(): boolean {
    return this.folded;
  }

  public set fold(b: boolean) {
    this.folded = b;
  }

  public addHoleCard(c: PokerCard): void {
    this._holeCard.push(c);
  }

  public resetHoleCard(): void {
    this._holeCard = [];
  }

  public getName(): string {
    return this.name;
  }

  public getStack(): number {
    return this.stack;
  }

  public addToStack(amount: number): void {
    this.stack += amount;
  }

  // TODO: add test
  public subtractFromStack(amount: number): boolean {
    if (amount > this.stack) {
      return false; // Not enough stack to subtract
    }
    this.stack -= amount;
    return true;
  }

  public showDown(): void {
    this._holeCard.forEach((c) => (c.visible = true));
  }
}
