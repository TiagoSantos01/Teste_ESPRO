import { Col, Container, Row } from "react-bootstrap";
import { useConfig } from "../hooks/useConfig";

export const SalaPage: React.FC = () => {
    const { label } = useConfig();

    return (
        <>
            <Container>
                <h1 className="text-center mt-5">{label.page.sala.title}</h1>
                <Row>
                   
                </Row>
            </Container>
        </>
    );
}