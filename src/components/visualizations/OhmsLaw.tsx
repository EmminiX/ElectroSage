"use client";

import { useState, useEffect } from "react";

export default function OhmsLaw() {
  const [voltage, setVoltage] = useState(12); // V
  const [resistance, setResistance] = useState(4); // Ω
  const [current, setCurrent] = useState(0); // A
  const [calculationMode, setCalculationMode] = useState<
    "current" | "voltage" | "resistance"
  >("current");

  useEffect(() => {
    switch (calculationMode) {
      case "current":
        setCurrent(voltage / resistance);
        break;
      case "voltage":
        setVoltage(current * resistance);
        break;
      case "resistance":
        setResistance(voltage / current);
        break;
    }
  }, [voltage, resistance, current, calculationMode]);

  const handleVoltageChange = (value: number) => {
    setVoltage(value);
    if (calculationMode === "voltage") {
      setCalculationMode("current");
    }
  };

  const handleResistanceChange = (value: number) => {
    setResistance(value);
    if (calculationMode === "resistance") {
      setCalculationMode("current");
    }
  };

  const handleCurrentChange = (value: number) => {
    setCurrent(value);
    if (calculationMode === "current") {
      setCalculationMode("voltage");
    }
  };

  return (
    <div
      className="p-6 bg-white rounded-lg shadow-sm border"
      data-oid="ela.5yu"
    >
      <h3 className="text-xl font-bold mb-4 text-center" data-oid="m79bsqn">
        Ohm&apos;s Law Calculator
      </h3>

      {/* Ohm's Law Triangle */}
      <div className="flex justify-center mb-6" data-oid=".:gsyy2">
        <div className="relative w-32 h-32" data-oid="dv-5mkc">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            data-oid="ycufsrv"
          >
            <polygon
              points="50,10 10,90 90,90"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              data-oid="8bhclk2"
            />

            <line
              x1="10"
              y1="90"
              x2="90"
              y2="90"
              stroke="#0ea5e9"
              strokeWidth="1"
              data-oid="5nkijk0"
            />
            <line
              x1="50"
              y1="50"
              x2="90"
              y2="90"
              stroke="#0ea5e9"
              strokeWidth="1"
              data-oid=".zt906i"
            />

            <text
              x="50"
              y="35"
              textAnchor="middle"
              className="fill-gray-800 text-lg font-bold"
              data-oid="jgz2u.r"
            >
              V
            </text>
            <text
              x="25"
              y="85"
              textAnchor="middle"
              className="fill-gray-800 text-lg font-bold"
              data-oid="z35kd3w"
            >
              I
            </text>
            <text
              x="75"
              y="85"
              textAnchor="middle"
              className="fill-gray-800 text-lg font-bold"
              data-oid="mgx_rrb"
            >
              R
            </text>
          </svg>
        </div>
      </div>

      {/* Formula Display */}
      <div className="text-center mb-6" data-oid="6j-53qe">
        <div className="bg-gray-100 p-4 rounded-lg" data-oid="g3gt3u:">
          <div className="text-lg font-mono" data-oid="6n3x9sf">
            V = I × R | I = V ÷ R | R = V ÷ I
          </div>
          <div className="text-sm text-gray-600 mt-2" data-oid="5h7idq:">
            V = Voltage (volts), I = Current (amperes), R = Resistance (ohms)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4" data-oid="d8j3otv">
        {/* Voltage */}
        <div className="flex items-center justify-between" data-oid="puywcix">
          <label className="font-medium text-gray-700 w-24" data-oid="-3low:i">
            Voltage (V):
          </label>
          <input
            type="range"
            min="1"
            max="24"
            step="0.1"
            value={voltage}
            onChange={(e) => handleVoltageChange(Number(e.target.value))}
            className="flex-1 mx-4"
            data-oid="rsthuaa"
          />

          <span className="w-20 text-right font-mono" data-oid="z3mhhe_">
            {voltage.toFixed(1)} V
          </span>
        </div>

        {/* Resistance */}
        <div className="flex items-center justify-between" data-oid="3b2i0f6">
          <label className="font-medium text-gray-700 w-24" data-oid="kkvua14">
            Resistance (Ω):
          </label>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={resistance}
            onChange={(e) => handleResistanceChange(Number(e.target.value))}
            className="flex-1 mx-4"
            data-oid="e75ivv-"
          />

          <span className="w-20 text-right font-mono" data-oid="3._vm6o">
            {resistance.toFixed(1)} Ω
          </span>
        </div>

        {/* Current */}
        <div className="flex items-center justify-between" data-oid=".ri-.8l">
          <label className="font-medium text-gray-700 w-24" data-oid="2v5o210">
            Current (A):
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={current}
            onChange={(e) => handleCurrentChange(Number(e.target.value))}
            className="flex-1 mx-4"
            data-oid="cc:v:dj"
          />

          <span className="w-20 text-right font-mono" data-oid="-f8:eya">
            {current.toFixed(2)} A
          </span>
        </div>
      </div>

      {/* Current Calculation Display */}
      <div className="mt-6 p-4 bg-electric-50 rounded-lg" data-oid="tv:k.57">
        <h4 className="font-semibold mb-2" data-oid="lrfc3oq">
          Current Calculation:
        </h4>
        <div className="font-mono text-sm" data-oid="o8pz0hv">
          {calculationMode === "current" && (
            <div data-oid="mpimetu">
              I = V ÷ R = {voltage.toFixed(1)} ÷ {resistance.toFixed(1)} ={" "}
              {current.toFixed(2)} A
            </div>
          )}
          {calculationMode === "voltage" && (
            <div data-oid="1l697u3">
              V = I × R = {current.toFixed(2)} × {resistance.toFixed(1)} ={" "}
              {voltage.toFixed(1)} V
            </div>
          )}
          {calculationMode === "resistance" && (
            <div data-oid="jjgqcwt">
              R = V ÷ I = {voltage.toFixed(1)} ÷ {current.toFixed(2)} ={" "}
              {resistance.toFixed(1)} Ω
            </div>
          )}
        </div>
      </div>

      {/* Power Calculation */}
      <div className="mt-4 p-4 bg-amber-50 rounded-lg" data-oid="yb71_ly">
        <h4 className="font-semibold mb-2" data-oid="8mq8bnn">
          Power Calculation:
        </h4>
        <div className="font-mono text-sm" data-oid="3gk.tp-">
          P = V × I = {voltage.toFixed(1)} × {current.toFixed(2)} ={" "}
          {(voltage * current).toFixed(2)} W
        </div>
      </div>
    </div>
  );
}
