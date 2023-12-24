import { ChangeEvent, useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Slider = ({ min, max, onChange }: SliderProps) => {
  const [value, setValue] = useState<number>(10);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(event); // 親コンポーネントに通知
  };

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }} // Ensures full width and better touch interaction
      />
    </div>
  );
};

export default Slider;
