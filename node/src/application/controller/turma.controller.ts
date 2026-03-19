import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarTurmaDTO, CriarTurmaDTO } from '@domain/dto/turmas.dto';
import { TurmasService } from '@domain/services/turma.service';
import { Turmas } from '@domain/entity/turmas.entity';
import { Serie } from '@domain/enum/serie.enum';

@Controller('turma')
@UsePipes(new ValidationPipe({ transform: true }))
export class TurmaController {
    constructor(private readonly turmaService: TurmasService) { }


    @Get('series/valores')
    async listarChaves(): Promise<Serie[]> {
        return Object.values(Serie) as Serie[];
    }

    @Get('listar')
    async listar(): Promise<Turmas[]> {
        return await this.turmaService.listarTurmas();
    }

    @Post()
    async criar(@Body() turma: CriarTurmaDTO): Promise<Turmas> {
        const turmaCriada: Turmas = await this.turmaService.criarTurma(turma);
        return turmaCriada;
    }

    @Get(':turmaId')
    async buscarPorId(@Param('turmaId') turmaId: number): Promise<Turmas> {
        return await this.turmaService.buscarTurmaPorId(turmaId);
    }

    @Put(':turmaId')
    async atualizar(@Param('turmaId') turmaId: number, @Body() turma: AtualizarTurmaDTO): Promise<Turmas> {
        return await this.turmaService.atualizarTurma(turmaId, turma);
    }

    @Delete(':turmaId')
    async excluir(@Param('turmaId') turmaId: number): Promise<void> {
        await this.turmaService.excluirTurma(turmaId);
    }
}
