import React, { useState, useEffect } from "react";

export default function PricingCalculator() {
  const [storage, setStorage] = useState(1000);
  const [egressPercent, setEgressPercent] = useState(50);

  // Calculate costs
  const egress = Math.round((storage * egressPercent) / 100);

  // Tigris calculations
  const tigrisFreeStorage = Math.min(storage, 5);
  const tigrisPaidStorage = Math.max(0, storage - 5);
  const tigrisStorageCost = tigrisPaidStorage * 0.02;
  const tigrisTotal = tigrisStorageCost;

  // Other provider calculations
  const otherPaidStorage = Math.max(0, storage - 5);
  const otherStorageCost = otherPaidStorage * 0.023;
  const otherEgressCost = egress * 0.09;
  const otherTotal = otherStorageCost + otherEgressCost;

  const savings = otherTotal - tigrisTotal;

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3>Storage Cost Comparison</h3>
      </div>

      <div className="calculator-controls">
        <div className="control-group">
          <label htmlFor="storageSlider">Storage Amount (GB):</label>
          <input
            type="range"
            id="storageSlider"
            min="100"
            max="5000"
            value={storage}
            onChange={(e) => setStorage(parseInt(e.target.value))}
            step="100"
            className="storage-slider"
            style={{
              "--slider-value": `${((storage - 100) / (5000 - 100)) * 100}%`,
            }}
          />
          <div className="slider-labels">
            <span>100 GB</span>
            <span className="current-value">{storage.toLocaleString()} GB</span>
            <span>5000 GB</span>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="egressSlider">Egress Amount (% of Storage):</label>
          <input
            type="range"
            id="egressSlider"
            min="0"
            max="500"
            value={egressPercent}
            onChange={(e) => setEgressPercent(parseInt(e.target.value))}
            step="10"
            className="egress-slider"
            style={{
              "--slider-value": `${(egressPercent / 500) * 100}%`,
            }}
          />
          <div className="slider-labels">
            <span>0%</span>
            <span className="current-value">
              {egressPercent}% ({egress.toLocaleString()} GB)
            </span>
            <span>500%</span>
          </div>
        </div>
      </div>

      <div className="comparison-chart">
        <div className="chart-row">
          <div className="provider-label">Tigris</div>
          <div className="chart-bar-container">
            <div
              className="chart-bar tigris-bar"
              style={{
                width:
                  Math.max(
                    (tigrisTotal / Math.max(tigrisTotal, otherTotal, 1)) * 100,
                    20,
                  ) + "%",
              }}
            >
              {tigrisFreeStorage > 0 && (
                <div
                  className="bar-section free-section"
                  style={{
                    flexGrow: tigrisFreeStorage * 0.02,
                    minWidth: "60px",
                  }}
                >
                  <span>Free</span>
                </div>
              )}
              {tigrisPaidStorage > 0 && (
                <div
                  className="bar-section storage-section"
                  style={{
                    flexGrow: tigrisPaidStorage * 0.02,
                    minWidth: "60px",
                  }}
                >
                  <span>Storage</span>
                </div>
              )}
            </div>
          </div>
          <div className="cost-label">${tigrisTotal.toFixed(2)}</div>
        </div>

        <div className="chart-row">
          <div className="provider-label">
            Other
            <br />
            Providers
          </div>
          <div className="chart-bar-container">
            <div
              className="chart-bar other-bar"
              style={{
                width:
                  Math.max(
                    (otherTotal / Math.max(tigrisTotal, otherTotal, 1)) * 100,
                    20,
                  ) + "%",
              }}
            >
              {Math.min(storage, 5) * 0.023 + Math.min(egress, 15) * 0.09 >
                0 && (
                <div
                  className="bar-section free-section"
                  style={{
                    flexGrow:
                      Math.min(storage, 5) * 0.023 +
                      Math.min(egress, 15) * 0.09,
                    minWidth: "60px",
                  }}
                >
                  <span>Free</span>
                </div>
              )}
              {otherPaidStorage > 0 && (
                <div
                  className="bar-section storage-section"
                  style={{
                    flexGrow: otherPaidStorage * 0.023,
                    minWidth: "60px",
                  }}
                >
                  <span>Storage</span>
                </div>
              )}
              {otherEgressCost > 0 && (
                <div
                  className="bar-section egress-section"
                  style={{
                    flexGrow: otherEgressCost,
                    minWidth: "60px",
                  }}
                >
                  <span>Egress</span>
                </div>
              )}
            </div>
          </div>
          <div className="cost-label">${otherTotal.toFixed(2)}</div>
        </div>

        <div className="savings-highlight">
          <span>
            By using Tigris you could save ${savings.toFixed(2)} each month
          </span>
        </div>
      </div>
    </div>
  );
}
