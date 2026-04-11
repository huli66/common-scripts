const a = 1;

const userUrl = '/node/api/user';
const cnexUrl = '/node/api/k8s/qbweb-fim/line/cnex-emo';

console.log('1');
console.log(a);

fetch(cnexUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(response => response.json()).then(data => {
  console.log('cnex data', data);
});