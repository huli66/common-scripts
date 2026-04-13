import md5 from "md5";
import { loginUrl } from "../config";

import dialogHTML from "./dialog.html?raw";
import dialogStyle from "./dialog.css?inline";

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
    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: md5(password) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log("Login successful!");
          window.location.reload();
          dialog.close();
        }
        // 这里可以根据返回的数据进行相应的处理，比如存储 token 等
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