/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/
/**
 * Generates and opens a printable receipt for a payment
 * @param {Object} payment - The payment object containing details to display
 * @param {Function} formatDate - Function to format date strings
 * @param {Function} formatCurrency - Function to format currency values
 * @param {String} logoPath - Path to the logo image (default: '/edu.svg')
 */
export const printPaymentReceipt = (
  payment,
  formatDate,
  logoPath = "/edu.svg"
) => {
  // Create a new window for the receipt
  const receiptWindow = window.open("", "_blank", "width=800,height=600");

  // Generate receipt HTML
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Payment Receipt</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            color: #1f2937;
            background-color: #f9fafb;
            padding: 2rem;
            line-height: 1.5;
          }
          
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
          }
          
          .receipt-header {
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            color: white;
            padding: 2rem;
            text-align: center;
            position: relative;
          }
          
          .receipt-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin: 0 auto 1rem;
            background: white;
            padding: 10px;
            border-radius: 50%;
          }
          
          .receipt-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .receipt-id {
            font-size: 0.875rem;
            opacity: 0.9;
          }
          
          .receipt-date {
            font-size: 0.875rem;
            opacity: 0.9;
            margin-top: 0.25rem;
          }
          
          .receipt-body {
            padding: 2rem;
          }
          
          .receipt-section {
            margin-bottom: 2rem;
          }
          
          .receipt-section-title {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .detail-item {
            margin-bottom: 0.75rem;
          }
          
          .detail-label {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
          }
          
          .detail-value {
            font-weight: 500;
          }
          
          .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          
          .receipt-table th {
            background-color: #f3f4f6;
            padding: 0.75rem 1rem;
            text-align: left;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            font-weight: 600;
          }
          
          .receipt-table td {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .receipt-table tr:last-child td {
            border-bottom: none;
            font-weight: 600;
          }
          
          .receipt-footer {
            background-color: #f9fafb;
            padding: 1.5rem 2rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          
          .receipt-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .status-paid {
            background-color: #ecfdf5;
            color: #065f46;
          }
          
          .status-pending {
            background-color: #fffbeb;
            color: #92400e;
          }
          
          .status-overdue {
            background-color: #fef2f2;
            color: #b91c1c;
          }
          
          .amount-value {
            font-weight: 600;
            font-size: 1.125rem;
          }
          
          .print-button {
            margin-top: 2rem;
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .print-button button {
            background: linear-gradient(to right, #4f46e5, #7c3aed);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          
          .print-button button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            
            .receipt-container {
              box-shadow: none;
              border-radius: 0;
            }
            
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <img class="receipt-logo" src="${logoPath}" alt="School Logo" />
            <h1 class="receipt-title">Payment Receipt</h1>
            <div class="receipt-id">Receipt #: ${payment.id}</div>
            <div class="receipt-date">Date: ${formatDate(payment.date)}</div>
          </div>
          
          <div class="receipt-body">
            <div class="receipt-section">
              <h2 class="receipt-section-title">Student Information</h2>
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-label">Student ID</div>
                  <div class="detail-value">${payment.student.id}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Student Name</div>
                  <div class="detail-value">${payment.student.name} ${
    payment.student.surname
  }</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Class</div>
                  <div class="detail-value">${payment.class.name}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Status</div>
                  <div class="detail-value">
                    <span class="receipt-status ${
                      payment.status === "Paid"
                        ? "status-paid"
                        : payment.status === "Pending"
                        ? "status-pending"
                        : "status-overdue"
                    }">
                      ${payment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="receipt-section">
              <h2 class="receipt-section-title">Payment Details</h2>
              <table class="receipt-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${payment.feeType}</td>
                    <td class="amount-value">$${payment.amount}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td class="amount-value">$${payment.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="receipt-footer">
            <p>Thank you for your payment. This receipt was automatically generated.</p>
          </div>
          
          <div class="print-button">
            <button onclick="window.print(); window.close();">Print Receipt</button>
          </div>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
};
