import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Materias } from '@domain/entity/materias.entity';
import { MateriasService } from '@domain/services/materias.service';
import { AtualizarMateriaDTO, CriarMateriaDTO } from '@domain/dto/materias.dto';

@Controller('materia')
@UsePipes(new ValidationPipe({ transform: true }))
export class MateriaController {
    constructor(private readonly materiasService: MateriasService) { }

    @Get('listar')
    async listar(): Promise<Materias[]> {
        return await this.materiasService.listarMaterias();
    }

    @Post()
    async criar(@Body() materia: CriarMateriaDTO): Promise<Materias> {
        const materiaCriada: Materias = await this.materiasService.criarMateria(materia);
        return materiaCriada;
    }

    @Get(':materiaId')
    async buscarPorId(@Param('materiaId') materiaId: number): Promise<Materias> {
        return await this.materiasService.buscarMateriaPorId(materiaId);
    }

    @Put(':materiaId')
    async atualizar(@Param('materiaId') materiaId: number, @Body() materia: AtualizarMateriaDTO): Promise<Materias> {
        return await this.materiasService.atualizarMateria(materiaId, materia);
    }

    @Delete(':materiaId')
    async excluir(@Param('materiaId') materiaId: number): Promise<void> {
         await this.materiasService.excluirMateria(materiaId);
    }
}
