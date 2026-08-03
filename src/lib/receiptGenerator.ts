import type { Order } from "../types";

/**
 * Checks if an order status or payment status is verified as completed / paid.
 */
export function isReceiptAvailable(order: Order): boolean {
  if (!order) return false;
  const statusStr = String(order.status || '').toLowerCase();
  const payStatusStr = String(order.paymentStatus || '').toLowerCase();
  
  return (
    statusStr === 'completed' ||
    payStatusStr.includes('paid') ||
    Boolean(order.mpesaReceiptNumber || order.mpesaRef)
  );
}

/**
 * Generates a clean, professional HTML receipt string for an order.
 * Optimized for both high-resolution screen rendering and print / PDF output via window.print().
 */
export function generateReceiptHtml(order: Order): string {
  const formattedDate = order.createdAt 
    ? (new Date(order.createdAt).toString() !== 'Invalid Date' 
        ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : order.createdAt)
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const receiptCode = order.mpesaReceiptNumber || order.mpesaRef || `REC-${order.id.replace(/^GL-/, '')}`;
  const totalAmount = order.totalPrice ? order.totalPrice.toLocaleString('en-KE', { style: 'currency', currency: 'KES' }) : 'KES 0.00';

  const itemsListHtml = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #f0edf4;">
      <td style="padding: 10px 12px; font-weight: 600; color: #231630;">${idx + 1}. ${item.serviceName}</td>
      <td style="padding: 10px 12px; text-align: center; color: #5a4b69; font-weight: 700;">${item.quantity}</td>
      <td style="padding: 10px 12px; text-align: right; color: #5a4b69;">KES ${item.unitPrice.toLocaleString('en-KE')}</td>
      <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #5E228B;">KES ${(item.quantity * item.unitPrice).toLocaleString('en-KE')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt ${order.id} - Goldtribe Dry Cleaners</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@600;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f7f5f9;
          color: #231630;
          padding: 24px 12px;
          display: flex;
          justify-content: center;
        }

        .receipt-card {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8e2f0;
          box-shadow: 0 10px 30px rgba(94, 34, 139, 0.08);
          overflow: hidden;
          padding: 36px 40px;
          position: relative;
        }

        .header-bg {
          border-bottom: 2px dashed #e8e2f0;
          padding-bottom: 24px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .brand-logo {
          font-size: 22px;
          font-weight: 800;
          color: #5E228B;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .brand-sub {
          font-size: 11px;
          font-weight: 700;
          color: #9376a8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .receipt-badge {
          background-color: #eefdf4;
          border: 1.5px solid #22c55e;
          color: #15803d;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: #faf8fd;
          padding: 18px 20px;
          border-radius: 12px;
          border: 1px solid #f0ebf7;
          margin-bottom: 28px;
        }

        .meta-item label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #8c789e;
          display: block;
          margin-bottom: 3px;
        }

        .meta-item span {
          font-size: 13px;
          font-weight: 700;
          color: #231630;
        }

        .code-pill {
          font-family: 'JetBrains Mono', monospace;
          background: #5E228B;
          color: #FED65B;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 12px;
        }

        .table-container {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
        }

        .table-container th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #5E228B;
          background: #f5f0fa;
          padding: 10px 12px;
          border-bottom: 2px solid #e5d9f2;
        }

        .summary-box {
          background: #faf8fd;
          border-radius: 12px;
          padding: 20px 24px;
          border: 1px solid #f0ebf7;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #5a4b69;
        }

        .summary-row.total {
          border-top: 1.5px solid #e8e2f0;
          padding-top: 10px;
          margin-top: 4px;
          font-size: 18px;
          font-weight: 800;
          color: #5E228B;
        }

        .notes-box {
          font-size: 11px;
          color: #6f627d;
          background: #fffbfa;
          border: 1px solid #ffe8d9;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 28px;
        }

        .footer {
          text-align: center;
          border-top: 1px solid #e8e2f0;
          padding-top: 20px;
          font-size: 11px;
          color: #8c789e;
          line-height: 1.6;
        }

        .print-btn-bar {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .btn-print {
          background: #5E228B;
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 12px rgba(94, 34, 139, 0.25);
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .btn-print:hover {
          background: #4a1772;
          transform: translateY(-1px);
        }

        @media print {
          body {
            background-color: #ffffff;
            padding: 0;
          }
          .receipt-card {
            border: none;
            box-shadow: none;
            padding: 0;
          }
          .print-btn-bar {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header-bg">
          <div>
            <div class="brand-logo">GOLDTRIBE</div>
            <div class="brand-sub">Dry Cleaners & Laundry Services</div>
            <div style="font-size: 11px; color: #6f627d; margin-top: 4px;">Rongai & Ngong Branches · Kajiado, Kenya</div>
          </div>
          <div style="text-align: right;">
            <div class="receipt-badge">
              ✓ ${order.paymentStatus === 'Paid via M-Pesa' || order.status === 'Completed' ? 'OFFICIAL RECEIPT' : 'VERIFIED'}
            </div>
            <div style="font-size: 11px; color: #7f6e8e; font-weight: 700; margin-top: 8px;">
              Date: ${formattedDate}
            </div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <label>Customer Name</label>
            <span>${order.customerName || 'Valued Customer'}</span>
          </div>
          <div class="meta-item">
            <label>Order Tracking ID</label>
            <span class="code-pill">${order.id}</span>
          </div>
          <div class="meta-item">
            <label>Phone Contact</label>
            <span>${order.phone || 'N/A'}</span>
          </div>
          <div class="meta-item">
            <label>M-Pesa Receipt Code</label>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #16a34a;">${receiptCode}</span>
          </div>
          <div class="meta-item">
            <label>Pickup / Delivery Date</label>
            <span style="color: #5E228B; font-weight: 800;">📅 ${order.pickupDate || 'Scheduled on Request'} ${order.timeSlot ? `(${order.timeSlot})` : ''}</span>
          </div>
          <div class="meta-item">
            <label>Selected Branch & Delivery</label>
            <span>${order.branch} (${order.deliveryType})</span>
          </div>
        </div>

        <table class="table-container">
          <thead>
            <tr>
              <th>Service Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #999;">No items listed</td></tr>'}
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${totalAmount}</span>
          </div>
          <div class="summary-row">
            <span>Pickup & Delivery Charge</span>
            <span style="color: #16a34a; font-weight: 700;">FREE</span>
          </div>
          <div class="summary-row">
            <span>Payment Method</span>
            <span>${order.paymentStatus}</span>
          </div>
          <div class="summary-row total">
            <span>Total Paid Amount</span>
            <span>${totalAmount}</span>
          </div>
        </div>

        ${order.specialNotes ? `
          <div class="notes-box">
            <strong>Special Customer Instructions:</strong> ${order.specialNotes}
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for choosing <strong>Goldtribe Dry Cleaners & Laundry Services</strong>!</p>
          <p>For support or delivery queries, contact us at <strong>0708 374 149 / 0712 345 678</strong></p>
          <p style="margin-top: 6px; font-size: 10px; color: #b3a6c2;">Generated automatically on ${new Date().toLocaleString('en-KE')}</p>
        </div>

        <div class="print-btn-bar">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF Receipt</button>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper function to trigger printing / downloading the HTML/PDF receipt in a pop-up window.
 */
export function openPrintableReceipt(order: Order): void {
  const htmlContent = generateReceiptHtml(order);
  const printWindow = window.open('', '_blank', 'width=800,height=900,scrollbars=yes');
  
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Auto trigger print after render
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  } else {
    // Fallback if popup blocked: create a temporary download link for the html receipt file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Goldtribe_Receipt_${order.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
