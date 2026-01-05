import HappyFlower from '../../assets/images/flowerHouse_happyFlower.png'; 
import GoodFlower from '../../assets/images/flowerHouse_goodFlower.png';
import CalmFlower from '../../assets/images/flowerHouse_calmFlower.png';
import SadFlower from '../../assets/images/flowerHouse_sadFlower.png';
import BudFlower from '../../assets/images/flowerHouse_flowerBud.png';

// --- 1. ROBUST SCORE CONFIG (Lowercase) ---
const BASE_SCORES = {
  happy: { color: '#97c94b', score: 1.0 },       
  calm: { color: '#9782ce', score: 0.5 },         
  productive: { color: '#66CDBB', score: 0.7 }, 
  neutral: { color: '#B0B0B0', score: 0.1 },      
  sad: { color: '#8ABAC5', score: -0.5 },         
  anxious: { color: '#D49F44', score: -0.8 }, 
  angry: { color: '#A3523B', score: -1.0 },   
  stressed: { color: '#D49F44', score: -0.8 },    
};

// --- 2. BACKWARD COMPATIBILITY EXPORT ---
// This fixes the errors in SummaryChartModal and WeeklyDetailModal
export const MOOD_PALETTE = {
  Happy: BASE_SCORES.happy,
  Calm: BASE_SCORES.calm,
  Productive: BASE_SCORES.productive,
  Neutral: BASE_SCORES.neutral,
  Sad: BASE_SCORES.sad,
  Anxious: BASE_SCORES.anxious,
  Angry: BASE_SCORES.angry,
  Stressed: BASE_SCORES.stressed,
  // Add lowercase mapping just in case
  happy: BASE_SCORES.happy,
  calm: BASE_SCORES.calm,
  productive: BASE_SCORES.productive,
  neutral: BASE_SCORES.neutral,
  sad: BASE_SCORES.sad,
  anxious: BASE_SCORES.anxious,
  angry: BASE_SCORES.angry,
  stressed: BASE_SCORES.stressed,
};

// Helper to safely get score regardless of "Happy" vs "happy"
const getMoodData = (moodName) => {
    if (!moodName) return BASE_SCORES.neutral;
    const key = moodName.toLowerCase().trim();
    return BASE_SCORES[key] || BASE_SCORES.neutral;
};

// --- FLOWER MAPPING ---
export const FLOWER_MAPPING = [
    { name: "Happy Flower", moodRange: [0.7, 1.0], imagePath: HappyFlower, backgroundColor: '#fff4cc' },
    { name: "Good Flower", moodRange: [0.3, 0.69], imagePath: GoodFlower, backgroundColor: '#ffe0e0' },
    { name: "Calm Flower", moodRange: [-0.4, 0.29], imagePath: CalmFlower, backgroundColor: '#e6e6ff' },
    { name: "Low Flower", moodRange: [-1.0, -0.41], imagePath: SadFlower, backgroundColor: '#d6ffdb' },
];

/**
 * Generates the flower and its average mood score for a given week's logs.
 */
export const getWeeklyFlowerData = (logs) => {
    if (!logs || logs.length === 0) {
        return { avgScore: 0, flower: { name: "Bud", imagePath: BudFlower, backgroundColor: '#f0f0f0' } };
    }

    let totalScore = 0;
    logs.forEach(log => { 
        totalScore += getMoodData(log.emotion).score; 
    });

    const avgScore = totalScore / logs.length;
    
    const matchingFlower = FLOWER_MAPPING.find(flower => 
        avgScore >= flower.moodRange[0] && avgScore <= flower.moodRange[1]
    );

    return { avgScore, flower: matchingFlower || FLOWER_MAPPING[2] };
};

/**
 * Processes logs for chart data (monthly/yearly summaries).
 */
export const processLogData = (logs, totalWeeksInPeriod) => {
    if (!logs || logs.length === 0) {
        return { moodBreakdown: [], avgMood: 'N/A', avgMoodPercentage: 0, entriesPerWeek: 0 };
    }

    const moodCounts = {};
    let totalMoodScore = 0;
    
    logs.forEach(log => {
        const rawMood = log.emotion || 'Neutral';
        const moodData = getMoodData(rawMood);
        
        // Capitalize first letter for display (Happy, Sad)
        const displayMood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
        
        moodCounts[displayMood] = (moodCounts[displayMood] || 0) + 1;
        totalMoodScore += moodData.score;
    });

    const totalEntries = logs.length;
    
    const moodBreakdown = Object.keys(moodCounts).map(mood => ({
        name: mood,
        value: moodCounts[mood],
        color: getMoodData(mood).color,
    }));

    const averageScore = totalMoodScore / totalEntries;
    let avgMoodLabel = 'N/A';
    if (averageScore > 0.3) avgMoodLabel = 'Good';
    else if (averageScore > -0.3) avgMoodLabel = 'Stable';
    else avgMoodLabel = 'Low';
    
    const positiveEntries = logs.filter(log => getMoodData(log.emotion).score >= 0).length;
    const avgMoodPercentage = Math.round((positiveEntries / totalEntries) * 100);

    const entriesPerWeek = totalWeeksInPeriod > 0 ? (totalEntries / totalWeeksInPeriod).toFixed(1) : 0;

    return { moodBreakdown, avgMood: avgMoodLabel, avgMoodPercentage, entriesPerWeek: parseFloat(entriesPerWeek) };
};