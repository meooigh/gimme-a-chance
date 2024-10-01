import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import io from 'socket.io-client';
import SocketClient from '../socket/SocketClient';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChatStackParamList} from '../navigation/Navigation';

// const SIGNAL_SERVER_URL = 'http://your-signal-server-url';

const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
type props = NativeStackScreenProps<ChatStackParamList, 'CallVideo'>;
const VideoCall = ({route, navigation}: props) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(new RTCPeerConnection(configuration));
  const socket = useRef(null);
  const {idAccount, ToAccountID} = route.params;
  //   const ToAccountID = route.params.ToAccountID;
  useEffect(() => {
    startCall();

    return () => {
      // SocketClient.emit('user-disconnect', {reason: 'a user left the room.'});
      peerConnection.current.close();
    };
  }, []);

  const startCall = async () => {
    // Get local stream
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);
    peerConnection.current.addStream(stream);

    // Connect to signaling server
    SocketClient.initialize({
      query: {
        idAccount: idAccount,
        ToAccountID: ToAccountID,
      },
    });
    // SocketClient.emit('join', 'room-id');

    SocketClient.on('offer', handleSignal);
    SocketClient.on('answer', handleSignal);
    SocketClient.on('ice-candidate', handleSignal);
    SocketClient.on('user-connected', initiateOffer);
  };

  const handleSignal = signal => {
    if (signal.type === 'offer') {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(signal),
      );
      peerConnection.current.createAnswer().then(answer => {
        peerConnection.current.setLocalDescription(answer);
        SocketClient.emit('answer', answer); // Emit 'answer' instead of 'signal'
      });
    } else if (signal.type === 'answer') {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(signal),
      );
    } else if (signal.candidate) {
      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          SocketClient.emit('ice-candidate', event.candidate);
        }
      };

      SocketClient.emit('ice-candidate', signal); // Emit 'ice-candidate'
    }
  };

  const initiateOffer = () => {
    peerConnection.current.createOffer().then(offer => {
      peerConnection.current.setLocalDescription(offer);
      SocketClient.emit('signal', 'room-id', offer);
    });
  };

  peerConnection.current.ontrack = event => {
    if (event.streams && event.streams[0]) {
      setRemoteStream(event.streams[0]);
    }
  };

  console.log('ldslg', remoteStream);
  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
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
