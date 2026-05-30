import { useState } from "react";
import { createPortal } from "react-dom";

const ModalImpl = ({
	visible,
	setIsVisible,
}: {
	visible: boolean;
	setIsVisible: (v: boolean) => void;
}) => {
	if (!visible) {
		return null;
	}

	return createPortal(
		<div
			id="modal-container"
			className="modal-overlay"
			onClick={() => setIsVisible(false)}
		>
			<div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
				<h2>Modal Header</h2>
				<button
					type="button"
					className="secondary-btn"
					onClick={() => setIsVisible(false)}
				>
					Close
				</button>
			</div>
		</div>,
		document.getElementById("root") || document.body,
	);
};

export default function Modal() {
	const [visible, setIsVisible] = useState(false);
	return (
		<>
			<h1>Modal</h1>
			<button
				type="button"
				className="primary-btn"
				onClick={() => setIsVisible(true)}
			>
				Open Modal
			</button>
			<ModalImpl visible={visible} setIsVisible={setIsVisible} />
		</>
	);
}
