import { DiasDaSemanaEnum } from '@domain/enum/dias-da-semana.enum';
import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsBoolean,
} from 'class-validator';

export class DiasDaSemana {

    @IsNumber({}, { message: 'diasDaSemana.id.isNumber' })
    @IsNotEmpty({ message: 'diasDaSemana.id.isNotEmpty' })
    id: number

    @IsEnum(DiasDaSemanaEnum, { message: 'diasDaSemana.nome.isEnum' })
    @IsNotEmpty({ message: 'diasDaSemana.nome.isNotEmpty' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string'
            ? value.toLowerCase().trim()
            : value,
        { toClassOnly: true },
    )
    nome: DiasDaSemanaEnum

    @IsBoolean({ message: 'diasDaSemana.exclusao.isBoolean' })
    @IsNotEmpty({ message: 'diasDaSemana.exclusao.isNotEmpty' })
    exclusao: boolean

    data_exclusao: Date | null
    data_criacao: Date
    data_atualizacao: Date
}