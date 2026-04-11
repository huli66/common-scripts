import styles from './auth.css?inline';


const dialogHTML = `
<dialog
  id="auth-dialog"
  open
  class="auth-dialog"
>
  <form method="dialog">
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" name="username">
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" name="password">
    </p>
    <p>
      <button type="submit">Login</button>
    </p>
  </form>
</dialog>
`;

const openDialog = () => {
  console.log('open dialog');

  // 插入 css
  const style = document.createElement('style');           
  style.textContent = styles;
  document.head.appendChild(style); 

  // 根据模板插入一个弹窗到 body 中
  const dialog = document.createElement('dialog');
  dialog.innerHTML = dialogHTML;
  document.body.appendChild(dialog);

  // 打开弹窗
  dialog.showModal();

};

export default openDialog;
