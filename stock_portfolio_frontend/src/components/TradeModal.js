import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import './TradeModal.css';

const TradeModal = ({ backendApi, onClose }) => {
  const session = useContext(AuthContext);
  const [form, setForm] = useState({
    symbol: '', quantity: '', transaction_type: 'BUY', order_type: 'MARKET', price: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        quantity: parseFloat(form.quantity),
        price: form.order_type === 'LIMIT' ? parseFloat(form.price) : null
      };
      const headers = {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      };
      const res = await fetch(`${backendApi}/order`, {
        method: 'POST', headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) setResult(`Order placed: ${data.status}. Order ID: ${data.order_id || '-'}${data.message ? `. ${data.message}` : ''}`);
      else setError(data.message || 'Failed to place order');
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  return (
    <div className="trade-modal-backdrop" onClick={onClose}>
      <div className="trade-modal" onClick={e => e.stopPropagation()}>
        <h2>Place Order</h2>
        <form className="trade-form" onSubmit={handleSubmit}>
          <input required placeholder="Symbol (e.g. INFY)" value={form.symbol}
            onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} autoFocus />
          <input required type="number" min="1" placeholder="Quantity" value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
          <select value={form.transaction_type}
            onChange={e => setForm(f => ({ ...f, transaction_type: e.target.value }))}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <select value={form.order_type}
            onChange={e => setForm(f => ({ ...f, order_type: e.target.value }))}>
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
          </select>
          {form.order_type === 'LIMIT' &&
            <input required type="number" step="0.01" min="0" placeholder="Limit Price"
              value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />}
          {error && <div className="trade-error">{error}</div>}
          {result && <div className="trade-success">{result}</div>}
          <div className="trade-form-actions">
            <button className="trade-submit" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Place Order"}</button>
            <button className="trade-cancel" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TradeModal;
