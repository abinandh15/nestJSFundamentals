import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Tea } from './entities/tea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class TeaService {
  constructor(
    @InjectRepository(Tea)
    private readonly teaRepository: Repository<Tea>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    return this.teaRepository.find({
      relations: ['flavors'],
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async findOne(id: string) {
    const tea = await this.teaRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!tea) {
      throw new NotFoundException(`Tea #${id} not found`);
    }
    return tea;
  }

  async create(createTeaDto: CreateTeaDto) {
    const flavors = await Promise.all(
      createTeaDto.flavors.map(name => this.preloadFlavorByName(name)),
    );

    const tea = this.teaRepository.create({ ...createTeaDto, flavors });
    return this.teaRepository.save(tea);
  }

  async update(id: string, updateTeaDto: UpdateTeaDto) {
    const flavors =
      updateTeaDto.flavors &&
      (await Promise.all(
        updateTeaDto.flavors.map(name => this.preloadFlavorByName(name)),
      ));
    const tea = await this.teaRepository.preload({
      id: +id,
      ...updateTeaDto,
      flavors,
    });
    if (!tea) {
      throw new NotFoundException(`Tea #${id} not found`);
    }
    return this.teaRepository.save(tea);
  }

  async recommentTea(tea: Tea) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      tea.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_tea';
      recommendEvent.type = 'tea';
      recommendEvent.payload = { teaId: tea.id };

      await queryRunner.manager.save(tea);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const tea = await this.findOne(id);
    return this.teaRepository.remove(tea);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
