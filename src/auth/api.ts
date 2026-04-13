import {loginUrl, userUrl} from "./config";
import type { IUserContent, IRequest } from "./types";

export const fetchUser = (): Promise<IRequest<IUserContent>> => {
  return new Promise((resolve, reject) => {
    fetch(userUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("User data:", data);
        return resolve(data as IRequest<IUserContent>);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
        return reject(error as Error);
      });
  });
};

export const fetchLogin = (username: string, password: string): Promise<IRequest<IUserContent>> => {
  return new Promise((resolve, reject) => {
    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, password}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful:", data);
        return resolve(data as IRequest<IUserContent>);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        return reject(error as Error);
      });
  });
};
