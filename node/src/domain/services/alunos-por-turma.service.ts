import { } from '@domain/dto/turmas.dto';
import { Alunos } from '@domain/entity/alunos.enity';
import { Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';

@Injectable()
export class AlunosPorTurmaService {

    async listarAlunosPorTurma(turmaId: number): Promise<Alunos[]> {
        return await fetch(`http://api_laravel.espro.com:80/api/v1/turma/${turmaId}/alunos`)
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

    async excluirAlunosPorTurma(turmaId: number): Promise<void> {
        await fetch(
            'http://api_laravel.espro.com:80/api/v1/turma/' + turmaId + '/alunos',
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
                console.error('Error deleting alunos por turma:', error);

                if (error.request.status === 404) {
                    throw new NotFoundException('turma não encontrada');
                }
                throw new ServiceUnavailableException('Failed to delete alunos por turma due to an unexpected error. Please try again later.');
            });
    }
}
