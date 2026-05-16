import { SourceMapConsumer } from "source-map";
import fs from 'fs/promises'
import path from 'path'

function extractContext(
  sourceContent,
  targetLine,
  contextLines,
) {
  const lines = sourceContent.split('\n');
  const start = Math.max(0, targetLine - 1 - contextLines);
  const end = Math.min(lines.length, targetLine + contextLines);

  return lines
    .slice(start, end)
    .map((text, i) => {
      const lineNo = start + i + 1;
      const marker = lineNo === targetLine ? '→' : ' ';
      return `${marker} ${String(lineNo).padStart(4)} │ ${text}`;
    })
    .join('\n');
}

let contextLines = 3;

export const findCondBySourceMap = async (sourceMap, line, column) => {
  const sourceData = await fs.readFile(sourceMap, 'utf-8');
  const {sourcesContent, sources} = sourceData;
  const consumer = await new SourceMapConsumer(sourceData);
  const position = consumer.originalPositionFor({
    line,
    column,
  });
  console.log('position', position);


  let code = '';
  let sourceContent = consumer.sourceContentFor(position.source, true);
  if (sourceContent) {
    code = extractContext(sourceContent, position.line, contextLines);
  } 

    if (sourceContent) {
      code = extractContext(sourceContent, position.line, contextLines);
    } else {
      // 没有内嵌源码，尝试从磁盘读取
      try {
        const sourceFilePath = path.resolve(
          path.dirname(sourceMap),
          position.source,
        );
        const fileContent = await fs.readFile(sourceFilePath, 'utf-8');
        code = extractContext(fileContent, position.line, contextLines);
      } catch {
        code = null; // 文件不存在则忽略
      }
    }
  console.log('code', code);
  return position;
};

const src = 'dist/vendors~main.fb1f9038.js.map';

const result = await findCondBySourceMap(src, 9, 187339);
console.log(result);
