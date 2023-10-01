export enum ChipValue {
  OneHundred = 100,
  FiveHundred = 500,
  OneThousand = 1000,
  FiveThousand = 5000,
}

export class Chip {
  private constructor(readonly value: ChipValue) {}

  public get chipValue(): ChipValue {
    return this.value;
  }

  public static OneHundred(): Chip {
    return new Chip(ChipValue.OneHundred);
  }

  public static FiveHundred(): Chip {
    return new Chip(ChipValue.FiveHundred);
  }

  public static OneThousand(): Chip {
    return new Chip(ChipValue.OneThousand);
  }

  public static FiveThousand(): Chip {
    return new Chip(ChipValue.FiveThousand);
  }

  // 指定枚数だけ、ランダムな種類のチップ列をソートして返す
  static shuffle(size: number): Chip[] {
    const chips = [];
    for (let i = 0; i < size; i++) {
      const chip = Math.floor(Math.random() * 4);
      switch (chip) {
        case 0:
          chips.push(Chip.OneHundred());
          break;
        case 1:
          chips.push(Chip.FiveHundred());
          break;
        case 2:
          chips.push(Chip.OneThousand());
          break;
        case 3:
          chips.push(Chip.FiveThousand());
          break;
      }
    }
    return chips;
  }
}
