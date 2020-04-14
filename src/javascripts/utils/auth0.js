import createAuth0Client from '@auth0/auth0-spa-js';
import config from '../../../public-config.json'; // ⚠️ Public credentials

let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: config.auth0.domain,
    client_id: config.auth0.clientId,
  });

  // Already authenticated
  if (await auth0.isAuthenticated()) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  // Login Failed
  if (params.has('error')) {
    console.log(`AUTH FAILED: ${params.get('error_description')}`);
  }

  // Login Success
  if (params.has('code') && params.has('state')) {
    // Parse URL params and set them to auth0
    await auth0.handleRedirectCallback();

    // Clear URL params
    window.history.replaceState({}, document.title,
      `//${window.location.host}${window.location.pathname}`);
    console.log('AUTH PASSED!');
  }
};

const login = async (redirectPage) => {
  await auth0.loginWithRedirect({
    redirect_uri: redirectPage || window.location.origin,
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

const isAuthenticated = () => auth0.isAuthenticated();
const getUserInfo = () => auth0.getUserInfo();

export {
  configureClient,
  login,
  logout,
  isAuthenticated,
  getUserInfo,
};
