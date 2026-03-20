import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConfig } from "../hooks/useConfig";
import { useAlert } from "../context/AlertContext";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Turma } from "../interfaces/Turma.interface";
import { DiaDaSemana } from "../interfaces/DiaDaSemana.interface";
import { Materia } from "../interfaces/Materia.interface";
import { Periodo } from "../interfaces/Periodo.interface";
import { Sala } from "../interfaces/Sala.interface";
import { Serie } from "../enum/serie.enum";


export const TurmaComponent: React.FC<{ payload: Turma, setShow: Dispatch<SetStateAction<boolean>>, setReload: Dispatch<SetStateAction<boolean>> }> = ({ payload, setShow, setReload }) => {
    const { addMessage } = useAlert();
    const { label, apiUrl, api } = useConfig();
    const [turma, setTurma] = useState<Turma>({ ...payload, data_atualizacao: undefined, data_cadastro: undefined, data_criacao: undefined, data_exclusao: undefined, exclusao: undefined } as Turma);
    const [loading, setLoading] = useState(false);
    const [diaDaSemanas, setDiaDaSemanas] = useState<DiaDaSemana[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [salas, setSalas] = useState<Sala[]>([]);




    useEffect(() => {
        if (!payload) return;
        loadDiasDaSemana();
        loadSalas();
        loadPeriodos();
        loadMaterias();
    }, [payload]);
    const handleSave = async () => {
        setLoading(true);


        if (payload.id == undefined) {
            await fetch(api.turma.create.path.replace('{{url}}', apiUrl), {
                method: api.turma.create.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...turma,id: undefined })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turma>;
            }).then(() => {
                addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                setReload(prev => !prev);
                setShow(false);

            })
                .catch(async (error: Error & { request: Response }) => {
                    if (error.request.status === 400) {
                        const errorMessage: object = (await error.request.json()).message;
                        if (errorMessage) {
                            Object.values(errorMessage).forEach((msg: any) => {
                                addMessage(AlertEnum.Error, msg);
                            });
                            return;
                        }
                    }
                    if (error.request.status === 409) {
                        addMessage(AlertEnum.Error, (await error.request.json()).message);
                        return;
                    }

                    addMessage(AlertEnum.Error, error.message);
                }).finally(() => {
                    setLoading(false);
                });
        }
        if (payload.id !== undefined) {
            await fetch(api.turma.update.path.replace('{{url}}', apiUrl).replace(':turmaId', payload.id.toString()), {
                method: api.turma.update.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...turma, id: undefined })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Turma>;
            })
                .then(() => {
                    addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                    setReload(prev => !prev);
                    setShow(false);

                })
                .catch(async (error: Error & { request: Response }) => {
                    if (error.request.status === 400) {
                        const errorMessage: object = (await error.request.json()).message;
                        if (errorMessage) {
                            Object.values(errorMessage).forEach((msg: any) => {
                                addMessage(AlertEnum.Error, msg);
                            });
                            return;
                        }
                    }
                    if (error.request.status === 409) {
                        addMessage(AlertEnum.Error, (await error.request.json()).message);
                        return;
                    }

                    addMessage(AlertEnum.Error, error.message);
                }).finally(() => {
                    setLoading(false);
                });
        }
    };

    const loadDiasDaSemana = async (): Promise<void> => {
        await fetch(api.diaDaSemana.list.path.replace('{{url}}', apiUrl), {
            method: api.diaDaSemana.list.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response.json() as Promise<DiaDaSemana[]>;
        })
            .then(data => data as DiaDaSemana[])
            .then(setDiaDaSemanas)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const loadSalas = async (): Promise<void> => {
        await fetch(api.sala.list.path.replace('{{url}}', apiUrl), {
            method: api.sala.list.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response.json() as Promise<Sala[]>;
        })
            .then(data => data as Sala[])
            .then(setSalas)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const loadPeriodos = async (): Promise<void> => {
        await fetch(api.periodo.list.path.replace('{{url}}', apiUrl), {
            method: api.periodo.list.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response.json() as Promise<Periodo[]>;
        })
            .then(data => data as Periodo[])
            .then(setPeriodos)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const loadMaterias = async (): Promise<void> => {
        await fetch(api.materia.list.path.replace('{{url}}', apiUrl), {
            method: api.materia.list.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response.json() as Promise<Materia[]>;
        })
            .then(data => data as Materia[])
            .then(setMaterias)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    if (!payload) return null;

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal
                show={!!payload}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{payload.id !== undefined ? label.page.turma.edit : label.page.turma.create}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <strong>{label.page.turma.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Control type="text" value={turma.nome} onChange={e => setTurma({ ...turma, nome: e.target.value })} />
                            </div>
                        </li>
                        <li className="mb-3">
                            <strong>{label.page.turma.serie.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={turma.serie} onChange={e => setTurma({ ...turma, serie: e.target.value as Serie })} style={{ width: 100 }}>
                                    {Object.entries(Serie).map(([subKey, subVal]) => <option key={subKey} value={subKey}>{subVal}</option>)}
                                </Form.Select>
                            </div>
                        </li>
                        <li className="mb-3">
                            <strong>{label.page.materia.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={turma.cod_materia} onChange={e => setTurma({ ...turma, cod_materia: Number(e.target.value) })} style={{ width: 100 }}>
                                    {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.nome}</option>)}
                                </Form.Select>
                            </div>
                        </li>
                        <li className="mb-3">
                            <strong>{label.page.periodo.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={turma.periodo} onChange={e => setTurma({ ...turma, periodo: Number(e.target.value) })} style={{ width: 100 }}>
                                    {periodos.map((per) => <option key={per.id} value={per.id}>{per.inicio} - {per.fim}</option>)}
                                </Form.Select>
                            </div>
                        </li>
                        <li className="mb-3">
                            <strong>{label.page.diaDaSemana.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={turma.dia_da_semana} onChange={e => setTurma({ ...turma, dia_da_semana: Number(e.target.value) })} style={{ width: 100 }}>
                                    {diaDaSemanas.map((dia) => <option key={dia.id} value={dia.id}>{dia.nome}</option>)}
                                </Form.Select>
                            </div>
                        </li>
                        <li className="mb-3">
                            <strong>{label.page.sala.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={turma.cod_sala} onChange={e => setTurma({ ...turma, cod_sala: Number(e.target.value) })} style={{ width: 100 }}>
                                    {salas.map((sala) => <option key={sala.id} value={sala.id}>{sala.nome}</option>)}
                                </Form.Select>
                            </div>
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={loading} onClick={() => setShow(false)}>{label.actions.cancel}</Button>
                    <Button variant="primary" disabled={loading} onClick={handleSave}>
                        {loading &&
                            <Spinner size="sm" animation="border" className="me-2" />
                        }
                        {label.actions.save}
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
}
