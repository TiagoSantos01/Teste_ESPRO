import { Col, Container, Row, Table } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { Sala } from "../interfaces/Sala.interface";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Link } from "react-router-dom";
import { IconComponent } from "../components/Icon.component";
import { SalaComponent } from "../components/Sala.component";
import { AvisoComponent } from "../components/Aviso.component";
import { useEffect, useState } from "react";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { useAlert } from "../context/AlertContext";

export const SalaPage: React.FC = () => {
    const { label, api, apiUrl, icon, route } = useConfig();

    const [salas, setSalas] = useState<Sala[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [aviso, setAviso] = useState<AvisoProps | null>(null);
    const [sala, setSala] = useState<Sala | null>(null);
    const { addMessage } = useAlert();

    const init = async (): Promise<void> => {
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
    useEffect(() => {
        document.title = label.page.sala.title;
        init();
    }, [label.page.sala.title, reload]);

    const deleteSala = async (sala: Sala): Promise<void> => {
        await fetch(api.sala.delete.path.replace('{{url}}', apiUrl).replace(':salaId', sala.id.toString()), {
            method: api.sala.delete.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response;
        })
            .then(_ => {
                init()
                addMessage(AlertEnum.Success, (label.actions.deletedSuccessfully));
            })
            .catch(async (error: Error & { request: Response }) => {
                console.error('Error fetching data:', error);
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

            });
    }

    return (
        <>
            <Container>
                <h1 className="text-center mt-5">{label.page.sala.title}</h1>
                <Link to={route.home}>
                    <button className="btn btn-primary mb-3">
                        <IconComponent icon={icon.home} />
                        {label.page.home.name}
                    </button>
                </Link>
                <Row>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{label.page.sala.name}</th>
                                <th className="text-center">{label.actions.title}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {salas.map((sala) => (
                                <tr key={sala.id}>
                                    <td>{sala.id}</td>
                                    <td>{sala.nome}</td>
                                    <td className="d-flex justify-content-center">
                                        <button className="btn btn-info btn-sm me-2"
                                            onClick={() => setSala(sala)}
                                        >
                                            <IconComponent icon={icon.editar} />
                                            {label.actions.edit}
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2"
                                            onClick={() => setAviso({
                                                title: label.actions.delete,
                                                body: label.page.sala.confirmDelete.replace('{{name}}', sala.nome),
                                                actionsCancelName: label.actions.no,
                                                actionsCancel: () => setAviso(null),
                                                show: true,
                                                actionsConfirmName: label.actions.yes,
                                                actionsConfirm: () => {
                                                    deleteSala(sala);
                                                    setAviso(null);
                                                }
                                            })}>
                                            <IconComponent icon={icon.excluir} />
                                            {label.actions.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={4} className="text-center" onClick={() => setSala({ nome: '' } as Sala)}><IconComponent icon={icon.adicionar} />{label.actions.add}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {aviso && <AvisoComponent {...aviso} />}
            {sala && <SalaComponent payload={sala} setShow={() => { setSala(null) }} setReload={setReload} />}

        </>
    );
}