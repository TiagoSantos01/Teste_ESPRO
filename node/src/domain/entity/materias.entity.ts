import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';

export class Materias {

    @IsNumber({}, { message: 'materias.id.isNumber' })
    @IsNotEmpty({ message: 'materias.id.isNotEmpty' })
    id: number

    @IsString({ message: 'materias.nome.isString' })
    @IsNotEmpty({ message: 'materias.nome.isNotEmpty' })
    @Length(2, 100, { message: 'materias.nome.length' })
    nome: string

    data_criacao: Date

    data_atualizacao: Date
}