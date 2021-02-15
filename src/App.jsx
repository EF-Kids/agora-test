import React, { useEffect, useMemo, useRef } from 'react';
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
      const localStream = localMedia.getLocalStream();
      console.warn('localStream', localStream);
      video.current.srcObject = localStream;
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

  const styleObject = useMemo(
    () => ({ width: `${width}px`, height: `${height}px` }),
    [width, height],
  );
  const idRef = useRef('remote-pod');

  useEffect(() => {
    (async () => {
      const getUserMediaConfig = { audio: true, video: { width, height } };
      await agoraManager.init(getUserMediaConfig);
      const remoteStream = agoraManager.getRemoteStream();
      console.warn('remoteStream', remoteStream);
      remoteStream.play(idRef.current);
    })();
  }, []);

  return (
    <div className={styles.RemotePod}>
      <div id={idRef.current} style={styleObject} />
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
