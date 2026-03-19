import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { PeriodoService } from '@domain/services/periodo.service';
import { Periodo } from '@domain/entity/periodo.entity';
import { AtualizarPeriodoDTO, CriarPeriodoDTO } from '@domain/dto/periodos.dto';

@Controller('periodo')
@UsePipes(new ValidationPipe({ transform: true }))
export class PeriodoController {
    constructor(private readonly periodoService: PeriodoService) { }

    @Get('listar')
    async listar(): Promise<Periodo[]> {
        return await this.periodoService.listarPeriodos();
    }

    @Post()
    async criar(@Body() periodo: CriarPeriodoDTO): Promise<Periodo> {
        const periodoCriado: Periodo = await this.periodoService.criarPeriodo(periodo);
        return periodoCriado;
    }

    @Get(':periodoId')
    async buscarPorId(@Param('periodoId') periodoId: number): Promise<Periodo> {
        return await this.periodoService.buscarPeriodoPorId(periodoId);
    }

    @Put(':periodoId')
    async atualizar(@Param('periodoId') periodoId: number, @Body() periodo: AtualizarPeriodoDTO): Promise<Periodo> {
        return await this.periodoService.atualizarPeriodo(periodoId, periodo);
    }

    @Delete(':periodoId')
    async excluir(@Param('periodoId') periodoId: number): Promise<void> {
        await this.periodoService.excluirPeriodo(periodoId);
    }
}
