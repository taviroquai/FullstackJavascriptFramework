import { getClient } from '../../graphql';
import * as Queries from './queries';
import { Cookies } from 'react-cookie';

/**
 * Authenticate user
 *
 * @param {String} email
 * @param {String} password
 */
export const login = (email, password) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries.getAccessToken,
      variables: { email, password }
    }).then(r => {
        const cookies = new Cookies();
        cookies.set('user', r.data.getAccessToken, { maxAge: 40000 });
        resolve(r.data.getAccessToken);
      })
      .catch(error => {
        reject(error.graphQLErrors)
      })
  })
}

/**
 * Get user from cookies
 */
export const getUser = () => {
  const cookies = new Cookies();
  const client = getClient();
  return new Promise((resolve, reject) => {
    const user = cookies.get('user');
    if (!user) resolve(null);
    client.query({
      query: Queries.getUserByAccessToken,
      variables: { authtoken: user.authtoken }
    }).then(r => {
        resolve(user);
    })
    .catch(error => {
      reject(error.graphQLErrors)
    });
  });
}

export const isAuthenticated = () => {
  return getUser();
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies();
    cookies.remove('user');
    resolve(true);
  });
}
