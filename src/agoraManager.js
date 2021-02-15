import AgoraRTC from 'agora-rtc-sdk';

console.warn('agoraOptions', process.env.agoraOptions);

const { appId } = process.env.agoraOptions;

const {
  // appId,
  channel,
  userId: localUserId,
  userToken: localUserToken,
} = process.env.agoraOptions.local;

const {
  userId: remoteUserId,
  userToken: remoteUserToken,
} = process.env.agoraOptions.remote;

const poll = (cb, interval = 1000, times = 20) => new Promise((resolve, reject) => {
  let count = times;
  const _poll = () => {
    if (cb()) {
      return resolve();
    }
    if (count < 0) {
      return reject(Error(`Cannot poll within ${times} * ${interval}ms`));
    }
    count -= 1;
    setTimeout(_poll, interval);
  };
  _poll();
});

const createAgoraManager = () => {
  let _localClient = null;
  let _localStream = null;
  let _localStreamPublished = false;
  let _remoteClient = null;
  let _remoteStream = null;

  const getRemoteStream = () => _remoteStream;

  const _initRemoteClient = async () => {
    _remoteClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'h264',
    });
    _remoteClient.on('error', (err) => {
      console.warn('remote error', err);
    });
    _remoteClient.on('network-quality', (event) => {
      console.debug('remote network-quality', event.uplinkNetworkQuality, event.downlinkNetworkQuality);
    });
    _remoteClient.on('connection-state-change', ({ prevState, curState }) => {
      console.warn('remote connection-state-change', prevState, curState);
    });
    _remoteClient.on('stream-added', ({ stream }) => {
      console.warn('remote stream-added', stream.getId());
      _remoteClient.subscribe(stream);
    });
    _remoteClient.on('stream-updated', ({ stream }) => {
      console.warn('remote stream-updated', stream.getId());
    });
    _remoteClient.on('stream-removed', ({ stream }) => {
      console.warn('remote stream-removed', stream.getId());
    });
    _remoteClient.on('stream-subscribed', ({ stream }) => {
      console.warn('remote stream-subscribed', stream.getId());
      _remoteStream = stream;
    });
    await new Promise((resolve, reject) => {
      _remoteClient.init(appId, resolve, reject);
    });
    await new Promise((resolve, reject) => {
      _remoteClient.join(
        remoteUserToken,
        channel,
        remoteUserId,
        undefined,
        resolve,
        reject,
      );
    });
  };

  const _initLocalClient = async () => {
    _localClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'h264',
    });
    _localClient.on('error', (err) => {
      console.warn('local error', err);
    });
    _localClient.on('network-quality', (event) => {
      console.debug('local network-quality', event.uplinkNetworkQuality, event.downlinkNetworkQuality);
    });
    _localClient.on('connection-state-change', ({ prevState, curState }) => {
      console.warn('local connection-state-change', prevState, curState);
    });
    _localClient.on('stream-published', ({ stream }) => {
      console.warn('local stream-published', stream.getId());
      _localStreamPublished = true;
    });
    await new Promise((resolve, reject) => {
      _localClient.init(appId, resolve, reject);
    });
    await new Promise((resolve, reject) => {
      _localClient.join(
        localUserToken,
        channel,
        localUserId,
        undefined,
        resolve,
        reject,
      );
    });
  };

  const _initLocalStream = async (getUserMediaConfig) => {
    const stream = await navigator.mediaDevices.getUserMedia(getUserMediaConfig);
    _localStream = AgoraRTC.createStream({
      streamID: localUserId,
      audio: true,
      video: true,
      screen: false,
      screenAudio: false,
      mirror: false,
      audioSource: stream.getAudioTracks()[0],
      videoSource: stream.getVideoTracks()[0],
    });
    await new Promise((resolve, reject) => {
      _localStream.init(resolve, reject);
    });
    await new Promise((resolve, reject) => {
      _localStreamPublished = false;
      _localClient.publish(_localStream, reject);
      return resolve(poll(() => _localStreamPublished));
    }).catch(console.error);
  };

  const init = async (getUserMediaConfig) => {
    await _initRemoteClient();
    await _initLocalClient();
    await _initLocalStream(getUserMediaConfig);
    await poll(getRemoteStream).catch(console.error);
  };

  return {
    init,
    getRemoteStream,
  };
};

const agoraManager = createAgoraManager();

export default agoraManager;
