import { getUser, inQb } from "./qb-service"
import { fetchLogin } from "../api"
import openDialog from "../LoginDialog/open-dialog";

/**
 * 在 QB 客户端中，检查用户是否登录
 * 已经登录则直接获取用户信息和 token 吗，不行，因为现在依赖 cookie 进行校验
 * 拿取信息调用登录接口，更新 token 和用户信息
 */
export const loginInQb = () => {
  if (inQb()) {
    getUser(
      (user) => {
        if (user.id !== window.SS_USER.id) {
          fetchLogin(user.username, user.password).then((res) => {
            if (res.status === 200) {
              window.SS_USER = res.content;
              window.location.reload();
            }
            console.log('登录失败，考虑添加重试机制，防止连续重试登录导致死循环');
            alert('登录失败，请重新登录');
          });
        }
      },
      (err) => {
        console.log("getUser failed", err);
      }
    )
  }
}

/**
 * 在浏览器中，直接打开登录弹窗
 */
export const loginInBrowser = () => {
  openDialog();
}