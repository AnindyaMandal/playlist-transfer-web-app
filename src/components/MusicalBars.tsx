"use client";
import { useEffect, useState, useRef } from "react";

export default function MusicalBars() {
	// const getBarCount = () => {
	// 	if (window.innerWidth < 640) return 20; // Small screens (e.g., mobile)
	// 	if (window.innerWidth < 1024) return 40; // Medium screens (e.g., tablets)
	// 	return 90; // Large screens (e.g., desktop)
	// };

	// // State for bar heights and number of bars
	// const [bars, setBars] = useState<number[]>(
	// 	Array.from(
	// 		{ length: getBarCount() },
	// 		() => Math.floor(Math.random() * 40) + 10
	// 	)
	// );

	// // Use a ref to persist bars across renders without triggering useEffect
	// const barsRef = useRef(bars);

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		const barCount = getBarCount();
	// 		const newBars = Array.from(
	// 			{ length: barCount },
	// 			() => Math.floor(Math.random() * 40) + 10
	// 		);
	// 		setBars(newBars);
	// 		barsRef.current = newBars;
	// 	};

	// 	// Set up resize listener
	// 	window.addEventListener("resize", handleResize);
	// 	const interval = setInterval(() => {
	// 		// Generate new heights
	// 		const newHeights = barsRef.current.map(
	// 			() => Math.floor(Math.random() * 40) + Math.random() * 10
	// 		);
	// 		setBars(newHeights);
	// 		barsRef.current = newHeights; // Update the ref to the latest heights
	// 	}, 300);

	// 	return () => {
	// 		clearInterval(interval);
	// 		window.removeEventListener("resize", handleResize);
	// 	};
	// }, []); // No dynamic dependencies

	// const getBarColor = (index: number, totalBars: number) => {
	// 	const gradientRatio = index / (totalBars - 1); // Normalize index between 0 and 1

	// 	// Left bar color (green): rgb(30, 215, 96)
	// 	const startR = 30,
	// 		startG = 215,
	// 		startB = 96;

	// 	// Right bar color (red): rgb(255, 0, 51)
	// 	const endR = 255,
	// 		endG = 0,
	// 		endB = 51;

	// 	// Interpolate the RGB values based on gradientRatio
	// 	const r = Math.floor(startR + (endR - startR) * gradientRatio);
	// 	const g = Math.floor(startG + (endG - startG) * gradientRatio);
	// 	const b = Math.floor(startB + (endB - startB) * gradientRatio);

	// 	return `rgb(${r}, ${g}, ${b})`;
	// };

	// State for bar heights
	const [bars, setBars] = useState<number[]>([]);
	// State for the number of bars
	const [barCount, setBarCount] = useState<number>(50); // Default to 50 bars initially

	// Reference to persist bar heights across renders
	const barsRef = useRef<number[]>([]);

	// Function to update bar count based on window width
	const getBarCount = () => {
		if (typeof window !== "undefined") {
			const width = window.innerWidth;
			// Adjust bar count based on width
			if (width <= 640) return 20; // Small screens
			if (width <= 1024) return 40; // Medium screens
			return 90; // Large screens
		}
		return 50; // Default fallback for SSR
	};

	// Update bar count on mount and window resize
	useEffect(() => {
		// Set the initial bar count
		setBarCount(getBarCount());

		// Handle resizing dynamically
		const handleResize = () => {
			setBarCount(getBarCount());
		};

		window.addEventListener("resize", handleResize);

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Initialize bar heights and update dynamically
	useEffect(() => {
		// Generate initial random heights for the bars
		const initialBars = Array.from(
			{ length: barCount },
			() => Math.floor(Math.random() * 40) + 10
		);
		setBars(initialBars);
		barsRef.current = initialBars;

		// Animate the bars
		const interval = setInterval(() => {
			const newHeights = barsRef.current.map(() =>
				Math.floor(Math.random() * (Math.random() * 100))
			);
			setBars(newHeights);
			barsRef.current = newHeights;
		}, 300);

		return () => clearInterval(interval);
	}, [barCount]); // Re-run when the bar count changes

	// Function to calculate bar color
	const getBarColor = (index: number, totalBars: number) => {
		const gradientRatio = index / (totalBars - 1);

		// Left bar color (green): rgb(30, 215, 96)
		const startR = 30,
			startG = 215,
			startB = 96;

		// Right bar color (red): rgb(255, 0, 51)
		const endR = 255,
			endG = 0,
			endB = 51;

		const r = Math.floor(startR + (endR - startR) * gradientRatio);
		const g = Math.floor(startG + (endG - startG) * gradientRatio);
		const b = Math.floor(startB + (endB - startB) * gradientRatio);

		return `rgb(${r}, ${g}, ${b})`;
	};

	return (
		<div
			className="flex space-x-2 items-end h-[25vh] w-full"
			// className="flex space-x-1 h-[150px] sm:h-[200px] md:h-[250px] w-full relative items-end"
		>
			{bars.map((height, index) => (
				<div
					key={index}
					style={{
						height: `${height}%`,
						backgroundColor: getBarColor(index, bars.length),
						transition: "height 1s ease-in-out", // Smooth transition
						transformOrigin: "bottom",
					}}
					// className="w-2 rounded"
					className="w-1 sm:w-2 md:w-3 rounded"
				></div>
			))}
		</div>
	);
}
