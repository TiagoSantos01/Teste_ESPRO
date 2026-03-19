import { AtualizarSalaDTO, CriarSalaDTO } from '@domain/dto/salas.dto';
import { Salas } from '@domain/entity/salas.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class SalasService {
    async listarSalas(): Promise<Salas[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/salas')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Salas[]>;
            })
            .then(data => data as Salas[])
            .catch(error => {
                console.error('Error fetching salas:', error);
                return [];
            });
    }

    async criarSala(sala: CriarSalaDTO): Promise<Salas> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/sala',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sala),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Salas>;
            })
            .then(data => data as Salas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating sala:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao criar sala, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to create sala due to an unexpected error. Please try again later.');
            });
    }
    async buscarSalaPorId(salaId: number): Promise<Salas> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/sala/${salaId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Salas>;
            })
            .then(data => data as Salas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching sala:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('sala não encontrada');
                }
                throw new ServiceUnavailableException('Failed to fetch sala due to an unexpected error. Please try again later.');

            });
    }
    async atualizarSala(salaId: number, sala: AtualizarSalaDTO): Promise<Salas> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/sala/' + salaId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sala),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Salas>;
            })
            .then(data => data as Salas)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating sala:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException('sala não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar sala, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to update sala due to an unexpected error. Please try again later.');
            });
    }
    async excluirSala(salaId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/sala/' + salaId,
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
                console.error('Error deleting sala:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('sala não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('Sala está associada a uma turma ativa');
                }
                throw new ServiceUnavailableException('Failed to delete sala due to an unexpected error. Please try again later.');
            });
    }
}
