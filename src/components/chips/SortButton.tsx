import { useState } from 'react';

interface SortButtonProps {
  onToggle: (sorted: boolean) => void;
}

export default function SortButton({ onToggle }: SortButtonProps) {
  const [isSorted, setIsSorted] = useState(false);

  const handleClick = () => {
    setIsSorted(!isSorted);
    onToggle(!isSorted);
  };

  return <button onClick={handleClick}>{isSorted ? 'Unsort' : 'Sort'}</button>;
}
