"use client";

import { useRef, useEffect } from "react";

interface SeriesCircuitProps {
  width?: number;
  height?: number;
}

const SeriesCircuit: React.FC<SeriesCircuitProps> = ({
  width = 300,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = width;
    canvas.height = height;

    // Define circuit components
    const bulbRadius = 15;
    const batteryWidth = 40;
    const wireLength = width / 2 - batteryWidth / 2 - bulbRadius;

    // Draw circuit
    const drawCircuit = () => {
      context.clearRect(0, 0, width, height);

      // Wires
      context.strokeStyle = "gray";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(batteryWidth / 2, height / 2);
      context.lineTo(wireLength, height / 2);
      context.moveTo(wireLength + 2 * bulbRadius, height / 2);
      context.lineTo(width - batteryWidth / 2, height / 2);
      context.stroke();

      // Bulb
      context.fillStyle = "yellow";
      context.beginPath();
      context.arc(
        wireLength + bulbRadius,
        height / 2,
        bulbRadius,
        0,
        2 * Math.PI,
      );
      context.fill();
      context.stroke();

      // Battery
      context.strokeStyle = "black";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(width - batteryWidth, height / 2 - 10);
      context.lineTo(width - batteryWidth, height / 2 + 10);
      context.moveTo(width - batteryWidth / 2, height / 2 - 10);
      context.lineTo(width - batteryWidth / 2, height / 2 + 10);
      context.stroke();
    };

    const animate = () => {
      drawCircuit();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <div className="p-2" data-oid="3h5df2q">
      <h3 className="text-lg font-semibold mb-2" data-oid="3al9-yf">
        Series Circuit
      </h3>
      <canvas
        ref={canvasRef}
        className="border border-gray-300"
        data-oid="jxcrawy"
      />
    </div>
  );
};

export default SeriesCircuit;
