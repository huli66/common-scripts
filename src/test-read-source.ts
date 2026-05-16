import { findCondBySourceMap } from "./sentry/read-map";

const src = 'dist/vendors~main.fb1f9038.js.map';

const result = await findCondBySourceMap(src, 9, 187339);
console.log(result);