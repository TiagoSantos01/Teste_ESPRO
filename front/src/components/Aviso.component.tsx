import { Button, Modal } from "react-bootstrap";
import { AvisoProps } from "../interfaces/Aviso.interface";
import { IconComponent } from "./Icon.component";

export const AvisoComponent: React.FC<AvisoProps> = ({ show, title, body, actionsConfirm, actionsConfirmName, actionsConfirmIcon, actionsCancel, actionsCancelName, actionsCancelIcon }) => {

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal
                show={show}
                onHide={actionsCancel}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={actionsCancel}>
                        {actionsCancelIcon && <IconComponent icon={actionsCancelIcon} />}
                        {actionsCancelName}
                    </Button>
                    <Button variant="primary" onClick={actionsConfirm}>
                        {actionsConfirmIcon && <IconComponent icon={actionsConfirmIcon} />}
                        {actionsConfirmName}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}