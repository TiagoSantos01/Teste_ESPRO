import {  Container, Row, Table } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { useEffect, useState } from "react";
import { Periodo } from "../interfaces/Periodo.interface";
import { IconComponent } from "../components/Icon.component";
import { AvisoComponent } from "../components/Aviso.component";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { PeriodoComponent } from "../components/Periodo.component";
import { useAlert } from "../context/AlertContext";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Link } from "react-router-dom";

export const PeriodoPage: React.FC = () => {
    const { label, api, apiUrl, icon,route } = useConfig();

    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [aviso, setAviso] = useState<AvisoProps | null>(null);
    const [periodo, setPeriodo] = useState<Periodo | null>(null);
    const { addMessage } = useAlert();

    const init = async (): Promise<void> => {
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
    useEffect(() => {
        document.title = label.page.periodo.title;
        init();
    }, [label.page.periodo.title, reload]);

    const deletePeriodo = async (periodo: Periodo): Promise<void> => {
        await fetch(api.periodo.delete.path.replace('{{url}}', apiUrl).replace(':periodoId', periodo.id.toString()), {
            method: api.periodo.delete.method
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
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <>
            <Container>
                <h1 className="text-center mt-5">{label.page.periodo.title}</h1>
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
                                <th>{label.page.periodo.start}</th>
                                <th>{label.page.periodo.end}</th>
                                <th className="text-center">{label.actions.title}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {periodos.map((periodo) => (
                                <tr key={periodo.id}>
                                    <td>{periodo.id}</td>
                                    <td>{periodo.inicio}</td>
                                    <td>{periodo.fim}</td>
                                    <td className="d-flex justify-content-center">
                                        <button className="btn btn-info btn-sm me-2"
                                            onClick={() => setPeriodo(periodo)}
                                        >
                                            <IconComponent icon={icon.editar} />
                                            {label.actions.edit}
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2"
                                            onClick={() => setAviso({
                                                title: label.actions.delete,
                                                body: label.page.periodo.confirmDelete.replace('{{start}}', periodo.inicio).replace('{{end}}', periodo.fim),
                                                actionsCancelName: label.actions.no,
                                                actionsCancel: () => setAviso(null),
                                                show: true,
                                                actionsConfirmName: label.actions.yes,
                                                actionsConfirm: () => {
                                                    deletePeriodo(periodo);
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
                                <td colSpan={4} className="text-center" onClick={() => setPeriodo({ inicio: '', fim: '' } as Periodo)}><IconComponent icon={icon.adicionar} />{label.actions.add}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {aviso && <AvisoComponent {...aviso} />}
            {periodo && <PeriodoComponent payload={periodo} setShow={() => { setPeriodo(null) }} setReload={setReload} />}

        </>
    );
}