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
const userData = await fetchUser();
console.log("user", userData);

window.SS_USER = userData.content;
