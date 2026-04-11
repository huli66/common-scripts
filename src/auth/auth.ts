import {userUrl} from "./config";
import type { IUserContent, IRequest } from "./types";
import openDialog from "./utils/open-dialog";


console.log("start auth");

const getUser = async () => {
  const response = await fetch(userUrl);
  return response.json() as Promise<IRequest<IUserContent>>;
};

const user = await getUser();
console.log("user", user);

window.SS_USER = user.content;


openDialog();