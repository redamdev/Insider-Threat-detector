import styles from '../styles/LoadingSpinner.module.css';

// LoadingSpinner component
export function LoadingSpinner() {
  return (
    <div className={styles.main}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>This may take a while...</p>
    </div>
  );
}