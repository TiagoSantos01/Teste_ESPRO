export const IconComponent: React.FC<{ icon: string }> = ({ icon }) => {

    return (
        <img src={icon} alt={icon} width={24} height={24} style={{ margin: 3 }} />
    );
}