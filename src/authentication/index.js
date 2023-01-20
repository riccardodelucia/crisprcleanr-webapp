import getEnv from '@/utils/env.js';
import { createAuthentication } from '@computational-biology-web-unit/ht-vue/authentication';

const authServerURL = `${getEnv('VITE_URL_AUTH_SERVER')}`;

const realm = getEnv('VITE_AUTH_REALM');

const clientId = getEnv('VITE_AUTH_CLIENT_ID');

const appRootUrl = getEnv('VITE_URL_IORIO_CCR_WEBAPP');

const auth = createAuthentication(authServerURL, realm, clientId, appRootUrl);
export default auth;
