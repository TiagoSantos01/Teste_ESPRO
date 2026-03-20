import { Col, Container, Row, Table } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Link } from "react-router-dom";
import { IconComponent } from "../components/Icon.component";
import { DiaDaSemanaComponent } from "../components/DiaDaSemana.component";
import { AvisoComponent } from "../components/Aviso.component";
import { useEffect, useState } from "react";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { useAlert } from "../context/AlertContext";
import { DiaDaSemana } from "../interfaces/DiaDaSemana.interface";

export const DiaDaSemanaPage: React.FC = () => {
   const { label, api, apiUrl, icon, route } = useConfig();

    const [diaDaSemanas, setDiaDaSemanas] = useState<DiaDaSemana[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [aviso, setAviso] = useState<AvisoProps | null>(null);
    const [diaDaSemana, setDiaDaSemana] = useState<DiaDaSemana | null>(null);
    const { addMessage } = useAlert();

    const init = async (): Promise<void> => {
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
    useEffect(() => {
        document.title = label.page.diaDaSemana.title;
        init();
    }, [label.page.diaDaSemana.title, reload]);

    const deleteDiaDaSemana = async (diaDaSemana: DiaDaSemana): Promise<void> => {
        await fetch(api.diaDaSemana.delete.path.replace('{{url}}', apiUrl).replace(':diaId', diaDaSemana.id.toString()), {
            method: api.diaDaSemana.delete.method
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
                <h1 className="text-center mt-5">{label.page.diaDaSemana.title}</h1>
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
                                <th>{label.page.diaDaSemana.name}</th>
                                <th className="text-center">{label.actions.title}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {diaDaSemanas.map((diaDaSemana) => (
                                <tr key={diaDaSemana.id}>
                                    <td>{diaDaSemana.id}</td>
                                    <td>{diaDaSemana.nome}</td>
                                    <td className="d-flex justify-content-center">
                                        <button className="btn btn-info btn-sm me-2"
                                            onClick={() => setDiaDaSemana(diaDaSemana)}
                                        >
                                            <IconComponent icon={icon.editar} />
                                            {label.actions.edit}
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2"
                                            onClick={() => setAviso({
                                                title: label.actions.delete,
                                                body: label.page.diaDaSemana.confirmDelete.replace('{{day}}', diaDaSemana.nome),
                                                actionsCancelName: label.actions.no,
                                                actionsCancel: () => setAviso(null),
                                                show: true,
                                                actionsConfirmName: label.actions.yes,
                                                actionsConfirm: () => {
                                                    deleteDiaDaSemana(diaDaSemana);
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
                                <td colSpan={4} className="text-center" onClick={() => setDiaDaSemana({  } as DiaDaSemana)}><IconComponent icon={icon.adicionar} />{label.actions.add}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {aviso && <AvisoComponent {...aviso} />}
            {diaDaSemana && <DiaDaSemanaComponent payload={diaDaSemana} setShow={() => { setDiaDaSemana(null) }} setReload={setReload} />}
        </>
    );
}