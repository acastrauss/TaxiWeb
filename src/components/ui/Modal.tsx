import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	title?: string;
	disabled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	title = 'Modal Title',
	disabled,
}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2 className={styles.title}>{title}</h2>
					<button
						className={styles.closeButton}
						onClick={onClose}
						disabled={disabled}
					>
						&times;
					</button>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
