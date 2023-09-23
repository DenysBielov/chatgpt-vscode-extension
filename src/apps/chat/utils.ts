export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  
  return color;
};

export const getCodeBlocksBorders = (text: string) => {
  const blockIndices = [];
  let startIndex = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '```') {
      if (startIndex === -1) {
        startIndex = i;
      } else {
        blockIndices.push([startIndex, i]);
        startIndex = -1;
      }
    }
  }

  return blockIndices;
};
