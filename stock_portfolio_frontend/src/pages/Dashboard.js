import React, { useEffect, useState, useContext } from "react";
import { AuthContext, SupabaseContext } from "../App";
import './Dashboard.css';

const Section = ({ title, children, className }) => (
  <section className={`dashboard-section ${className || ""}`}>
    <h3>{title}</h3>
    <div>{children}</div>
  </section>
);

function Dashboard({ backendApi, onTradeClick }) {
  const session = useContext(AuthContext);

  const [portfolio, setPortfolio] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Portfolio, PNL, Recommendations
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${session?.access_token}` };
        const [portfolioRes, pnlRes, recsRes] = await Promise.all([
          fetch(`${backendApi}/portfolio`, { headers }).then(r => r.json()),
          fetch(`${backendApi}/pnl`, { headers }).then(r => r.json()),
          fetch(`${backendApi}/recommendations`, { headers }).then(r => r.json())
        ]);
        setPortfolio(portfolioRes);
        setPnl(pnlRes);
        setRecs(Array.isArray(recsRes) ? recsRes : []);
      } catch (e) {
        setPortfolio(null);
        setPnl(null);
        setRecs([]);
      }
      setLoading(false);
    }
    if (backendApi && session) fetchAll();
  }, [backendApi, session]);

  const handleLogout = async (supabase) => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h2>Portfolio Overview</h2>
        <SupabaseContext.Consumer>
          {(supabase) => (
            <button className="btn-logout" onClick={() => handleLogout(supabase)}>Logout</button>
          )}
        </SupabaseContext.Consumer>
      </header>
      <div className="dashboard-content">
        <Section title="Holding Details" className="flex2">
          {loading ? <span>Loading...</span> :
            <table className="portfolio-table dark">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Price</th>
                  <th>Current</th>
                  <th>Invested</th>
                  <th>Current Value</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio && portfolio.holdings && portfolio.holdings.map((row, i) =>
                  <tr key={i}>
                    <td>{row.symbol}</td>
                    <td>{row.quantity}</td>
                    <td>₹{row.avg_price}</td>
                    <td>₹{row.current_price}</td>
                    <td>₹{row.invested_value}</td>
                    <td>₹{row.current_value}</td>
                    <td className={row.profit_loss >= 0 ? "profit" : "loss"}>
                      {row.profit_loss >= 0 ? "+" : "-"}₹{Math.abs(row.profit_loss)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>Cash:</td>
                  <td colSpan={2}>₹{portfolio?.cash?.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          }
        </Section>
        <Section title="Profit/Loss" className="flex1">
          {loading ? <span>Loading...</span> :
            <table className="pnl-table dark">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Realized</th>
                  <th>Unrealized</th>
                </tr>
              </thead>
              <tbody>
                {pnl && pnl.pnl && pnl.pnl.map((item, i) =>
                  <tr key={i}>
                    <td>{item.symbol}</td>
                    <td className={item.realized >= 0 ? "profit" : "loss"}>{item.realized >= 0 ? "+" : "-"}₹{Math.abs(item.realized)}</td>
                    <td className={item.unrealized >= 0 ? "profit" : "loss"}>{item.unrealized >= 0 ? "+" : "-"}₹{Math.abs(item.unrealized)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          }
        </Section>
        <Section title="Investment & Option Recommendations" className="flex1">
          {loading ? <span>Loading...</span> :
            <div className="rec-list">
              {recs.map((rec, idx) =>
                <div className="rec-card" key={idx}>
                  <span className="rec-symbol">{rec.symbol}</span>
                  <span className="rec-type">{rec.type}</span>
                  <p className="rec-reason">{rec.reason}</p>
                </div>
              )}
              {recs.length === 0 && <i>No recommendations at this time.</i>}
            </div>
          }
        </Section>
      </div>
      <div className="dashboard-trade-cta">
        <button className="dashboard-trade-btn" onClick={onTradeClick}>
          <span role="img" aria-label="trade">💸</span> Place New Trade
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
