import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Between, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return this.roomRepository.save(this.convertEntity(createRoomDto));
  }

  findAll() {
    return this.roomRepository.find();
  }

  findOne(id: number) {
    return this.roomRepository.findOne({ where: { id } });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.save(this.convertEntity(updateRoomDto, id));
  }

  async remove(id: number) {
    const room = await this.roomRepository.findOneOrFail({ where: { id } });
    return this.roomRepository.remove(room);
  }

  async findAllEvent(id: number) {
    const room = await this.roomRepository.findOneOrFail({
      where: { id },
      relations: {
        events: true,
      },
    });
    return room.events;
  }

  async findEventsInRange(id: number, from: Date, to: Date) {
    return this.eventRepository.find({
      where: [
        { room: { id }, start: Between(from, to) },
        { room: { id }, end: Between(from, to) },
      ],
    });
  }

  private convertEntity(dto: CreateRoomDto | UpdateRoomDto, id?: number): Room {
    const room = new Room();
    if (id) {
      room.id = id;
    }
    room.name = dto.name || room.name;
    room.color = dto.color || room.color;
    return room;
  }
}
