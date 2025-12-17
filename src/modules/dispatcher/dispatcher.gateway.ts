import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws/dispatch',
  cors: { origin: '*' },
})
export class DispatcherGateway {
  @WebSocketServer()
  server!: Server;

  broadcastBoardUpdate(payload: any) {
    this.server.emit('dispatch.board', payload);
  }
  broadcastAssigned(payload: any) {
    this.server.emit('shipment.assigned', payload);
  }
  broadcastUnassigned(payload: any) {
    this.server.emit('shipment.unassigned', payload);
  }
}
