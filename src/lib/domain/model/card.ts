export const CardValues = [
  'AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '0S', 'JS', 'QS', 'KS',
  'AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '0D', 'JD', 'QD', 'KD',
  'AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '0C', 'JC', 'QC', 'KC',
  'AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '0H', 'JH', 'QH', 'KH'
] as const;

export type Card = typeof CardValues[number];

export function sanitizeCardValue(input: string): string {
  if (!input) return input
  const valueMap: { [key: string]: string } = {
    '10': '0',
    '11': 'J',
    '12': 'Q',
    '13': 'K'
  };

  const suit = input.charAt(input.length - 1).toUpperCase();
  const value = input.slice(0, -1).toUpperCase();

  if (valueMap[value]) {
    return valueMap[value] + suit;
  }
  return value + suit;
}

export function assertValidCard(input: string): Card {
  const sanitizedValue = sanitizeCardValue(input);

  if (!CardValues.includes(sanitizedValue as Card)) {
    throw new Error(`Invalid card value: ${input}`);
  }

  return sanitizedValue as Card;
}
