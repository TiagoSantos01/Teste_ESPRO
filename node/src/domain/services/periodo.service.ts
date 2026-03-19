import { AtualizarPeriodoDTO, CriarPeriodoDTO } from '@domain/dto/periodos.dto';
import { Periodo } from '@domain/entity/periodo.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class PeriodoService {
    async listarPeriodos(): Promise<Periodo[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/periodos')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo[]>;
            })
            .then(data => data as Periodo[])
            .catch(error => {
                console.error('Error fetching periodos:', error);
                return [];
            });
    }

    async criarPeriodo(periodo: CriarPeriodoDTO): Promise<Periodo> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/periodo',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(periodo),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo>;
            })
            .then(data => data as Periodo)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating periodo:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao criar periodo, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to create periodo due to an unexpected error. Please try again later.');
            });
    }
    async buscarPeriodoPorId(periodoId: number): Promise<Periodo> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/periodo/${periodoId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo>;
            })
            .then(data => data as Periodo)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching periodo:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('periodo não encontrado');
                }
                throw new ServiceUnavailableException('Failed to fetch periodo due to an unexpected error. Please try again later.');

            });
    }
    async atualizarPeriodo(periodoId: number, periodo: AtualizarPeriodoDTO): Promise<Periodo> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/periodo/' + periodoId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(periodo),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo>;
            })
            .then(data => data as Periodo)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating periodo:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException('periodo não encontrado');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar periodo, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to update periodo due to an unexpected error. Please try again later.');
            });
    }
    async excluirPeriodo(periodoId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/periodo/' + periodoId,
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
                console.error('Error deleting periodo:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('periodo não encontrado');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('Periodo está associado a uma turma ativa');
                }
                throw new ServiceUnavailableException('Failed to delete periodo due to an unexpected error. Please try again later.');
            });
    }
}
