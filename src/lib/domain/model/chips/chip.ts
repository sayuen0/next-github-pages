import { v4 as uuidv4 } from 'uuid';

export enum ChipValue {
  OneHundred = 100,
  FiveHundred = 500,
  OneThousand = 1000,
  FiveThousand = 5000,
}

type ChipGenerator = () => Chip;

export class Chip {
  readonly id: string;
  readonly value: number;

  constructor(value: number) {
    this.id = uuidv4(); // each Chip has a unique id
    this.value = value;
  }

  public get chipValue(): ChipValue {
    return this.value;
  }

  public get number(): number {
    return Number(this.value);
  }

  static getRandValue = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

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

  static getRandomizedArray = (length: number): Chip[] => {
    // array of all possible static methods
    const chipMethods: ChipGenerator[] = [
      Chip.OneHundred,
      Chip.FiveHundred,
      Chip.OneThousand,
      Chip.FiveThousand,
    ];

    return new Array(length)
      .fill(0) // fill method used to allow map to work
      .map(() => {
        const randomIndex = Math.floor(Math.random() * chipMethods.length);
        return chipMethods[randomIndex]();
      });
  };
}
