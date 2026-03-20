import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Periodo } from "../interfaces/Periodo.interface";
import { useConfig } from "../hooks/useConfig";
import { useAlert } from "../context/AlertContext";
import { AlertEnum } from "../enum/AlertEnum.enum";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export const PeriodoComponent: React.FC<{ payload: Periodo, setShow: Dispatch<SetStateAction<boolean>>, setReload: Dispatch<SetStateAction<boolean>> }> = ({ payload, setShow, setReload }) => {
    const { addMessage } = useAlert();
    const { label, apiUrl, api } = useConfig();
    const [inicioHour, setInicioHour] = useState('08');
    const [inicioMinute, setInicioMinute] = useState('00');
    const [fimHour, setFimHour] = useState('10');
    const [fimMinute, setFimMinute] = useState('00');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!payload) return;
        if (payload.inicio) {
            const [h, m] = payload.inicio.split(':');
            setInicioHour(h?.padStart(2, '0') ?? '08');
            setInicioMinute(m?.padStart(2, '0') ?? '00');
        }
        if (payload.fim) {
            const [h, m] = payload.fim.split(':');
            setFimHour(h?.padStart(2, '0') ?? '10');
            setFimMinute(m?.padStart(2, '0') ?? '00');
        }
    }, [payload]);
    const handleSave = async () => {
        setLoading(true);
        const inicio = `${inicioHour}:${inicioMinute}`;
        const fim = `${fimHour}:${fimMinute}`;

        if (payload.id == undefined) {
            await fetch(api.periodo.create.path.replace('{{url}}', apiUrl), {
                method: api.periodo.create.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inicio, fim })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo>;
            })
                .then(() => {
                    addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                    setReload(true);
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
            await fetch(api.periodo.update.path.replace('{{url}}', apiUrl).replace(':periodoId', payload.id.toString()), {
                method: api.periodo.update.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inicio, fim })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Periodo>;
            })
                .then(() => {
                    addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                    setReload(true);
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
                    <Modal.Title>{payload ? label.page.periodo.edit : label.page.periodo.create}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <strong>{label.page.periodo.start}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={inicioHour} onChange={e => setInicioHour(e.target.value)} style={{ width: 100 }}>
                                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                </Form.Select>
                                <Form.Select value={inicioMinute} onChange={e => setInicioMinute(e.target.value)} style={{ width: 100 }}>
                                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                </Form.Select>
                            </div>
                        </li>

                        <li className="mb-3">
                            <strong>{label.page.periodo.end}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Select value={fimHour} onChange={e => setFimHour(e.target.value)} style={{ width: 100 }}>
                                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                </Form.Select>
                                <Form.Select value={fimMinute} onChange={e => setFimMinute(e.target.value)} style={{ width: 100 }}>
                                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
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