import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Room } from 'src/room/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Room])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
