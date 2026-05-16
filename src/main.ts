import './auth/auth.ts'

import { findCondBySourceMap } from "./sentry/read-map";
const src = 'dist/vendors~main.fb1f9038.js.map';
findCondBySourceMap(src, 9, 187339);

console.log("main.ts start");
const a = 1;

const cnexUrl = "/node/api/k8s/qbweb-fim/line/cnex-emo";

console.log("1", performance.now());
console.log(a);



fetch(cnexUrl, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#app")!.textContent = "1222";
    console.log("cnex data", data, performance.now());
  });

window.addEventListener('visibilitychange', (event) => {
  console.log("visibilitychange", document.visibilityState, event);
})

console.log("main.ts end");
