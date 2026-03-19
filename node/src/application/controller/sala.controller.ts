import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { SalasService } from '@domain/services/salas.service';
import { Salas } from '@domain/entity/salas.entity';
import { AtualizarSalaDTO, CriarSalaDTO } from '@domain/dto/salas.dto';

@Controller('sala')
@UsePipes(new ValidationPipe({ transform: true }))
export class SalaController {
    constructor(private readonly salasService: SalasService) { }

    @Get('listar')
    async listar(): Promise<Salas[]> {
        return await this.salasService.listarSalas();
    }

    @Post()
    async criar(@Body() sala: CriarSalaDTO): Promise<Salas> {
        const salaCriada: Salas = await this.salasService.criarSala(sala);
        return salaCriada;
    }

    @Get(':salaId')
    async buscarPorId(@Param('salaId') salaId: number): Promise<Salas> {
        return await this.salasService.buscarSalaPorId(salaId);
    }

    @Put(':salaId')
    async atualizar(@Param('salaId') salaId: number, @Body() sala: AtualizarSalaDTO): Promise<Salas> {
        return await this.salasService.atualizarSala(salaId, sala);
    }

    @Delete(':salaId')
    async excluir(@Param('salaId') salaId: number): Promise<void> {
        await this.salasService.excluirSala(salaId);
    }
}
