import { Room } from 'src/room/room.entity';
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
import { Game1Service } from '../game1/game1.service';

@WebSocketGateway()
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly game1Service: Game1Service,
  ) {}
  @WebSocketServer() server: Server;
  connectedUsers: Map<string, Socket> = new Map();

  //연결 되었을 때
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(`[ Connected ] userid :  ${userId}, clientid : ${client.id}`);
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
    this.connectedUsers.set(userId, client);
    this.server.emit('userConnected', userId);
  }

  //연결이 끊겼을 때
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.connectedUsers.delete(userId);
    console.log(
      `[ ! disconnected ] userid :  ${userId}, clientid : ${client.id}`,
    );
    this.server.emit('userDisconnected', userId);
  }

  //메세지 전송 (에코)
  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    const userId = client.handshake.query.userId as string;
    this.server.emit('message', `메세지 내용: ${message}`);
  }

  //방 생성 (인자 : [string, string] - [방이름, 방이미지])
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

  //방 생성 (인자 : string - 방 아이디)
  @SubscribeMessage('enterRoom')
  handleEnterRoom(client: Socket, roomId: string) {
    this.EnterRoom(client, roomId);
  }
  async EnterRoom(client: Socket, roomId: string) {
    try {
      const userId = client.handshake.query.userId as string;
      const user = await this.userService.findUserById(Number(userId));
      const room = await this.roomService.findRoomById(Number(roomId));
      console.log(
        `[ Enter ] : ${user.id}, ${user.username} 유저가 방 ${room.id} 에 입장합니다.`,
      );
      user.room = room;
      await this.userService.update(Number(userId), user);
      const updatedRoom = await this.roomService.findRoomById(Number(roomId));
      const playerSocket = this.getUserSocketsByRoomId(updatedRoom.players);
      //들어온 유저 포함 모두에게 전송 -> 업데이트
      if (playerSocket.length > 0) {
        for (const socketId in playerSocket) {
          playerSocket[socketId].emit('newUser', userId);
        }
      }
      client.emit('message', roomId);
    } catch (error) {
      console.error(error);
    }
  }

  //방 나가기 (인자 : string - 방 아이디)
  @SubscribeMessage('exitRoom')
  handleExitRoom(client: Socket, roomId: string) {
    this.ExitRoom(client, roomId);
  }
  async ExitRoom(client: Socket, roomId: string) {
    try {
      const userId = client.handshake.query.userId as string;
      const user = await this.userService.findUserById(Number(userId));
      const room = await this.roomService.findRoomById(Number(roomId));
      const playerSocket = this.getUserSocketsByRoomId(room.players);
      console.log(
        `[ Exit ] : ${user.id}, ${user.username} 유저가 방을 나갑니다.`,
      );
      //호스트이면 방 삭제
      if (user.id == room.host.id) {
        console.log(
          `[ Delete ] : 호스트가 나가서 ${room.id} ${room.roomName} 방을 삭제합니다.`,
        );
        for (const player of room.players) {
          player.room = null;
          await this.userService.update(player.id, player);
        }
        //모두에게 삭제를 알림
        await this.roomService.delete(Number(roomId));
        if (playerSocket.length > 0) {
          for (const socketId in playerSocket) {
            playerSocket[socketId].emit('roomDelete', roomId);
          }
        }
      } else {
        user.room = null;
        await this.userService.update(Number(userId), user);
        //나간 유저 포함 모두에게 전송 -> 업데이트
        if (playerSocket.length > 0) {
          for (const socketId in playerSocket) {
            playerSocket[socketId].emit('exitUser', userId);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('game1_start')
  handleStartRoom(client: Socket, roomId: number) {
    this.startRoom(client, roomId);
  }
  async startRoom(client: Socket, roomId: number) {
    try {
      const room = await this.roomService.findRoomById(roomId);
      const game1 = await this.game1Service.create(room);
      const playerSocket = this.getUserSocketsByRoomId(room.players);
      console.log(playerSocket.length);
      if (playerSocket.length > 0) {
        for (const socketId in playerSocket) {
          playerSocket[socketId].emit('game1_userInit', {
            userList: room.players.map((player) => player.id.toString()),
            userName: room.players.map((player) => player.username),
          });
          playerSocket[socketId].emit('game1_turn', {
            userId: JSON.parse(game1.index)[game1.now].toString(),
            num: game1.count,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('game1_selection')
  handleSelect(client: Socket, selection: number[]) {
    this.selectRoom(client, selection);
  }
  async selectRoom(client: Socket, selection: number[]) {
    try {
      const selectedNum = Number(selection[0]);
      const roomId = Number(selection[1]);
      const userId = client.handshake.query.userId as string;
      const room = await this.roomService.findRoomById(roomId);
      const game1 = room.game[0];
      const overUser: number[] = JSON.parse(game1.gameOverUser);
      game1.count -= selectedNum;
      //숫자가 0 이하일때 (패배자 선정)
      if (game1.count <= 0) {
        game1.gameOverUser = JSON.stringify(overUser.push(Number(userId)));
        game1.playerNum -= 1;
        //다음 라운드 재셋팅
        if (overUser.length < 2 && game1.playerNum > 2) {
          game1.count = 31;
          game1.index = JSON.stringify(
            room.players
              .map((player) => player.id)
              .sort(() => Math.random() - 0.5),
          );
          game1.now = 0;
          await this.game1Service.update(game1.id, game1);
          const playerSocket = this.getUserSocketsByRoomId(room.players);
          if (playerSocket.length > 0) {
            for (const socketId in playerSocket) {
              playerSocket[socketId].emit('game1_gameOver', {
                userId: userId,
              });
            }
          }
          //게임 끝
        } else {
          game1.state = 'end';
          await this.game1Service.update(game1.id, game1);
          const playerSocket = this.getUserSocketsByRoomId(room.players);
          if (playerSocket.length > 0) {
            for (const socketId in playerSocket) {
              playerSocket[socketId].emit('game1_gameEnd', {});
            }
          }
        }
      }
      // 다음 턴 진행
      else {
        game1.now += 1;
        if (game1.now == game1.playerNum) {
          game1.now = 0;
        }
        await this.game1Service.update(game1.id, game1);
        const playerSocket = this.getUserSocketsByRoomId(room.players);
        console.log(playerSocket);
        if (playerSocket.length > 0) {
          for (const socketId in playerSocket) {
            playerSocket[socketId].emit('game1_userSelection', {
              selection: game1.count,
            });
            playerSocket[socketId].emit('game1_turn', {
              userId: JSON.parse(game1.index)[game1.now].toString(),
              num: game1.count,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUserSocketsByRoomId(players: User[]): Socket[] {
    const users = [];
    players.forEach((player) => {
      const userSocket = this.connectedUsers.get(player.id.toString());
      if (userSocket) {
        users.push(this.connectedUsers.get(player.id.toString()));
      }
    });
    return users;
  }
}
