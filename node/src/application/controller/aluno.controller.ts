import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlunosService } from '@domain/services/alunos.service';
import { Alunos } from '@domain/entity/alunos.enity';
import { AtualizarAlunoDTO, CriarAlunoDTO } from '@domain/dto/alunos.dto';

@Controller('aluno')
@UsePipes(new ValidationPipe({ transform: true }))
export class AlunoController {
    constructor(private readonly alunosService: AlunosService) { }

    @Get('listar')
    async listar(): Promise<Alunos[]> {
        return await this.alunosService.listarAlunos();
    }

    @Post()
    async criar(@Body() aluno: CriarAlunoDTO): Promise<Alunos> {
        const alunoCriado: Alunos = await this.alunosService.criarAluno(aluno);
        return alunoCriado;
    }

    @Get(':alunoId')
    async buscarPorId(@Param('alunoId') alunoId: number): Promise<Alunos> {
        return await this.alunosService.buscarAlunoPorId(alunoId);
    }

    @Put(':alunoId')
    async atualizar(@Param('alunoId') alunoId: number, @Body() aluno: AtualizarAlunoDTO): Promise<Alunos> {
        return await this.alunosService.atualizarAluno(alunoId, aluno);
    }

    @Delete(':alunoId')
    async excluir(@Param('alunoId') alunoId: number): Promise<void> {
        await this.alunosService.excluirAluno(alunoId);
    }
}
