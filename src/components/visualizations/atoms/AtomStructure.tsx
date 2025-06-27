"use client";

import { useEffect, useRef } from "react";

interface AtomStructureProps {
  width?: number;
  height?: number;
  atomType?: "hydrogen" | "helium" | "carbon" | "copper";
}

export default function AtomStructure({
  width = 400,
  height = 400,
  atomType = "carbon",
}: AtomStructureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    // Atom configurations
    const atoms = {
      hydrogen: { protons: 1, neutrons: 0, electrons: 1, shells: [1] },
      helium: { protons: 2, neutrons: 2, electrons: 2, shells: [2] },
      carbon: { protons: 6, neutrons: 6, electrons: 6, shells: [2, 4] },
      copper: {
        protons: 29,
        neutrons: 34,
        electrons: 29,
        shells: [2, 8, 18, 1],
      },
    };

    const atom = atoms[atomType];
    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw nucleus
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fill();

      // Draw protons
      for (let i = 0; i < atom.protons; i++) {
        const protonAngle = (i / atom.protons) * 2 * Math.PI;
        const protonX = centerX + Math.cos(protonAngle) * 10;
        const protonY = centerY + Math.sin(protonAngle) * 10;

        ctx.fillStyle = "#ff6b6b";
        ctx.beginPath();
        ctx.arc(protonX, protonY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw neutrons
      for (let i = 0; i < atom.neutrons; i++) {
        const neutronAngle =
          (i / atom.neutrons) * 2 * Math.PI + Math.PI / atom.neutrons;
        const neutronX = centerX + Math.cos(neutronAngle) * 7;
        const neutronY = centerY + Math.sin(neutronAngle) * 7;

        ctx.fillStyle = "#95a5a6";
        ctx.beginPath();
        ctx.arc(neutronX, neutronY, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw electron shells and electrons
      let electronIndex = 0;
      atom.shells.forEach((shellElectrons, shellIndex) => {
        const shellRadius = 50 + shellIndex * 40;

        // Draw shell
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw electrons in this shell
        for (let i = 0; i < shellElectrons; i++) {
          const electronAngle =
            angle + (electronIndex / atom.electrons) * 2 * Math.PI;
          const electronX = centerX + Math.cos(electronAngle) * shellRadius;
          const electronY = centerY + Math.sin(electronAngle) * shellRadius;

          ctx.fillStyle = "#74b9ff";
          ctx.beginPath();
          ctx.arc(electronX, electronY, 4, 0, 2 * Math.PI);
          ctx.fill();

          electronIndex++;
        }
      });

      angle += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, atomType]);

  return (
    <div className="flex flex-col items-center p-4" data-oid="4eze-40">
      <h3 className="text-lg font-semibold mb-2 capitalize" data-oid="7v1xjc2">
        {atomType} Atom
      </h3>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg"
        style={{ maxWidth: "100%", height: "auto" }}
        data-oid="k:ke3h3"
      />

      <AtomInfo atomType={atomType} data-oid="b_sd576" />
    </div>
  );
}

function AtomInfo({
  atomType,
}: {
  atomType: "hydrogen" | "helium" | "carbon" | "copper";
}) {
  const atoms = {
    hydrogen: { protons: 1, neutrons: 0, electrons: 1 },
    helium: { protons: 2, neutrons: 2, electrons: 2 },
    carbon: { protons: 6, neutrons: 6, electrons: 6 },
    copper: { protons: 29, neutrons: 34, electrons: 29 },
  };

  const atom = atoms[atomType];

  return (
    <div className="mt-4 text-sm space-y-1" data-oid="9bb06db">
      <div className="flex items-center gap-2" data-oid="lifksxj">
        <div
          className="w-3 h-3 bg-atom-proton rounded-full"
          data-oid="m1oi5ph"
        ></div>
        <span data-oid="y7vnsh-">Protons: {atom.protons}</span>
      </div>
      <div className="flex items-center gap-2" data-oid="-fqnrzy">
        <div
          className="w-3 h-3 bg-atom-neutron rounded-full"
          data-oid="gfp64lk"
        ></div>
        <span data-oid="d99g2rf">Neutrons: {atom.neutrons}</span>
      </div>
      <div className="flex items-center gap-2" data-oid=".g5::1d">
        <div
          className="w-3 h-3 bg-atom-electron rounded-full"
          data-oid="l-o8kck"
        ></div>
        <span data-oid="4b.1mve">Electrons: {atom.electrons}</span>
      </div>
    </div>
  );
}
