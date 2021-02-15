const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local')});
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const appId = process.env.AGORA_APP_ID;
const appCert = process.env.AGORA_APP_CERTIFICATE;
if (!appId || !appCert) {
  throw Error('Please check AGORA_APP_ID and AGORA_APP_CERTIFICATE');
}
const date = new Date().toISOString().replace(/[^\d]/g, '').slice(0, 8); // length: 8
const rand = Math.random().toString(36).substr(2, 7).padEnd(7, '0'); // length: 7
const seed = `${date}${rand}`; // length: 15
const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 60 * 60;

const channel = `${seed}_channel`;
const localUserId = `${seed}_userId_local`;
const localUserToken = RtcTokenBuilder.buildTokenWithAccount(
  appId,
  appCert,
  channel,
  localUserId,
  RtcRole.PUBLISHER,
  privilegeExpiredTs,
);
const remoteUserId = `${seed}_userId_remote`;
const remoteUserToken = RtcTokenBuilder.buildTokenWithAccount(
  appId,
  appCert,
  channel,
  remoteUserId,
  RtcRole.SUBSCRIBER,
  privilegeExpiredTs,
);

const agoraOptions = {
  appId,
  appCert,
  local: Object.assign({}, {
    appId,
    channel,
    userId: localUserId,
    userToken: localUserToken,
  }, {}),
  remote: Object.assign({}, {
    appId,
    channel,
    userId: remoteUserId,
    userToken: remoteUserToken,
  }, {}),
};

module.exports = agoraOptions;
