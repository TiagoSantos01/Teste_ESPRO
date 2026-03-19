import { AtualizarAlunoDTO, CriarAlunoDTO } from '@domain/dto/alunos.dto';
import { Alunos } from '@domain/entity/alunos.enity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class AlunosService {
    async listarAlunos(): Promise<Alunos[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/alunos')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Alunos[]>;
            })
            .then(data => data as Alunos[])
            .catch(error => {
                console.error('Error fetching alunos:', error);
                return [];
            });
    }

    async criarAluno(aluno: CriarAlunoDTO): Promise<Alunos> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/aluno',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Alunos>;
            })
            .then(data => data as Alunos)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating aluno:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException('turma não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException((await error.request.json()).error || 'conflito ao criar aluno, cpf já existe');
                }
                throw new ServiceUnavailableException('Failed to create aluno due to an unexpected error. Please try again later.');
            });
    }
    async buscarAlunoPorId(alunoId: number): Promise<Alunos> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/aluno/${alunoId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Alunos>;
            })
            .then(data => data as Alunos)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching aluno:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('aluno não encontrado');
                }
                throw new ServiceUnavailableException('Failed to fetch aluno due to an unexpected error. Please try again later.');

            });
    }
    async atualizarAluno(alunoId: number, aluno: AtualizarAlunoDTO): Promise<Alunos> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/aluno/' + alunoId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Alunos>;
            })
            .then(data => data as Alunos)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating aluno:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException((await error.request.json()).error || 'aluno não encontrado');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar aluno, cpf já existe');
                }
                throw new ServiceUnavailableException('Failed to update aluno due to an unexpected error. Please try again later.');
            });
    }
    async excluirAluno(alunoId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/aluno/' + alunoId,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response;
            })
            .then(_ => { })
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error deleting aluno:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('aluno não encontrado');
                }
                throw new ServiceUnavailableException('Failed to delete aluno due to an unexpected error. Please try again later.');
            });
    }
}
