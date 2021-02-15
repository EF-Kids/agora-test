import AgoraRTC from 'agora-rtc-sdk';

const createAgoraManager = () => {
  const getRemoteStream = () => null;
  const init = async () => {};

  return {
    init,
    getRemoteStream,
  };
};

const agoraManager = createAgoraManager();

export default agoraManager;
