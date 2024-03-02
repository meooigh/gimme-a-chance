import socketIOClient from 'socket.io-client';
const SOCKET_URL = 'http://10.0.2.2:3000';

class SocketService {
    initialize(option = {}) {
        this.socket = socketIOClient(SOCKET_URL, option);

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });
    }

    emit(event, data = {}) {
        this.socket.emit(event, data);
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

const SocketClient = new SocketService();
export default SocketClient;
