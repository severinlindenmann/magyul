const fs = require('fs');
const path = require('path');

// Classify vowel harmony based on Hungarian vowels
function classifyVowelHarmony(word) {
  const backVowels = ['a', 'á', 'o', 'ó', 'u', 'ú'];
  const frontRoundedVowels = ['ö', 'ő', 'ü', 'ű'];
  const frontUnroundedVowels = ['e', 'é', 'i', 'í'];
  
  const lowerWord = word.toLowerCase();
  
  let hasBackVowel = false;
  let hasFrontRounded = false;
  let hasFrontUnrounded = false;
  
  for (let char of lowerWord) {
    if (backVowels.includes(char)) {
      hasBackVowel = true;
    }
    if (frontRoundedVowels.includes(char)) {
      hasFrontRounded = true;
    }
    if (frontUnroundedVowels.includes(char)) {
      hasFrontUnrounded = true;
    }
  }
  
  // Classification rules:
  // 1. If it has back vowels → tiefe (low/back)
  // 2. If it only has front rounded vowels (ö, ő, ü, ű) or front unrounded → hohe (high/front)
  // 3. If it has a mix → gemischte (mixed) - typically behaves like tiefe
  
  if (hasBackVowel) {
    if (hasFrontRounded || hasFrontUnrounded) {
      return 'gemischte'; // Mixed
    }
    return 'tiefe'; // Back/low
  } else if (hasFrontRounded || hasFrontUnrounded) {
    return 'hohe'; // Front/high
  }
  
  // Default to tiefe if no vowels found (shouldn't happen)
  return 'tiefe';
}

// Process all vocabulary files
const vocabDir = path.join(__dirname, 'public', 'data', 'vocabulary');

for (let i = 1; i <= 20; i++) {
  const filePath = path.join(vocabDir, `${i}.json`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add vowel harmony classification to each word
    const updatedData = data.map(word => {
      if (!word.vowel_harmony) {
        const harmony = classifyVowelHarmony(word.word_hu);
        return {
          ...word,
          vowel_harmony: harmony
        };
      }
      return word;
    });
    
    // Write back to file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log(`✓ Updated ${i}.json - added vowel harmony to ${updatedData.length} words`);
  } catch (error) {
    console.error(`✗ Error processing ${i}.json:`, error.message);
  }
}

console.log('\n✅ Vowel harmony classification complete!');
