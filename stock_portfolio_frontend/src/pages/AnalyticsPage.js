import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import './AnalyticsPage.css';

function AnalyticsPage({ backendApi }) {
  const session = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`${backendApi}/analytics`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (!res.ok) throw new Error("Error fetching analytics");
        setData(await res.json());
      } catch (e) {
        setData(null);
      }
      setLoading(false);
    }
    if (session && backendApi) fetchAnalytics();
  }, [backendApi, session]);
  if (loading)
    return <div className="analytics-wrapper"><span>Loading...</span></div>;
  if (!data)
    return <div className="analytics-wrapper"><span>Error loading analytics.</span></div>;

  return (
    <div className="analytics-wrapper">
      <h2>Portfolio Analytics</h2>
      <div className="analytics-stats">
        <div className="analytics-card">
          <strong>Invested:</strong> ₹{data.total_invested}
        </div>
        <div className="analytics-card">
          <strong>Current Value:</strong> ₹{data.total_current}
        </div>
        <div className="analytics-card">
          <strong>Total Return:</strong> ₹{data.total_return}
        </div>
        <div className="analytics-card">
          <strong>Return %:</strong> {data.return_percent}%
        </div>
      </div>
      <div className="analytics-charts">
        <div className="analytics-chart">
          <h4>Asset Allocation</h4>
          {/* Chart disabled - react-chartjs-2 is unavailable */}
          <div style={{color: "var(--text-secondary)", marginTop: "1.5em", textAlign: "center"}}>
            <em>Chart visuals are temporarily unavailable.<br/>Asset allocation:</em>
            <ul>
              {Object.entries(data.asset_allocation).map(([key, value]) =>
                <li key={key}>{key}: ₹{value}</li>
              )}
            </ul>
          </div>
        </div>
        <div className="analytics-chart">
          <h4>Current vs Invested</h4>
          {/* Chart disabled - react-chartjs-2 is unavailable */}
          <div style={{color: "var(--text-secondary)", marginTop: "1.5em", textAlign: "center"}}>
            <em>Chart visuals are temporarily unavailable.<br/>Invested: ₹{data.total_invested}, Current: ₹{data.total_current}</em>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
