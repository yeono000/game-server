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
import { RoomService } from './room.service';
import { UserService } from '../user/user.service';
import { Dependencies } from '@nestjs/common';
import { RoomInput } from './dto/room.input';
import { User } from '../user/user.entity';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer() server: Server;
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
    // TEST - message -> echo
    this.server.emit('message', message);
    // this.server.emit('message', userId);
  }

  //방 생성
  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, roomName: string) {
    this.createRoom(client, roomName);
  }
  async createRoom(client: Socket, roomName: string) {
    try {
      const userId = client.handshake.query.userId as string;
      const user = await this.userService.findUserById(Number(userId));
      const roomInput = new RoomInput();
      roomInput.roomName = roomName;
      roomInput.host = user;
      roomInput.players = [user];
      const room = await this.roomService.create(roomInput);
      client.emit('roomCreated', room.id);
    } catch (error) {
      console.error(error);
    }
  }

  //방 참가
  @SubscribeMessage('enterRoom')
  handleEnterRoom(client: Socket, roomId: string) {
    this.EnterRoom(client, roomId);
  }
  async EnterRoom(client: Socket, roomId: string) {
    try {
      const userId = client.handshake.query.userId as string;
      const user = await this.userService.findUserById(Number(userId));
      const room = await this.roomService.findRoomById(Number(roomId));
      user.room = room;
      await this.userService.update(Number(userId), user);
      const playerSocket = this.getUserSocketsByRoomId(room.players);
      console.log(playerSocket);
      if (playerSocket.length > 0) {
        for (const socketId in playerSocket) {
          playerSocket[socketId].emit('newUser', userId);
        }
      }
      console.log(room.players);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('startRoom')
  handleStartRoom(client: Socket, roomId: string) {
    this.server.emit('roomStarted', roomId);
  }

  getUserSocketsByRoomId(players: User[]): Socket[] {
    const connectedSockets = this.server.sockets.sockets;
    const connectedUsers: Socket[] = [];
    const playersId = players.map((player) => player.id);
    for (const socketId in connectedSockets) {
      const socket = connectedSockets[socketId] as Socket;
      const userId = socket.handshake.query.userId as string;
      if (userId in playersId) {
        connectedUsers.push(socket);
      }
    }
    return connectedUsers;
  }
}
