import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('tea')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    // const { limit, offset } = paginationQuery;
    return this.teaService.findAll(paginationQuery);  
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teaService.findOne(id);
  }

  @Post()
  create(@Body() createTeaDto:CreateTeaDto) {
    console.log(createTeaDto instanceof CreateTeaDto)
    return this.teaService.create(createTeaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeaDto:UpdateTeaDto) {
    return this.teaService.update(id, updateTeaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teaService.remove(id);
  }
}
