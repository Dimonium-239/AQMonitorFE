export default function Modal({ title, content, onClose }) {
    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modal: {
            background: 'lightgray',
            color: 'black',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            marginBottom: '10px',
        },
        content: {
            overflowX: 'auto',
            overflowY: 'auto',
            whiteSpace: 'nowrap',
            flexGrow: 1,
            marginBottom: '10px',
            border: '1px solid #aaa',
            padding: '10px',
            borderRadius: '4px',
            background: 'white',
        },
        button: {
            alignSelf: 'flex-end',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            background: 'blue',
            color: 'white',
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>{title}</h3>
                <div style={styles.content}>{content}</div>
                <button onClick={onClose} style={styles.button}>OK</button>
            </div>
        </div>
    );
}