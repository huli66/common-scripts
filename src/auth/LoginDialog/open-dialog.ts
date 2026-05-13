import md5 from "md5";

import dialogHTML from "./dialog.html?raw";
import dialogStyle from "./dialog.css?inline";
import { fetchLogin } from "../api";

const openDialog = () => {
  console.log("open dialog");

  const style = document.createElement("style");
  style.textContent = dialogStyle;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', dialogHTML);                                   
  const dialog = document.getElementById('auth-dialog') as HTMLDialogElement;

  dialog.showModal();

  dialog.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = (dialog.querySelector("#username") as HTMLInputElement)
      ?.value?.trim();
    const password = (dialog.querySelector("#password") as HTMLInputElement)
      ?.value?.trim();
    console.log("Username:", username);
    console.log("Password:", password);
    if (!username || !password) {
      return;
    }
    fetchLogin(username, md5(password))
      .then((res) => {
        if (res.status === 200) {
          window.SS_USER = res.content;
          window.location.reload();
          dialog.close();
        } else {
          console.log('登录失败，考虑添加重试机制，防止连续重试登录导致死循环');
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  });

  dialog.querySelector("button")?.addEventListener("click", () => {
    console.log('click')
  });
};

export default openDialog;