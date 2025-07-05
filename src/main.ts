import JSON5 from 'json5';

type PicrossLevel = number[][]
type PicrossStage = Record<string, PicrossLevel>

const parseStage = (rawStageData: string): PicrossStage => {
    const stage = JSON5.parse(rawStageData) as PicrossStage;
    return stage;
}

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding('utf8');
  let data = '';
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
}

const drawLevel = (level: PicrossLevel) => {
    let levelStr = '';
    for (const row of level) {
        for (const cell of row) {
            levelStr += cell === 1
                ? '██'
                : '  '
        }
        levelStr += '\n';
    }
    console.log(levelStr);
}

const drawStage = (stage: PicrossStage) => {
    for (const level of Object.values(stage)) {
        drawLevel(level);
        console.log()
    }
}

const transposeLevel = (level: PicrossLevel): PicrossLevel => {
  if (level.length === 0) {
    return [];
  }

  const numRows = level.length;
  const numCols = level[0].length;

  const transposedLevel: PicrossLevel = Array.from({ length: numCols }, () =>
    Array(numRows).fill(null)
  );

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedLevel[j][i] = level[i][j];
    }
  }

  return transposedLevel;
}

const calculateHintsForLine = (line: number[]) => line
    .join()
    .split('0')
    .map(section => Array.from(section))
    .map(section => section.filter(cell => cell === '1'))
    .map(section => section.length)
    .filter(section => section > 0);

const calculateHints = (level: PicrossLevel) => {
    const rowHints = level.map(calculateHintsForLine);
    const columnHints = transposeLevel(level).map(calculateHintsForLine)

    return {
        rowHints,
        columnHints,
    }
}

const main = async () => {
    const stdinData = await readStdin();
    const stage = parseStage(stdinData);
    const level = stage['101'];

    drawLevel(level);

    const { columnHints, rowHints } = calculateHints(level)
    console.log({
        row1: rowHints[0],
        col1: columnHints[0],
    });
};

main();
