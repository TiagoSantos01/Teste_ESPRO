import { Col, Container, Row, Table } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { AlertEnum } from "../enum/AlertEnum.enum";
import { Link } from "react-router-dom";
import { IconComponent } from "../components/Icon.component";
import { MateriaComponent } from "../components/Materia.component";
import { AvisoComponent } from "../components/Aviso.component";
import { useEffect, useState } from "react";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { useAlert } from "../context/AlertContext";
import { Materia } from "../interfaces/Materia.interface";

export const MateriaPage: React.FC = () => {
   const { label, api, apiUrl, icon, route } = useConfig();

    const [materias, setMaterias] = useState<Materia[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [aviso, setAviso] = useState<AvisoProps | null>(null);
    const [materia, setMateria] = useState<Materia | null>(null);
    const { addMessage } = useAlert();

    const init = async (): Promise<void> => {
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
    useEffect(() => {
        document.title = label.page.materia.title;
        init();
    }, [label.page.materia.title, reload]);

    const deleteMateria = async (materia: Materia): Promise<void> => {
        await fetch(api.materia.delete.path.replace('{{url}}', apiUrl).replace(':materiaId', materia.id.toString()), {
            method: api.materia.delete.method
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
                <h1 className="text-center mt-5">{label.page.materia.title}</h1>
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
                                <th>{label.page.materia.name}</th>
                                <th className="text-center">{label.actions.title}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {materias.map((materia) => (
                                <tr key={materia.id}>
                                    <td>{materia.id}</td>
                                    <td>{materia.nome}</td>
                                    <td className="d-flex justify-content-center">
                                        <button className="btn btn-info btn-sm me-2"
                                            onClick={() => setMateria(materia)}
                                        >
                                            <IconComponent icon={icon.editar} />
                                            {label.actions.edit}
                                        </button>
                                        <button className="btn btn-danger btn-sm me-2"
                                            onClick={() => setAviso({
                                                title: label.actions.delete,
                                                body: label.page.materia.confirmDelete.replace('{{name}}', materia.nome),
                                                actionsCancelName: label.actions.no,
                                                actionsCancel: () => setAviso(null),
                                                show: true,
                                                actionsConfirmName: label.actions.yes,
                                                actionsConfirm: () => {
                                                    deleteMateria(materia);
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
                                <td colSpan={4} className="text-center" onClick={() => setMateria({ nome: '' } as Materia)}><IconComponent icon={icon.adicionar} />{label.actions.add}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </Container>
            {aviso && <AvisoComponent {...aviso} />}
            {materia && <MateriaComponent payload={materia} setShow={() => { setMateria(null) }} setReload={setReload} />}
        </>
    );
}