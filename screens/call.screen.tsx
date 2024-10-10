import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import SocketClient from '../socket/SocketClient';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChatStackParamList} from '../navigation/Navigation';

const peerConstraints = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

type Props = NativeStackScreenProps<ChatStackParamList, 'CallVideo'>;

const VideoCall = ({route}: Props) => {
  const [localStream, setLocalStream] = useState<MediaStream>(
    new MediaStream(),
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream(),
  );
  const peerConnection = new RTCPeerConnection(peerConstraints);
  const {idAccount, ToAccountID} = route.params;

  useEffect(() => {
    const setupPeerConnection = () => {
      peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
          SocketClient.emit('icecandidate', event.candidate);
        }
      });

      peerConnection.addEventListener('track', event => {
        if (event.streams[0]) {
          // Make sure the event has streams
          setRemoteStream(event.streams[0]); // Directly set the remote stream
        }
      });

      peerConnection.addEventListener('iceconnectionstatechange', () => {
        console.log(
          'ICE Connection State: ',
          peerConnection.iceConnectionState,
        );
      });
    };

    setupPeerConnection();

    startCall();

    return () => {
      peerConnection.close();
    };
  }, []);

  const getLocalStream = async () => {
    try {
      const mediaConstraints = {
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user',
        },
      };
      const stream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(stream);

      // Only add tracks if they are not already added
      localStream
        .getTracks()
        .forEach(track => peerConnection.addTrack(track, localStream));
    } catch (error) {
      console.error('Error getting local stream: ', error);
    }
  };

  const startCall = async () => {
    await getLocalStream();
    SocketClient.initialize({query: {idAccount, ToAccountID}});

    SocketClient.on('user-connected', initiateOffer);
    SocketClient.on('offer', handleSignal);
    SocketClient.on('answer', handleSignal);
    SocketClient.on('ice-candidate', handleSignal);
  };

  const initiateOffer = async () => {
    const sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };
    try {
      const offer = await peerConnection.createOffer(sessionConstraints);
      await peerConnection.setLocalDescription(offer);
      SocketClient.emit('offer', offer);
    } catch (error) {
      console.error('Error creating or setting offer', error);
    }
  };

  const handleSignal = async (signal: any) => {
    try {
      if (signal.type === 'offer') {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(signal),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        SocketClient.emit('answer', answer);
      } else if (signal.type === 'answer') {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(signal),
        );
      } else if (signal.candidate) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(signal.candidate),
        );
      }
    } catch (error) {
      console.error('Error handling signal: ', error);
    }
  };
  console.log(remoteStream);
  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
      )}
      {remoteStream &&
        remoteStream.getTracks().length > 0 && ( // Check for tracks
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  localVideo: {
    width: 100,
    height: 150,
  },
  remoteVideo: {
    flex: 1,
  },
});

export default VideoCall;
