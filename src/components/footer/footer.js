import styles from './Footer.module.css';

export default function Footer(setTotalCart) {
    return (
        <div className={styles.footer}>
            <p>Total: {setTotalCart}</p>
        </div>
    )
}