import { Module } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tea } from './entities/tea.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tea, Flavor, Event])],
    controllers:[TeaController],
    providers:[TeaService]
})
export class TeaModule {}
