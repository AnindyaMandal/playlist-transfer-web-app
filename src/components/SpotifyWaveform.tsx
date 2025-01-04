"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { AudioLines } from "lucide-react";

interface AudioWaveformProps {
	width?: number | string;
	height?: number | string;
	colors?: string[];
	layers?: number;
	frequency?: number;
	speed?: number;
	audioSrc: string; // Path to an audio file (required)
	isPlaying: boolean; // Control playback externally
	onPlay: () => void; // Play button handler
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
	width = "100%",
	height = "100%",
	colors = ["#34d399", "#fde047", "#f43f5e"],
	layers = 3,
	frequency = 0.02,
	speed = 0.02,
	audioSrc,
	isPlaying,
	onPlay,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
	const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Resize canvas to match parent size
		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Initialize Audio Context
		const initAudio = async () => {
			if (!audioSrc || audioRef.current) return;

			const audio = new Audio(audioSrc);
			audio.crossOrigin = "anonymous"; // Allow cross-origin streaming
			audio.loop = true; // Loop audio

			const audioContext = new (window.AudioContext ||
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).webkitAudioContext)();
			const analyserNode = audioContext.createAnalyser();
			const source = audioContext.createMediaElementSource(audio);
			source.connect(analyserNode);
			analyserNode.connect(audioContext.destination);

			analyserNode.fftSize = 256;
			const bufferLength = analyserNode.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			setAnalyser(analyserNode);
			setDataArray(dataArray);

			audioRef.current = audio; // Store audio reference
		};

		initAudio();

		let time = 0;

		const drawWaveform = () => {
			if (!analyser || !dataArray) return;

			analyser.getByteFrequencyData(dataArray);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const numPoints = dataArray.length;
			const centerY = canvas.height / 2;
			const segmentWidth = canvas.width / numPoints;

			for (let layer = 0; layer < layers; layer++) {
				ctx.beginPath();

				for (let i = 0; i < numPoints; i++) {
					const amplitude = dataArray[i] / 255; // Normalize audio data
					const wave = Math.sin(i * frequency + time + layer); // Wave pattern
					const offset = Math.sin(time * 0.2 + layer); // Slow oscillation
					const y =
						centerY +
						amplitude * 100 * wave * (1 - Math.abs(offset));

					const x = i * segmentWidth;

					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}

				// Gradient
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
			audioRef.current?.pause(); // Stop audio playback when unmounted
		};
	}, [audioSrc, frequency, layers, speed, colors]);

	// Handle play/pause when isPlaying changes
	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]);

	return (
		<div
			style={{
				width,
				height,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<canvas ref={canvasRef} style={{ width: "100%", height: "75%" }} />

			<Button size={"xl"} onClick={onPlay}>
				<AudioLines size={48} />
				{isPlaying ? "Pause" : "Play"}
			</Button>
		</div>
	);
};

export default AudioWaveform;
