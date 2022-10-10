import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Helmet } from "react-helmet";

const StyledModal = styled.div`
	position: fixed;
	z-index: 20;
	display: flex;
	flex-wrap: wrap;
	top: 24px;
	left: 24px;
	padding: 24px;
	background-color: white;
	width: 90%;
	margin: 15px auto;
	img {
		max-width: 300px;
	}
`;

const ModalBody = styled.div`
	display: flex;
	img {
		margin-right: 12px;
	}
	.data {
		padding: 48px 6px 6px;
	}
`;

const DataSection = styled.div`
	padding: 6px;

	span {
		display: inline-block;
		padding: 4px;
	}

	border: 1px solid #333;
	margin: 12px;
`;

const Overlay = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.65);
	z-index: 10;
`;

const CloseButton = styled.div`
	position: absolute;
	right: 24px;
	top: 24px;
	z-index: 40;
	background-color: white;
	cursor: pointer;
	text-transform: uppercase;
	padding: 4px;
	border: 1px solid #333;
`;

const CartelModal = (props) => {
	if (props.data.comments) {
		console.log(props.data.comments.split(";"));
	}

	return (
		<>
			{props.data.labels ? (
				<>
					<Overlay></Overlay>
					<StyledModal>
						<Helmet>
							<script>
								document.body.style.overflow = "hidden";
							</script>
						</Helmet>
						<CloseButton id="closeModal">Cerrar</CloseButton>
						<ModalBody>
							<img src={props.data.image} />
							<div className="data">
								<DataSection>
									<strong>Fecha:</strong> {props.data.date}
								</DataSection>
								<DataSection>
									<a
										href={`https://instagram.com/p/${props.data.shortcode}`}
									>
										Link
									</a>
								</DataSection>
								<DataSection>
									<strong>Palabras identificadas</strong>
									{props.data.words.map((word, idx) => (
										<span key={idx}>{word}</span>
									))}
								</DataSection>
								<DataSection>
									<strong>Etiquetas:</strong>{" "}
									{props.data.labels.map((label, idx) => (
										<span key={idx}>{label}</span>
									))}
								</DataSection>
								<DataSection>
									<strong>Objetos</strong>
									{props.data.objects.map((object, idx) => (
										<span key={idx}>{object}</span>
									))}
								</DataSection>

								{props.data.comments && (
									<DataSection>
										<strong>Comentarios</strong>
										{props.data.comments
											.split(";")
											.map((comment, idx) => (
												<p>{comment}</p>
											))}
									</DataSection>
								)}
							</div>
						</ModalBody>
					</StyledModal>
				</>
			) : (
				<>
					<Helmet>
						<script>document.body.style.overflow = "auto";</script>
					</Helmet>
				</>
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
