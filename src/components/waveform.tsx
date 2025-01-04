"use client";

import React, { useEffect, useRef } from "react";

interface WaveformProps {
	width?: number | string; // Allows setting custom width (default 100%)
	height?: number | string; // Allows setting custom height (default 100%)
	colors?: string[]; // Allows customizing colors (default gradient)
	amplitude?: number; // Controls wave height
	frequency?: number; // Controls wave frequency
	layers?: number; // Controls number of wave layers
	speed?: number; // Controls animation speed
}

const Waveform: React.FC<WaveformProps> = ({
	width = "100%",
	height = "100%",
	colors = ["#34d399", "#fde047", "#f43f5e"], // Default colors
	amplitude = 100,
	frequency = 0.02,
	layers = 1,
	speed = 0.02,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		let time = 0;

		const drawWaveform = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const numPoints = 200; // Smoothness
			const centerY = canvas.height / 2;
			const segmentWidth = canvas.width / numPoints;

			for (let layer = 0; layer < layers; layer++) {
				ctx.beginPath();

				for (let i = 0; i < numPoints; i++) {
					const x = i * segmentWidth;
					const wave = Math.sin(i * frequency + time + layer);
					const offset = Math.sin(time * 0.2 + layer); // Smooth variation
					const y =
						centerY + amplitude * wave * (1 - Math.abs(offset));

					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}

				// Gradient coloring
				const gradient = ctx.createLinearGradient(
					0,
					0,
					canvas.width,
					0
				);
				gradient.addColorStop(0, colors[0]);
				gradient.addColorStop(0.5, colors[1]);
				gradient.addColorStop(1, colors[2]);

				ctx.strokeStyle = gradient;
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		};

		const animate = () => {
			time += speed;
			drawWaveform();
			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [amplitude, frequency, layers, speed, colors]);

	return (
		<div
			style={{
				width,
				height,
				position: "relative", // Keeps it non-blocking
				overflow: "hidden",
			}}
		>
			<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
		</div>
	);
};

export default Waveform;
