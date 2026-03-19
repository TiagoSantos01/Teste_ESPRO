import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DiasDaSemanaService } from '@domain/services/dias-da-semana.service';
import { DiasDaSemana } from '@domain/entity/dias-da-semana.entity';
import { AtualizarDiaDaSemanaDTO, CriarDiaDaSemanaDTO } from '@domain/dto/dias-da-semana.dto';
import { DiasDaSemanaEnum } from '@domain/enum/dias-da-semana.enum';

@Controller('dia-da-semana')
@UsePipes(new ValidationPipe({ transform: true }))
export class DiaDaSemanaController {
    constructor(private readonly diasDaSemanaService: DiasDaSemanaService) { }

    @Get('valores')
    async listarChaves(): Promise<DiasDaSemanaEnum[]> {
        return Object.values(DiasDaSemanaEnum) as DiasDaSemanaEnum[];
    }

    @Get('listar')
    async listar(): Promise<DiasDaSemana[]> {
        return await this.diasDaSemanaService.listarDiasDaSemana();
    }

    @Post()
    async criar(@Body() diaDaSemana: CriarDiaDaSemanaDTO): Promise<DiasDaSemana> {
        const diaDaSemanaCriado: DiasDaSemana = await this.diasDaSemanaService.criarDiaDaSemana(diaDaSemana);
        return diaDaSemanaCriado;
    }

    @Get(':diaDaSemanaId')
    async buscarPorId(@Param('diaDaSemanaId') diaDaSemanaId: number): Promise<DiasDaSemana> {
        return await this.diasDaSemanaService.buscarDiaDaSemanaPorId(diaDaSemanaId);
    }

    @Put(':diaDaSemanaId')
    async atualizar(@Param('diaDaSemanaId') diaDaSemanaId: number, @Body() diaDaSemana: AtualizarDiaDaSemanaDTO): Promise<DiasDaSemana> {
        return await this.diasDaSemanaService.atualizarDiaDaSemana(diaDaSemanaId, diaDaSemana);
    }

    @Delete(':diaDaSemanaId')
    async excluir(@Param('diaDaSemanaId') diaDaSemanaId: number): Promise<void> {
        await this.diasDaSemanaService.excluirDiaDaSemana(diaDaSemanaId);
    }
}
