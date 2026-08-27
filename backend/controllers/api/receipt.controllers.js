// Receipt generation — returns HTML receipt; wire emailReceipt to email provider in production

exports.generateReceipt = async (req, res) => {
  try {
    const { invoiceId, patientName, items, total, amountPaid, balance, paymentMethod, clinicName, clinicAddress, date } = req.body;
    if (!total) return res.status(400).json({ error: "total is required" });

    const itemRows = (items || []).map(i =>
      `<tr><td style="padding:4px 8px">${i.description}</td><td style="padding:4px 8px;text-align:right">${i.amount}</td></tr>`
    ).join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Receipt</title>
<style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px}
h2{margin:0}table{width:100%;border-collapse:collapse}th{background:#1976d2;color:#fff;padding:6px 8px}
td{border-bottom:1px solid #eee}.total-row{font-weight:700;font-size:1.1em}.clinic{color:#555;font-size:.9em}</style>
</head>
<body>
<h2>${clinicName || "Dental Clinic"}</h2>
<p class="clinic">${clinicAddress || ""}</p>
<hr>
<p><strong>Receipt</strong>&nbsp;&nbsp;Invoice #${invoiceId || "—"}</p>
<p>Patient: <strong>${patientName || "—"}</strong>&nbsp;&nbsp;Date: <strong>${date || new Date().toLocaleDateString()}</strong></p>
<table>
  <thead><tr><th style="text-align:left">Service</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>${itemRows}</tbody>
  <tfoot>
    <tr class="total-row"><td style="padding:6px 8px">Total</td><td style="padding:6px 8px;text-align:right">${total}</td></tr>
    <tr><td style="padding:4px 8px">Amount Paid</td><td style="padding:4px 8px;text-align:right">${amountPaid || total}</td></tr>
    <tr><td style="padding:4px 8px">Balance</td><td style="padding:4px 8px;text-align:right">${balance || "0.00"}</td></tr>
  </tfoot>
</table>
<p style="margin-top:16px;color:#555">Payment Method: ${paymentMethod || "—"}</p>
<p style="text-align:center;color:#888;font-size:.85em;margin-top:24px">Thank you for choosing ${clinicName || "our clinic"}!</p>
</body></html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.emailReceipt = async (req, res) => {
  try {
    const { to, invoiceId, patientName, total, clinicName } = req.body;
    if (!to) return res.status(400).json({ error: "Recipient email (to) is required" });
    // TODO: integrate with email provider using HTML from generateReceipt
    console.log(`[RECEIPT_EMAIL] To: ${to} | Invoice #${invoiceId} | Total: ${total}`);
    res.json({ sent: true, to, invoiceId, sentAt: new Date() });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
