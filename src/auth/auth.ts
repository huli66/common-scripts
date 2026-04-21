import interceptor from "./utils/middleware";
import {fetchUser} from "./api";
import {JUMP_LOGIN_EVENT} from "./config";
import {inQb} from "./utils/qb-service";
import { loginInQb, loginInBrowser } from "./utils";

console.log("auth.js start");
interceptor();

window.addEventListener(JUMP_LOGIN_EVENT, () => {
  console.log(`[${JUMP_LOGIN_EVENT}] event received`);
  if (inQb()) {
    loginInQb()
  } else {
    loginInBrowser();
  }
});

console.log("auth.ts end");

// 获取用户信息保存在 window.SS_USER 中
// fetchUser().then((userData) => {
//   console.log("user", userData);
//   window.SS_USER = userData.content;
// }).catch((error) => {
//   console.error("fetchUser failed", error);
//   throw new Error("fetchUser failed");
// });
const userData = await fetchUser();

if (userData.status === 200) {
  console.log("user", userData);
  window.SS_USER = userData.content;
} else {
  console.log("fetchUser failed", userData);
  throw new Error("fetchUser failed");
}
