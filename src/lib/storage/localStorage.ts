interface GameScore {
  name: string;
  stack: number;
}

const defaultScore: GameScore = { name: 'プレイヤー1', stack: 300 };

// Save score to localStorage
export function saveScore(score: GameScore) {
  localStorage.setItem('gameScore', JSON.stringify(score));
}

// Load score from localStorage
export function loadScore(): GameScore {
  const storedData = localStorage.getItem('gameScore');
  return storedData ? JSON.parse(storedData) : defaultScore;
}
