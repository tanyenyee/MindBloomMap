const flaggedWords = [
  "stupid", "dumb", "pathetic", "loser", "idiot", 
  "kill yourself", "hate you", "worthless", "useless",
  "ugly", "die", "kys", "trash", "garbage"
];

const severityWeights = {
  "kill yourself": 10,
  "kys": 10,
  "die": 8,
  "hate you": 7,
  "worthless": 6,
  "pathetic": 5,
  "stupid": 4,
  "dumb": 4,
  "useless": 4,
  "loser": 4,
  "idiot": 3,
  "ugly": 3,
  "trash": 3,
  "garbage": 2
};

export function analyzeToxicity(text) {
  if (!text) return { isToxic: false, score:   0, severity: "None", flaggedWords:   [] };

  const lowerText = text.toLowerCase();
  const foundWords = [];
  let totalWeight = 0;

  flaggedWords.forEach(word => {
    if (lowerText.includes(word)) {
      foundWords.push(word);
      totalWeight += severityWeights[word] || 3;
    }
  });

  if (foundWords.length === 0) {
    return { isToxic: false, score:  0, severity: "None", flaggedWords:  [] };
  }

  // Calculate toxicity score (0-100%)
  const baseScore = Math.min((foundWords.length * 15) + totalWeight * 5, 100);
  const score = Math.round(baseScore);

  // Determine severity
  let severity = "Low";
  if (score >= 70) severity = "High";
  else if (score >= 40) severity = "Medium-High";
  else if (score >= 20) severity = "Medium";

  return {
    isToxic:   true,
    score,
    severity,
    flaggedWords:   foundWords
  };
}

export function highlightFlaggedWords(text) {
  if (!text) return [];
  
  const words = text.split(/(\s+)/);
  
  return words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[.,! ?]/g, '');
    const isFlagged = flaggedWords.some(flagged => cleanWord.includes(flagged));
    
    return {
      word,
      flagged: isFlagged
    };
  });
}