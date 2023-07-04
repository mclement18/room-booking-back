import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Room } from 'src/room/entities/room.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(await this.createEntity(createEventDto));
  }

  findAll() {
    return this.eventRepository.find({ relations: { room: true } });
  }

  findInRange(from: Date, to: Date) {
    return this.eventRepository.find({
      relations: { room: true },
      where: [
        { start: Between(from, to) },
        { end: Between(from, to) },
        { start: LessThanOrEqual(from), end: MoreThanOrEqual(to) },
      ],
    });
  }

  findOne(id: number) {
    return this.eventRepository.findOne({
      where: { id },
      relations: {
        room: true,
      },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.save(
      await this.createEntity(updateEventDto, id),
    );
  }

  async remove(id: number) {
    const event = await this.eventRepository.findOneOrFail({ where: { id } });
    return this.eventRepository.remove(event);
  }

  private async createEntity(
    dto: CreateEventDto | UpdateEventDto,
    id?: number,
  ): Promise<Event> {
    const event = new Event();
    if (id) {
      event.id = id;
    }
    event.name = dto.name || event.name;
    event.start = dto.start || event.start;
    event.end = dto.end || event.end;

    if (dto.roomId) {
      const room = await this.roomRepository.findOneOrFail({
        where: { id: dto.roomId },
      });
      event.room = room;
    }
    return event;
  }
}
