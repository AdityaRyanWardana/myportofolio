import React, { useState } from "react"
import { Modal, IconButton, Box, Fade, Backdrop, Zoom, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import RotateRightIcon from "@mui/icons-material/RotateRight"

const Certificate = ({ ImgSertif }) => {
	const [open, setOpen] = useState(false)
	const [rotation, setRotation] = useState(0)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setRotation(0) // Reset rotation when modal is closed
	}

	const handleRotate = (e) => {
		e.stopPropagation()
		setRotation((prev) => (prev + 90) % 360)
	}

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				className=""
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
						"& .certificate-image": {
							filter: "contrast(1.05) brightness(1) saturate(1.1)",
						},
					},
				}}>
				{/* Certificate Image with Initial Filter */}
				<Box
					sx={{
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 1,
						},
					}}>
					<img
						className="certificate-image"
						src={ImgSertif}
						alt="Certificate"
						style={{
							width: "100%",
							height: "auto",
							display: "block",
							objectFit: "cover",
							filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
							transition: "filter 0.3s ease",
							aspectRatio: "16/11.5",
						}}
						onClick={handleOpen}
					/>
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0,
						transition: "all 0.3s ease",
						cursor: "pointer",
						zIndex: 2,
					}}
					onClick={handleOpen}>
					{/* Hover Content */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -60%)",
							opacity: 0,
							transition: "all 0.4s ease",
							textAlign: "center",
							width: "100%",
							color: "white",
						}}>
						<FullscreenIcon
							sx={{
								fontSize: 40,
								mb: 1,
								filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
							}}
						/>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								textShadow: "0 2px 4px rgba(0,0,0,0.3)",
							}}>
							View Certificate
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Modal */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						backdropFilter: "blur(5px)",
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
					"& .MuiBackdrop-root": {
						backgroundColor: "rgba(0, 0, 0, 0.9)",
					},
				}}>
				<Box
					sx={{
						position: "relative",
						width: "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						m: 0,
						p: 0,
						outline: "none",
						"&:focus": {
							outline: "none",
						},
					}}>
					{/* Controls (Rotate & Close) */}
					<Box
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							zIndex: 10,
							display: "flex",
							gap: 1.5,
						}}>
						{/* Rotate Button */}
						<IconButton
							onClick={handleRotate}
							sx={{
								color: "white",
								bgcolor: "rgba(0,0,0,0.6)",
								padding: 1,
								"&:hover": {
									bgcolor: "rgba(0,0,0,0.8)",
									transform: "scale(1.1)",
								},
							}}
							size="large"
							title="Rotate 90°">
							<RotateRightIcon sx={{ fontSize: 24 }} />
						</IconButton>

						{/* Close Button */}
						<IconButton
							onClick={handleClose}
							sx={{
								color: "white",
								bgcolor: "rgba(0,0,0,0.6)",
								padding: 1,
								"&:hover": {
									bgcolor: "rgba(0,0,0,0.8)",
									transform: "scale(1.1)",
								},
							}}
							size="large"
							title="Close">
							<CloseIcon sx={{ fontSize: 24 }} />
						</IconButton>
					</Box>

					{/* Modal Image Wrapper with Rotation */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							height: "100%",
							overflow: "hidden",
							p: 4,
						}}>
						<img
							src={ImgSertif}
							alt="Certificate Full View"
							style={{
								display: "block",
								maxWidth: "100%",
								maxHeight: "80vh",
								margin: "0 auto",
								objectFit: "contain",
								transform: `rotate(${rotation}deg)`,
								transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</Box>
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
