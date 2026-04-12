import md5 from "md5";
import { loginUrl } from "../config";
import styles from "./auth.css?inline";

const dialogHTML = `
<dialog
  id="auth-dialog"
  open
  class="auth-dialog"
>
  <form method="dialog">
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="username">
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password">
    </p>
    <p>
      <button type="submit">Login</button>
    </p>
  </form>
</dialog>
`;

const openDialog = () => {
  console.log("open dialog");

  // 插入 css
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);

  // 根据模板插入一个弹窗到 body 中
  const dialog = document.createElement("dialog");
  dialog.innerHTML = dialogHTML;
  document.body.appendChild(dialog);

  // 打开弹窗
  dialog.showModal();

  // 监听表单提交事件
  dialog.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = (dialog.querySelector("#username") as HTMLInputElement)
      ?.value;
    const password = (dialog.querySelector("#password") as HTMLInputElement)
      ?.value;
    console.log("Username:", username);
    console.log("Password:", password);
    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: md5(password) }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful:", data);
        if (data.status === 200) {
          console.log("Login successful!");
          window.location.reload();
        }
        // 这里可以根据返回的数据进行相应的处理，比如存储 token 等
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
    dialog.close();
  });
};

export default openDialog;
