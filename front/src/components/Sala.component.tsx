import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useConfig } from "../hooks/useConfig";
import { useAlert } from "../context/AlertContext";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Sala } from "../interfaces/Sala.interface";


export const SalaComponent: React.FC<{ payload: Sala, setShow: Dispatch<SetStateAction<boolean>>, setReload: Dispatch<SetStateAction<boolean>> }> = ({ payload, setShow, setReload }) => {
    const { addMessage } = useAlert();
    const { label, apiUrl, api } = useConfig();
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!payload) return;
        setNome(payload.nome ?? '');

    }, [payload]);
    const handleSave = async () => {
        setLoading(true);


        if (payload.id == undefined) {
            await fetch(api.sala.create.path.replace('{{url}}', apiUrl), {
                method: api.sala.create.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Sala>;
            }).then(() => {
                    addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                    setReload(prev=>!prev);
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
            await fetch(api.sala.update.path.replace('{{url}}', apiUrl).replace(':salaId', payload.id.toString()), {
                method: api.sala.update.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome })
            }).then(async (response: Response) => {
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                    error.request = response;
                    throw error;
                }
                return response.json() as Promise<Sala>;
            })
                .then(() => {
                    addMessage(AlertEnum.Success, label.actions.savedSuccessfully);
                    setReload(prev=>!prev);
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
                    <Modal.Title>{payload.id !== undefined ? label.page.sala.edit : label.page.sala.create}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <strong>{label.page.sala.name}</strong>
                            <div className="d-flex gap-2 mt-2">
                                <Form.Control type="text" value={nome} onChange={e => setNome(e.target.value)} />
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
                         