import md5 from 'md5';
import { loginUrl, userUrl } from './config';

export const getUser = () => {
  return fetch(userUrl)
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Failed to fetch user:', error);
      return null;
    });
}

export const login = (username: string, password: string) => {
  return fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Login successful:', data);
    return data;
  })
  .catch(error => {
    console.error('Login failed:', error);
    return null;
  });
}