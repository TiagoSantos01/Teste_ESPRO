import { IsInicioMenorQueFim } from '@common/decorators/inicio-menor-que-fim.decorator';
import { Transform } from 'class-transformer';
import {
    IsMilitaryTime,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';

export class Periodo {

    @IsNumber({}, { message: 'materias.id.isNumber' })
    @IsNotEmpty({ message: 'materias.id.isNotEmpty' })
    id: number

    @IsNotEmpty({ message: 'periodo.inicio.isNotEmpty' })
    @IsMilitaryTime({ message: 'periodo.inicio.isMilitaryTime' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
        { toClassOnly: true })
    @IsInicioMenorQueFim('fim', { message: 'periodo.inicio.isBeforeFim' })
    inicio: string;

    @IsNotEmpty({ message: 'periodo.fim.isNotEmpty' })
    @IsMilitaryTime({ message: 'periodo.fim.isMilitaryTime' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim() : value,
        { toClassOnly: true })
    fim: string;

    data_criacao: Date;
    data_atualizacao: Date;
}