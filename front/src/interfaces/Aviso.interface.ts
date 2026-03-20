export interface AvisoProps {
    title: string;
    body: string;
    actionsConfirm: () => void;
    actionsConfirmName: string;
    actionsConfirmIcon?: string;
    actionsCancel: () => void;
    actionsCancelName: string;
    actionsCancelIcon?: string;
    show: boolean;
}