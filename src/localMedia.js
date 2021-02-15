const createMedia = () => {
  let _stream = null;

  const getLocalStream= () => _stream;

  const init = async (getUserMediaConfig) =>
    window.navigator.mediaDevices.getUserMedia(getUserMediaConfig)
    .then((mediaStream) => {
      _stream = mediaStream;
      return mediaStream;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  return {
    init,
    getLocalStream,
  };
};

const localMedia = createMedia();

export default localMedia;
