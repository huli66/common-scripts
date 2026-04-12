console.log("main.ts start");
const a = 1;

const userUrl = "/node/api/user";
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

console.log("main.ts end");
