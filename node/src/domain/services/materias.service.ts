import { AtualizarMateriaDTO, CriarMateriaDTO } from '@domain/dto/materias.dto';
import { Materias } from '@domain/entity/materias.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class MateriasService {
    async listarMaterias(): Promise<Materias[]> {
        return await fetch('http://api_laravel.espro.com:80/api/v1/materias')
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Materias[]>;
            })
            .then(data => data as Materias[])
            .catch(error => {
                console.error('Error fetching materias:', error);
                return [];
            });
    }
    async buscarMateriaPorId(materiaId: number): Promise<Materias> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/materia/${materiaId}`)
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Materias>;
            })
            .then(data => data as Materias)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching materia:', error);
                if (error.request.status === 404) {
                    throw new NotFoundException('materia não encontrada');
                }
                throw new ServiceUnavailableException('Failed to fetch materia due to an unexpected error. Please try again later.');

            });
    }
    async criarMateria(materia: CriarMateriaDTO): Promise<Materias> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/materia',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(materia),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Materias>;
            })
            .then(data => data as Materias)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error creating materia:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao criar materia, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to create materia due to an unexpected error. Please try again later.');
            });
    }
    async atualizarMateria(materiaId: number, materia: AtualizarMateriaDTO): Promise<Materias> {
        return await fetch(
            'http://api_laravel.espro.com:80/api/v1/materia/' + materiaId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(materia),
            }
        )
            .then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Materias>;
            })
            .then(data => data as Materias)
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error updating materia:', error);
                if (error.request.status === 400) {
                    throw new BadRequestException(await error.request.json());
                }
                if (error.request.status === 404) {
                    throw new NotFoundException('materia não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('conflito ao atualizar materia, nome já existe');
                }
                throw new ServiceUnavailableException('Failed to update materia due to an unexpected error. Please try again later.');
            });
    }
    async excluirMateria(materiaId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/materia/' + materiaId,
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
                console.error('Error deleting materia:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('materia não encontrada');
                }
                if (error.request.status === 409) {
                    throw new ConflictException('Matéria está associada a uma turma ativa');
                }
                throw new ServiceUnavailableException('Failed to delete materia due to an unexpected error. Please try again later.');
            });
    }
}
