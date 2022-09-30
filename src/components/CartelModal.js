import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const StyledModal = styled.div`
	position: fixed;
	display: flex;
	flex-wrap: wrap;
	top: 24px;
	width: 100%;
	padding: 24px;
	background-color: white;
	img {
		max-width: 300px;
	}
`;

const CartelModal = (props) => {
	return (
		<>
			{props.data.labels && (
				<StyledModal>
					<img src={props.data.image} />
					<div className="closeModal">Cerrar</div>
					<div className="data">
						<p>
							<strong>Etiquetas:</strong>{" "}
							{props.data.labels.map((label, idx) => (
								<span key={idx}>{label}</span>
							))}
						</p>
					</div>
				</StyledModal>
			)}
		</>
	);
};

const modalDiv = document.getElementById("react-modal-data");
const root = createRoot(modalDiv);

// if (modalDiv) {
// 	console.log(window.currentData);

// }

const RenderCartelModal = (props) => {
	root.render(<CartelModal data={props} />);
};

export default RenderCartelModal;
