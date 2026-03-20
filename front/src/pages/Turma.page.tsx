import { Col, Container, Row, Table } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { Turma } from "../interfaces/Turma.interface";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Link } from "react-router-dom";
import { IconComponent } from "../components/Icon.component";
import { TurmaComponent } from "../components/Turma.component";
import { AvisoComponent } from "../components/Aviso.component";
import { useEffect, useState } from "react";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { useAlert } from "../context/AlertContext";
export const TurmaPage: React.FC = () => {
    const { label, api, apiUrl, icon, route } = useConfig();

    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [aviso, setAviso] = useState<AvisoProps | null>(null);
    const [turma, setTurma] = useState<Turma | null>(null);
    const { addMessage } = useAlert();

    const init = async (): Promise<void> => {
        await fetch(api.turma.list.path.replace('{{url}}', apiUrl), {
            method: api.turma.list.method
        }).then(async (response: Response) => {
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`) as Error & { request: Response };
                error.request = response;
                throw error;
            }
            return response.json() as Promise<Turma[]>;
        })
            .then(data => data as Turma[])
            .then(setTurmas)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    useEffect(() => {
        document.title = label.page.turma.title;
        init();
    }, [label.page.turma.title, reload]);

    const deleteTurma = async (turma: Turma): Promise<void> => {
        await fetch(api.turma.delete.path.replace('{{url}}', apiUrl).replace(':turmaId', turma.id.toString()), {
            method: api.turma.delete.method
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
                <h1 className="text-center mt-5">{label.page.turma.title}</h1>
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
                                <th>{label.page.turma.name}</th>
                                <th className="text-center">{label.actions.title}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {turmas.map((turma) => (
                                <tr key={turma.id}>
                                    <td>{turma.id}</td>
                                    <td>{turma.nome}</td>
                                    <td className="d-flex justify-content-center">
                                        <button className="btn btn-info btn-sm me-2"
                                            onClick={() => setTurma(turma)}
                                        >
                                            <IconComponent icon={icon.editar} />
                                            {label.actions.edit}
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2"
                                            onClick={() => setAviso({
                                                title: label.actions.delete,
                                                body: label.page.turma.confirmDelete.replace('{{name}}', turma.nome),
                                                actionsCancelName: label.actions.no,
                                                actionsCancel: () => setAviso(null),
                                                show: true,
                                                actionsConfirmName: label.actions.yes,
                                                actionsConfirm: () => {
                                                    deleteTurma(turma);
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
                                <td colSpan={4} className="text-center" onClick={() => setTurma({ nome: '' } as Turma)}><IconComponent icon={icon.adicionar} />{label.actions.add}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {aviso && <AvisoComponent {...aviso} />}
            {turma && <TurmaComponent payload={turma} setShow={() => { setTurma(null) }} setReload={setReload} />}

        </>
    );
}