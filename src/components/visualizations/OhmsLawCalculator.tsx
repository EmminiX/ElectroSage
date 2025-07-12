"use client";

import React, { useState, useEffect, useCallback } from "react";
import { VisualizationProps, OhmsLawData } from "./types";
import { Calculator, Zap, Activity, Gauge } from "lucide-react";

interface OhmsLawCalculatorProps extends VisualizationProps {
  showFormulas?: boolean;
  showDiagram?: boolean;
}

export default function OhmsLawCalculator({
  showFormulas = true,
  showDiagram = true,
  interactive = true,
  size = "medium",
  className = "",
  onInteraction,
}: OhmsLawCalculatorProps) {
  const [voltage, setVoltage] = useState<string>("");
  const [current, setCurrent] = useState<string>("");
  const [resistance, setResistance] = useState<string>("");
  const [power, setPower] = useState<string>("");
  const [activeCalculation, setActiveCalculation] = useState<
    "V" | "I" | "R" | "P" | null
  >(null);
  const [calculationMethod, setCalculationMethod] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const validateInputs = (V: number, I: number, R: number, P: number) => {
    const newErrors: string[] = [];
    
    if (V < 0) newErrors.push("Voltage cannot be negative");
    if (I < 0) newErrors.push("Current cannot be negative");
    if (R <= 0 && !isNaN(R)) newErrors.push("Resistance must be positive");
    if (P < 0) newErrors.push("Power cannot be negative");
    if (V > 1000) newErrors.push("Voltage seems unrealistically high (>1000V)");
    if (I > 100) newErrors.push("Current seems unrealistically high (>100A)");
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const formatResult = (value: number): string => {
    if (value === 0) return "0";
    if (value < 0.01) return value.toExponential(2);
    if (value < 1) return value.toFixed(3);
    if (value < 100) return value.toFixed(2);
    return value.toFixed(1);
  };

  const calculateValues = useCallback(() => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const R = parseFloat(resistance);
    const P = parseFloat(power);

    if (!validateInputs(V, I, R, P)) return;

    let newVoltage = voltage;
    let newCurrent = current;
    let newResistance = resistance;
    let newPower = power;
    let method = "";

    // Count how many values are provided
    const values = [V, I, R, P].filter(val => !isNaN(val));
    if (values.length < 2) {
      setErrors(["Please enter at least two values to calculate the others"]);
      return;
    }

    // Calculate missing values based on Ohm's Law and Power formulas
    if (!isNaN(V) && !isNaN(I)) {
      // V and I known
      if (I === 0) {
        setErrors(["Current cannot be zero when calculating resistance"]);
        return;
      }
      newResistance = formatResult(V / I);
      newPower = formatResult(V * I);
      method = "Using V and I: R = V ÷ I, P = V × I";
    } else if (!isNaN(V) && !isNaN(R)) {
      // V and R known
      if (R === 0) {
        setErrors(["Resistance cannot be zero"]);
        return;
      }
      newCurrent = formatResult(V / R);
      newPower = formatResult((V * V) / R);
      method = "Using V and R: I = V ÷ R, P = V² ÷ R";
    } else if (!isNaN(I) && !isNaN(R)) {
      // I and R known
      newVoltage = formatResult(I * R);
      newPower = formatResult(I * I * R);
      method = "Using I and R: V = I × R, P = I² × R";
    } else if (!isNaN(V) && !isNaN(P)) {
      // V and P known
      if (V === 0) {
        setErrors(["Voltage cannot be zero when calculating current"]);
        return;
      }
      newCurrent = formatResult(P / V);
      newResistance = formatResult((V * V) / P);
      method = "Using V and P: I = P ÷ V, R = V² ÷ P";
    } else if (!isNaN(I) && !isNaN(P)) {
      // I and P known
      if (I === 0) {
        setErrors(["Current cannot be zero when calculating voltage"]);
        return;
      }
      newVoltage = formatResult(P / I);
      newResistance = formatResult(P / (I * I));
      method = "Using I and P: V = P ÷ I, R = P ÷ I²";
    } else if (!isNaN(R) && !isNaN(P)) {
      // R and P known
      if (R === 0) {
        setErrors(["Resistance cannot be zero"]);
        return;
      }
      if (P < 0) {
        setErrors(["Cannot calculate square root of negative power"]);
        return;
      }
      newCurrent = formatResult(Math.sqrt(P / R));
      newVoltage = formatResult(Math.sqrt(P * R));
      method = "Using R and P: I = √(P ÷ R), V = √(P × R)";
    } else {
      setErrors(["Please enter a valid combination of two values"]);
      return;
    }

    setVoltage(newVoltage);
    setCurrent(newCurrent);
    setResistance(newResistance);
    setPower(newPower);
    setCalculationMethod(method);
    setErrors([]);

    const data: OhmsLawData = {
      voltage: parseFloat(newVoltage) || undefined,
      current: parseFloat(newCurrent) || undefined,
      resistance: parseFloat(newResistance) || undefined,
      power: parseFloat(newPower) || undefined,
    };

    onInteraction?.(data);
  }, [voltage, current, resistance, power, onInteraction]);

  // Auto-calculate when two or more values are entered
  useEffect(() => {
    const values = [voltage, current, resistance, power].filter(val => val !== "");
    if (values.length >= 2) {
      const timeoutId = setTimeout(() => {
        calculateValues();
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [voltage, current, resistance, power, calculateValues]);

  const clearAll = () => {
    setVoltage("");
    setCurrent("");
    setResistance("");
    setPower("");
    setActiveCalculation(null);
    setCalculationMethod("");
    setErrors([]);
  };

  const loadExample = (exampleType: string) => {
    clearAll();
    switch(exampleType) {
      case 'basic':
        setVoltage("12");
        setCurrent("2");
        break;
      case 'led':
        setVoltage("3.3");
        setCurrent("0.02");
        break;
      case 'household':
        setVoltage("120");
        setPower("60");
        break;
    }
  };

  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      data-oid="kowp2_y"
    >
      <div
        className="flex items-center justify-between mb-6"
        data-oid="eby_u7i"
      >
        <div className="flex items-center space-x-2" data-oid="2k2xvf3">
          <Calculator className="w-6 h-6 text-blue-600" data-oid="5e_k1uh" />
          <h3
            className="text-xl font-semibold text-gray-900"
            data-oid="dvwa-9w"
          >
            Ohm&apos;s Law Calculator
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            onChange={(e) => loadExample(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            value=""
          >
            <option value="">Load Example...</option>
            <option value="basic">Basic Circuit (12V, 2A)</option>
            <option value="led">LED Circuit (3.3V, 20mA)</option>
            <option value="household">Light Bulb (120V, 60W)</option>
          </select>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-oid="z9pu_c-">
        {/* Calculator Inputs */}
        <div className="space-y-4" data-oid="evcm:lg">
          <h4 className="font-medium text-gray-900 mb-3" data-oid=".25pmqu">
            Enter any two values:
          </h4>

          {/* Voltage Input */}
          <div className="flex items-center space-x-3" data-oid="yn-4-a.">
            <div
              className="flex items-center space-x-2 w-20"
              data-oid="3t3no6p"
            >
              <Zap className="w-5 h-5 text-yellow-500" data-oid="28oqmpc" />
              <span className="font-medium text-gray-700" data-oid="92th9a.">
                V
              </span>
            </div>
            <input
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              placeholder="Voltage"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-oid="gprnq2h"
            />

            <span className="text-gray-500 w-12" data-oid="_6qgnvg">
              Volts
            </span>
          </div>

          {/* Current Input */}
          <div className="flex items-center space-x-3" data-oid="xxncx0t">
            <div
              className="flex items-center space-x-2 w-20"
              data-oid="avda5al"
            >
              <Activity className="w-5 h-5 text-blue-500" data-oid="-xchapx" />
              <span className="font-medium text-gray-700" data-oid="rvt.:qc">
                I
              </span>
            </div>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Current"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-oid="0tc8jtt"
            />

            <span className="text-gray-500 w-12" data-oid="pn4z6:-">
              Amps
            </span>
          </div>

          {/* Resistance Input */}
          <div className="flex items-center space-x-3" data-oid="qa89u29">
            <div
              className="flex items-center space-x-2 w-20"
              data-oid="fpt1zdb"
            >
              <Gauge className="w-5 h-5 text-red-500" data-oid="v1d9:_y" />
              <span className="font-medium text-gray-700" data-oid="emx.c27">
                R
              </span>
            </div>
            <input
              type="number"
              value={resistance}
              onChange={(e) => setResistance(e.target.value)}
              placeholder="Resistance"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-oid="le2e75k"
            />

            <span className="text-gray-500 w-12" data-oid=":qv9ql0">
              Ohms
            </span>
          </div>

          {/* Power Input */}
          <div className="flex items-center space-x-3" data-oid="1x_dbu0">
            <div
              className="flex items-center space-x-2 w-20"
              data-oid="71jgze."
            >
              <div
                className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center"
                data-oid="8.8i:o."
              >
                <span
                  className="text-white text-xs font-bold"
                  data-oid="xp11fif"
                >
                  P
                </span>
              </div>
              <span className="font-medium text-gray-700" data-oid="5w2qt1f">
                P
              </span>
            </div>
            <input
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="Power"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-oid="elo9e4g"
            />

            <span className="text-gray-500 w-12" data-oid="ewg_84w">
              Watts
            </span>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <h5 className="text-sm font-medium text-red-800 mb-1">Errors:</h5>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Calculation Method Display */}
          {calculationMethod && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h5 className="text-sm font-medium text-blue-800 mb-1">Formula Used:</h5>
              <p className="text-sm text-blue-700">{calculationMethod}</p>
            </div>
          )}

          <button
            onClick={calculateValues}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={errors.length > 0}
          >
            Calculate
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            💡 Tip: Auto-calculates as you type when you have 2+ values
          </p>

          {/* Results Display - moved here */}
          {(voltage || current || resistance || power) && (
            <div className="bg-green-50 p-4 rounded-lg mt-4" data-oid="oy8fsil">
              <h4
                className="font-medium text-green-900 mb-3"
                data-oid="086m13e"
              >
                Results:
              </h4>
              <div className="space-y-2 text-sm" data-oid="qeql-j5">
                {voltage && (
                  <div className="flex justify-between" data-oid="lh5euca">
                    <span data-oid="zwrp8d8">Voltage:</span>
                    <span data-oid="q3ao4ba">
                      {voltage} V
                    </span>
                  </div>
                )}
                {current && (
                  <div className="flex justify-between" data-oid="ki8ypjt">
                    <span data-oid="2r51k5z">Current:</span>
                    <span data-oid="q6xb:ps">
                      {current} A
                    </span>
                  </div>
                )}
                {resistance && (
                  <div className="flex justify-between" data-oid="ckk2yvr">
                    <span data-oid="qvt0-a7">Resistance:</span>
                    <span data-oid="ag3x64a">
                      {resistance} Ω
                    </span>
                  </div>
                )}
                {power && (
                  <div className="flex justify-between" data-oid="i.scwfc">
                    <span data-oid="p54bg30">Power:</span>
                    <span data-oid="2liw3:7">
                      {power} W
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Formulas and Diagram */}
        <div className="space-y-6" data-oid="e6:w7ui">
          {showFormulas && (
            <div className="bg-gray-50 p-4 rounded-lg" data-oid="2lmpjs4">
              <h4 className="font-medium text-gray-900 mb-3" data-oid="8mr3sr_">
                Formulas:
              </h4>
              <div className="space-y-2 text-sm" data-oid="svwk1xw">
                <div className="grid grid-cols-1 gap-2">
                  <div className="font-medium text-gray-800 mb-2">Ohm&apos;s Law Formulas:</div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-blue-600 font-mono">V = I × R</code>
                    <span className="text-gray-600 ml-2">(Voltage = Current × Resistance)</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-blue-600 font-mono">I = V ÷ R</code>
                    <span className="text-gray-600 ml-2">(Current = Voltage ÷ Resistance)</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-blue-600 font-mono">R = V ÷ I</code>
                    <span className="text-gray-600 ml-2">(Resistance = Voltage ÷ Current)</span>
                  </div>
                  <div className="font-medium text-gray-800 mt-3 mb-2">Power Formulas:</div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-purple-600 font-mono">P = V × I</code>
                    <span className="text-gray-600 ml-2">(Power = Voltage × Current)</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-purple-600 font-mono">P = I² × R</code>
                    <span className="text-gray-600 ml-2">(Power = Current² × Resistance)</span>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <code className="text-purple-600 font-mono">P = V² ÷ R</code>
                    <span className="text-gray-600 ml-2">(Power = Voltage² ÷ Resistance)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Triangle Diagram - moved to right side */}
          {showDiagram && (
            <div className="bg-blue-50 p-4 rounded-lg" data-oid="s3ym:ns">
              <h4 className="font-medium text-blue-900 mb-3" data-oid="1abq2fl">
                Ohm&apos;s Law Triangle:
              </h4>
              <div className="flex justify-center" data-oid="3pvk8s2">
                <div className="relative" data-oid="zn4miti">
                  <svg
                    width="120"
                    height="100"
                    viewBox="0 0 120 100"
                    data-oid="j75jqu_"
                  >
                    {/* Triangle */}
                    <polygon
                      points="60,10 20,80 100,80"
                      fill="white"
                      stroke="#2563EB"
                      strokeWidth="2"
                      data-oid="bplve45"
                    />

                    {/* Dividing lines */}
                    <line
                      x1="60"
                      y1="10"
                      x2="60"
                      y2="80"
                      stroke="#2563EB"
                      strokeWidth="1"
                      data-oid=".gdz-j4"
                    />
                    <line
                      x1="20"
                      y1="80"
                      x2="100"
                      y2="80"
                      stroke="#2563EB"
                      strokeWidth="1"
                      data-oid="o263_03"
                    />
                    {/* Labels */}
                    <text
                      x="60"
                      y="35"
                      textAnchor="middle"
                      className="fill-blue-800 text-lg font-bold"
                      data-oid="qix4ekf"
                    >
                      V
                    </text>
                    <text
                      x="40"
                      y="70"
                      textAnchor="middle"
                      className="fill-blue-800 text-lg font-bold"
                      data-oid="o.dhe0d"
                    >
                      I
                    </text>
                    <text
                      x="80"
                      y="70"
                      textAnchor="middle"
                      className="fill-blue-800 text-lg font-bold"
                      data-oid="nr8bzig"
                    >
                      R
                    </text>
                  </svg>
                </div>
              </div>
              <p
                className="text-xs text-blue-700 mt-2 text-center"
                data-oid="6j5qo:_"
              >
                Cover the unknown value to see the formula
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg" data-oid="0gh-pek">
        <h4 className="font-medium text-yellow-900 mb-2" data-oid="nw9-v6o">
          Quick Tips:
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Enter any two values to automatically calculate the others</li>
          <li>• Voltage (V): Electric potential difference - measured in Volts</li>
          <li>• Current (I): Flow of electric charge - measured in Amperes (Amps)</li>
          <li>• Resistance (R): Opposition to current flow - measured in Ohms (Ω)</li>
          <li>• Power (P): Rate of energy consumption - measured in Watts</li>
          <li>• Use examples from the dropdown to see typical values</li>
        </ul>
      </div>
    </div>
  );
}
