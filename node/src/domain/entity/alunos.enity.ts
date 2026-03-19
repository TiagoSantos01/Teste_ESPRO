import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    IsEmail,
    IsBoolean,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { IsValidBirthDate } from '@common/validators/date.validator';
export class Alunos {

    @IsNumber({}, { message: 'alunos.id.isNumber' })
    @IsNotEmpty({ message: 'alunos.id.isNotEmpty' })
    id: number

    @IsString({ message: 'alunos.nome.isString' })
    @IsNotEmpty({ message: 'alunos.nome.isNotEmpty' })
    @Length(2, 100, { message: 'alunos.nome.length' })
    nome: string

    @IsString({ message: 'alunos.cpf.isString' })
    @IsNotEmpty({ message: 'alunos.cpf.isNotEmpty' })
    @Length(11, 11, { message: 'alunos.cpf.length' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string'
            ? value.replace(/\D+/g, '')
            : (value ?? '').toString().replace(/\D+/g, ''),
        { toClassOnly: true },
    )
    cpf: string

    @IsNotEmpty({ message: 'alunos.data_nascimento.isNotEmpty' })
    @IsValidBirthDate({ message: 'alunos.data_nascimento.isValid' })
    data_nascimento: Date

    @IsEmail({}, { message: 'alunos.email.isEmail' })
    @IsNotEmpty({ message: 'alunos.email.isNotEmpty' })
    @Transform(
        ({ value }: { value: unknown }) =>
            typeof value === 'string'
                ? value.toLowerCase().trim()
                : (value as string),
        { toClassOnly: true },
    )
    email: string
    @IsString({ message: 'alunos.telefone.isString' })
    @IsNotEmpty({ message: 'alunos.telefone.isNotEmpty' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string'
            ? value.replace(/\D+/g, '')
            : (value ?? '').toString().replace(/\D+/g, ''),
        { toClassOnly: true },
    )
    telefone: string

    @IsString({ message: 'alunos.endereco.isString' })
    @IsNotEmpty({ message: 'alunos.endereco.isNotEmpty' })
    endereco: string

    @IsNumber({}, { message: 'alunos.cod_turma.isNumber' })
    @IsNotEmpty({ message: 'alunos.cod_turma.isNotEmpty' })
    cod_turma: number

    @IsBoolean({ message: 'alunos.exclusao.isBoolean' })
    @IsNotEmpty({ message: 'alunos.exclusao.isNotEmpty' })
    exclusao: boolean


    data_exclusao: Date | null

    data_criacao: Date

    data_atualizacao: Date
}