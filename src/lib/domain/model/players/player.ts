import { PokerCard } from '@/lib/domain/model/cards/card';
import { v4 as uuidv4 } from 'uuid';

export class Player {
  public readonly id: string;
  private folded: boolean = false;
  private stack: number;

  constructor(name: string, initialStack: number) {
    this.id = uuidv4();
    this._name = name;
    this.stack = initialStack;
    this._holeCard = [];
  }

  private _name: string;

  public get name(): string {
    return this._name;
  }

  private _holeCard: PokerCard[];

  // FIXME: ゲッターで直接見えなくするのではなく、これとは別にgetVisibleHoleCardsを作成する
  public get holeCard(): PokerCard[] {
    return this._holeCard.filter((c) => c.visible);
  }

  public get fold(): boolean {
    return this.folded;
  }

  public set fold(b: boolean) {
    this.folded = b;
  }

  public get holeCardCount(): number {
    return this._holeCard.length;
  }

  public addHoleCard(c: PokerCard): void {
    this._holeCard.push(c);
  }

  public resetHoleCard(): void {
    this._holeCard = [];
  }

  public getStack(): number {
    return this.stack;
  }

  public addToStack(amount: number): void {
    this.stack += amount;
  }

  public subtractFromStack(amount: number): number {
    if (amount <= 0 || this.stack <= 0) {
      return 0;
    }
    if (amount > this.stack) {
      amount = this.stack;
    }
    this.stack -= amount;
    return amount;
  }

  public showDown(): void {
    this._holeCard.forEach((c) => (c.visible = true));
  }

  public hasStackMoreThanEqual(amount: number): boolean {
    return this.stack >= amount;
  }
}
