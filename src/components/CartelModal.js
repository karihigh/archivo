import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

const CartelModal = (props) => {
	if (props.data.comments) {
		console.log(props.data.comments.split(";"));
	}

	return (
		<>
			{props.data.labels ? (
				<>
					<div className="modal-overlay"></div>
					<div className="modal archivo-carteles-modal" tabIndex="-1">
						<Helmet>
							<script>
								document.body.style.overflow = "hidden";
							</script>
						</Helmet>

						<div className="modal-dialog modal-xl modal-fullscreen-sm-down">
							<div className="modal-content">
								<div className="modal-header">
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Cerrar"
									></button>
								</div>
								<div className="modal-body">
									<div className="container">
										<div className="row">
											<div className="col-md-12 col-lg-7">
												<img src={props.data.image} />
											</div>

											<div className="data col-lg-5 col-md-12">
												<div className="datasection">
													<strong>
														ID{" "}
														{props.data.shortcode}
													</strong>
												</div>
												<div className="datasection">
													<strong>Fecha</strong>{" "}
													{props.data.date}
												</div>
												<div className="datasection">
													<a
														href={`https://instagram.com/p/${props.data.shortcode}`}
													>
														Link
													</a>
												</div>
												<div className="datasection">
													<strong>
														Texto detectado
													</strong>
													{props.data.words.map(
														(word, idx) => (
															<span key={idx}>
																{word}
															</span>
														)
													)}
												</div>
												<div className="datasection">
													<strong>Etiquetas</strong>{" "}
													{props.data.labels.map(
														(label, idx) => (
															<span key={idx}>
																{label}
															</span>
														)
													)}
												</div>
												<div className="datasection">
													<strong>Objetos</strong>
													{props.data.objects.map(
														(object, idx) => (
															<span key={idx}>
																{object}
															</span>
														)
													)}
												</div>

												{props.data.comments && (
													<div className="datasection">
														<strong>
															Comentarios
														</strong>
														{props.data.comments
															.split(";")
															.map(
																(
																	comment,
																	idx
																) => (
																	<p
																		key={
																			idx
																		}
																	>
																		{
																			comment
																		}
																	</p>
																)
															)}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
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
