import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verify, JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  rooms: Map<string, Set<string>> = new Map();
  connectedUsers: Set<string> = new Set();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    // jwt 토큰 인증 부분
    // const token = client.handshake.headers.authorization;
    // const secretKey = 'jwtConstants';
    // const userId = null;

    // try {
    //   const decoded = verify(token, secretKey) as JwtPayload;
    //   const userId = decoded.userId;
    // } catch (error) {
    //   console.error('Authorization error:', error.message);
    // }
    this.connectedUsers.add(userId);
    this.server.emit('userConnected', userId);
    console.log(`Client connected: ${client.id}, ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.connectedUsers.delete(userId);
    this.server.emit('userDisconnected', userId);
    console.log(`Client disconnected: ${client.id}, ${userId}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    const userId = client.handshake.query.userId as string;
    this.server.emit('message', userId);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, roomName: string) {
    const roomId = uuid();
    const userId = client.handshake.query.userId as string;
    this.rooms.set(roomId, new Set([userId]));
    client.emit('roomCreated', roomId);
  }

  @SubscribeMessage('enterRoom')
  handleEnterRoom(client: Socket, roomId: string) {
    const userId = client.handshake.query.userId as string;
    this.rooms.get(roomId).add(userId);
    const connectedUsers = this.getUserSocketsByRoomId(roomId);
    if (connectedUsers.length > 0) {
      for (const socketId in connectedUsers) {
        connectedUsers[socketId].emit('newUser', userId);
      }
    }
  }
  @SubscribeMessage('startRoom')
  handleStartRoom(client: Socket, roomId: string) {
    this.server.emit('roomStarted', roomId);
  }

  getUserSocketsByRoomId(roomId: string): Socket[] {
    const connectedSockets = this.server.sockets.sockets;
    const connectedUsers: Socket[] = [];
    for (const socketId in connectedSockets) {
      const socket = connectedSockets[socketId] as Socket;
      const userId = socket.handshake.query.userId as string;
      if (userId in this.rooms[roomId]) {
        connectedUsers.push(socket);
      }
    }
    return connectedUsers;
  }
}
