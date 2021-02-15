import React, { useEffect, useRef } from 'react';
import localMedia from './localMedia';
import agoraManager from './agoraManager';
import styles from './App.module.less';

const LocalPod = (props) => {
  const { width, height } = props;

  let video = useRef(null);

  useEffect(() => {
    (async () => {
      const getUserMediaConfig = { audio: true, video: { width, height } };
      await localMedia.init(getUserMediaConfig);
      console.warn('localStream', localMedia.getLocalStream());
      video.current.srcObject = localMedia.getLocalStream();
    })();
  }, []);

  return (
    <div className={styles.LocalPod}>
      <video ref={video} width={width} height={height} autoPlay={true} />
    </div>
  )
};

const RemotePod = (props) => {
  const { width, height } = props;

  let video = useRef(null);

  useEffect(() => {
    (async () => {
      const getUserMediaConfig = { audio: true, video: { width, height } };
      await agoraManager.init(getUserMediaConfig);
      console.warn('remoteStream', agoraManager.getRemoteStream());
    })();
  }, []);

  return (
    <div className={styles.RemotePod}>
      <video ref={video} width={width} height={height} autoPlay={true} />
    </div>
  )
};

const App = () => (
  <div className={styles.App}>
    <LocalPod width={320} height={240} />
    <RemotePod width={320} height={240} />
  </div>
);

export default App;
