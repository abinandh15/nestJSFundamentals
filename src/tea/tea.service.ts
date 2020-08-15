import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Tea } from './entities/tea.entity';

@Injectable()
export class TeaService {
  private tea: Tea[] = [
    {
      id: 1,
      name: 'Masala chai',
      brand: 'Chai truck',
      flavors: ['Garam Masala', 'Channa Masala'],
    },
  ];
  findAll() {
    return this.tea;
  }

  findOne(id: string) {
    const tea = this.tea.find(item => item.id === +id);
    if(!tea){
        throw new NotFoundException(`Tea #${id} not found`)
    }
    return tea;
  }

  create(createTeaDto: any) {
    this.tea.push(createTeaDto);
    return createTeaDto
  }

  update(id: string, updateTeaDto: any) {
    const existingTea = this.findOne(id);
    if (existingTea) {
      // update the existing entity
    }
  }

  remove(id: string) {
    const teaIndex = this.tea.findIndex(item => item.id === +id);
    if (teaIndex >= 0) {
      this.tea.splice(teaIndex, 1);
    }
  }

}
