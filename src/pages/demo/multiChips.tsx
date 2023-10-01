import React from 'react';
import SingleChip, { ChipValue } from '@/components/chips/SingleChip'; // Import the SingleChip component

export default function MultiChipsPage() {
  // Define array of chip values
  const chipValues: ChipValue[] = [
    ChipValue.OneHundred,
    ChipValue.FiveHundred,
    ChipValue.OneThousand,
    ChipValue.FiveThousand,
    ChipValue.OneHundred,
  ];

  return (
    <div>
      {chipValues.map((value, index) => (
        <SingleChip key={index} value={value} /> // Render the SingleChip component
      ))}
    </div>
  );
}
