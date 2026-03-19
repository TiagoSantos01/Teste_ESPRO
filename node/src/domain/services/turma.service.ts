import { AtualizarTurmaDTO, CriarTurmaDTO } from '@domain/dto/turmas.dto';
import { Turmas } from '@domain/entity/turmas.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class TurmasService {
    async listarTurmas(): Promise<Turmas[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/turmas')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turmas[]>;
            })
            .then(data => data as Turmas[])
            .catch(error => {
                console.error('Error fetching turmas:', error);
                return [];
            });
    }

    async criarTurma(turma: CriarTurmaDTO): Promise<Turmas> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/turma',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turma),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turmas>;
            })
            .then(data => data as Turmas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating turma:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException((await error.request.json()).error || 'turma não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException((await error.request.json()).error || 'conflito ao criar turma, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to create turma due to an unexpected error. Please try again later.');
            });
    }
    async buscarTurmaPorId(turmaId: number): Promise<Turmas> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/turma/${turmaId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turmas>;
            })
            .then(data => data as Turmas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching turma:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('turma não encontrada');
                }
                throw new ServiceUnavailableException('Failed to fetch turma due to an unexpected error. Please try again later.');

            });
    }
    async atualizarTurma(turmaId: number, turma: AtualizarTurmaDTO): Promise<Turmas> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/turma/' + turmaId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(turma),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turmas>;
            })
            .then(data => data as Turmas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating turma:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException((await error.request.json()).error || 'turma não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar turma, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to update turma due to an unexpected error. Please try again later.');
            });
    }
    async excluirTurma(turmaId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/turma/' + turmaId,
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
                console.error('Error deleting turma:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('turma não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('Turma possui alunos ativos');
                }
                throw new ServiceUnavailableException('Failed to delete turma due to an unexpected error. Please try again later.');
            });
    }

}
