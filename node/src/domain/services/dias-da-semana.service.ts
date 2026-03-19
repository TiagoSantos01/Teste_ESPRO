import { AtualizarDiaDaSemanaDTO, CriarDiaDaSemanaDTO } from '@domain/dto/dias-da-semana.dto';
import { DiasDaSemana } from '@domain/entity/dias-da-semana.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class DiasDaSemanaService {
    async listarDiasDaSemana(): Promise<DiasDaSemana[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/dias-da-semana')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<DiasDaSemana[]>;
            })
            .then(data => data as DiasDaSemana[])
            .catch(error => {
                console.error('Error fetching dias da semana:', error);
                return [];
            });
    }

    async criarDiaDaSemana(diaDaSemana: CriarDiaDaSemanaDTO): Promise<DiasDaSemana> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/dia-da-semana',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diaDaSemana),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<DiasDaSemana>;
            })
            .then(data => data as DiasDaSemana)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating dia da semana:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao criar dia da semana, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to create dia da semana due to an unexpected error. Please try again later.');
            });
    }
    async buscarDiaDaSemanaPorId(diaDaSemanaId: number): Promise<DiasDaSemana> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/dia-da-semana/${diaDaSemanaId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<DiasDaSemana>;
            })
            .then(data => data as DiasDaSemana)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching dia da semana:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('dia da semana não encontrado');
                }
                throw new ServiceUnavailableException('Failed to fetch dia da semana due to an unexpected error. Please try again later.');

            });
    }
    async atualizarDiaDaSemana(diaDaSemanaId: number, diaDaSemana: AtualizarDiaDaSemanaDTO): Promise<DiasDaSemana> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/dia-da-semana/' + diaDaSemanaId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diaDaSemana),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<DiasDaSemana>;
            })
            .then(data => data as DiasDaSemana)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating dia da semana:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException('dia da semana não encontrado');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar dia da semana, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to update dia da semana due to an unexpected error. Please try again later.');
            });
    }
    async excluirDiaDaSemana(diaDaSemanaId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/dia-da-semana/' + diaDaSemanaId,
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
                console.error('Error deleting dia da semana:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('dia da semana não encontrado');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('Dia da semana está associado a uma turma ativa');
                }
                throw new ServiceUnavailableException('Failed to delete dia da semana due to an unexpected error. Please try again later.');
            });
    }
}
