import styles from './Footer.module.css';

export default function Footer(menuItem) {
    return (
        <div className={styles.footer}>
            <p>Nome: {menuItem.name}</p>
            <p><button>-</button><input type='number'/><button>+</button></p>
            <p><button>Adicionar</button></p>
        </div>
    )
}