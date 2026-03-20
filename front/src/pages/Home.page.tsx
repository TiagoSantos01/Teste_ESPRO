import { Button, Col, Container, Row } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
    const { label, route, icon } = useConfig();

    const pages = [
        { name: label.page.turma.name, path: route.turma , icon: icon.turma },
        { name: label.page.aluno.name, path: route.aluno, icon: icon.aluno },
        { name: label.page.sala.name, path: route.sala , icon: icon.sala },
        { name: label.page.materia.name, path: route.materia, icon: icon.materia },
        { name: label.page.periodo.name, path: route.periodo, icon: icon.periodo },
        { name: label.page.diaDaSemana.name, path: route.diaDaSemana, icon: icon.diaDaSemana },
    ];
    return (
        <>
            <Container>
                <h1 className="text-center mt-5">{label.page.home.title}</h1>

                <Row className="justify-content-center">
                    <Col className="col-6">
                        <Row>
                            {pages.map((page) => (
                                <Col key={page.path} xs={12} sm={6} lg={6} className="text-center mt-3">
                                    <Link to={page.path}>
                                    <Button onClick={() => console.log(`Navigating to ${page.path}`)} className="w-100" >
                                        {page.icon && <img src={page.icon} alt="icon" />}
                                        {page.name}
                                    </Button>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>

    );
}