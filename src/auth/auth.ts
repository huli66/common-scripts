import { userUrl } from "./config";
import type { IUserContent, IRequest } from "./types";
import openDialog from "./utils/open-dialog";
// import interceptor from "./utils/middleware";

console.log("auth.js start");
// interceptor();

const getUser = async () => {
  try {
    const response = await fetch(userUrl);
    return response.json() as Promise<IRequest<IUserContent>>;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { content: null };
  }
};

window.addEventListener("OPEN_AUTH_DIALOG", () => {
  console.log("OPEN_AUTH_DIALOG event received, opening auth dialog");
  openDialog();
});

console.log("auth.ts end");

const user = await getUser();
console.log("user", user);

window.SS_USER = user.content;
