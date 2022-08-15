export function formatFilename(filename: string, maxLen: number): string {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen-1)}...${filename.substring(len-chunkLen+2, len)}`;
}

// Renames file if there are naming conflicts, in the form of 'foobar (1)'
export function renameFile(filename: string, comparisons: string[]): string {
  const reg = new RegExp(filename);
  const results = comparisons.filter((comparison: string) => reg.test(comparison));

  if (results.length !== 0) {
    // Find lowest digit to name
    const digitsReg = /\(\d+\),/g;
    const soup = results.join().concat(',');
    const digitsResults = soup.match(digitsReg);
    
    // If no digit matches then go to else statement
    if (digitsResults !== null) {
      const digits: number[] = digitsResults.map(str => {
        const stripped = str.substring(1, str.length-2);
        return Number(stripped);
      });
      digits.sort();

      const idx = digits.indexOf(1);
      if (idx === -1) return `${filename}(1)`;
      else {
        let prev = 1;
        for (let i = idx+1 ; i < digits.length ; i++) {
          const cur = digits[i];
          if (cur !== prev + 1) {
            break;
          }
          prev += 1;
        }
        return `${filename}(${prev+1})`;
      }
    }
    else return `${filename}(1)`;
  } 
  else return filename;
}