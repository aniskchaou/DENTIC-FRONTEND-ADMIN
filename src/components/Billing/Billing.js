import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, TextField, Paper, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SendIcon from '@mui/icons-material/Send';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { useTranslation } from 'react-i18next';

const Billing = () => {
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [service, setService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  // Invoice DataTable states
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewInvoiceDialog, setViewInvoiceDialog] = useState(false);

  // Add these states for more invoice fields
  const [clinicId, setClinicId] = useState('');
  const [discount, setDiscount] = useState({ amount: 0, percentage: 0, discountReason: '' });
  const [taxAmount, setTaxAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // New states for patients and clinics
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);

  // Send Invoice states
  const [sendInvoiceDialog, setSendInvoiceDialog] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const services = [
    { id: 's1', name: t('billing.service_consultation'), price: 50 },
    { id: 's2', name: t('billing.service_xray'), price: 100 },
    { id: 's3', name: t('billing.service_cleaning'), price: 80 },
    { id: 's4', name: t('billing.service_filling'), price: 120 },
    { id: 's5', name: t('billing.service_root_canal'), price: 300 },
    { id: 's6', name: t('billing.service_crown'), price: 500 },
    { id: 's7', name: t('billing.service_bridge'), price: 700 },
    { id: 's8', name: t('billing.service_extraction'), price: 150 },
    { id: 's9', name: t('billing.service_whitening'), price: 200 },
    { id: 's10', name: t('billing.service_implant'), price: 1200 },
    { id: 's11', name: t('billing.service_braces'), price: 2500 },
    { id: 's12', name: t('billing.service_veneers'), price: 900 },
    { id: 's13', name: t('billing.service_fluoride'), price: 60 },
    { id: 's14', name: t('billing.service_sealant'), price: 75 },
    { id: 's15', name: t('billing.service_periodontal'), price: 350 }
  ];

  useEffect(() => {
    fetchInvoices();
    fetchPatients();
    fetchClinics();
  }, []);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const res = await axios.get(`${BASE_URL}/invoices`);
      setInvoices(res.data);
    } catch {
      setInvoices([]);
    }
    setLoadingInvoices(false);
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/patients`);
      setPatients(res.data);
    } catch {
      setPatients([]);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clinics`);
      setClinics(res.data);
    } catch {
      setClinics([]);
    }
  };

  const handleAddItem = () => {
    if (!service) return;
    const selectedService = services.find(s => s.id === service);
    setBillItems([
      ...billItems,
      {
        id: Date.now(),
        name: selectedService.name,
        price: selectedService.price,
        quantity: quantity,
        total: selectedService.price * quantity
      }
    ]);
    setService('');
    setQuantity(1);
  };

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

  const handleGenerateBill = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Invoice DataTable handlers
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceDialog(true);
  };

  const handleCloseInvoiceDialog = () => {
    setViewInvoiceDialog(false);
    setSelectedInvoice(null);
  };

  const handleDownloadInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 35);
    doc.text(`Patient ID: ${invoice.patientId}`, 14, 45);
    doc.text(`Clinic ID: ${invoice.clinicId}`, 14, 55);
    doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 14, 65);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 75);
    doc.text(`Payment Status: ${invoice.paymentStatus}`, 14, 85);
    doc.text(`Payment Method: ${invoice.paymentMethod || '-'}`, 14, 95);

    // Use autoTable as a function:
    autoTable(doc, {
      startY: 110,
      head: [['Item', 'Description', 'Qty', 'Unit Price', 'Total']],
      body: invoice.items.map(item => [
        item.itemType,
        item.itemDescription,
        item.quantity,
        item.unitPrice,
        item.totalPrice
      ]),
    });

    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 130;
    doc.text(`Subtotal: $${invoice.subTotal}`, 14, y);
    y += 8;
    doc.text(`Discount: $${invoice.discount?.amount || 0} (${invoice.discount?.percentage || 0}%)`, 14, y);
    y += 8;
    doc.text(`Tax: $${invoice.taxAmount}`, 14, y);
    y += 8;
    doc.text(`Grand Total: $${invoice.grandTotal}`, 14, y);
    y += 8;
    doc.text(`Notes: ${invoice.notes || '-'}`, 14, y);

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
  };

  const handleSendInvoice = async (invoice) => {
    setSending(true);
    setSendResult(null);
    try {
      // Generate PDF in browser
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Invoice', 14, 20);
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 35);
      doc.text(`Patient ID: ${invoice.patientId}`, 14, 45);
      doc.text(`Clinic ID: ${invoice.clinicId}`, 14, 55);
      doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 14, 65);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 75);
      doc.text(`Payment Status: ${invoice.paymentStatus}`, 14, 85);
      doc.text(`Payment Method: ${invoice.paymentMethod || '-'}`, 14, 95);

      autoTable(doc, {
        startY: 110,
        head: [['Item', 'Description', 'Qty', 'Unit Price', 'Total']],
        body: invoice.items.map(item => [
          item.itemType,
          item.itemDescription,
          item.quantity,
          item.unitPrice,
          item.totalPrice
        ]),
      });

      let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 130;
      doc.text(`Subtotal: $${invoice.subTotal}`, 14, y);
      y += 8;
      doc.text(`Discount: $${invoice.discount?.amount || 0} (${invoice.discount?.percentage || 0}%)`, 14, y);
      y += 8;
      doc.text(`Tax: $${invoice.taxAmount}`, 14, y);
      y += 8;
      doc.text(`Grand Total: $${invoice.grandTotal}`, 14, y);
      y += 8;
      doc.text(`Notes: ${invoice.notes || '-'}`, 14, y);

      // Convert PDF to Blob
      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      // Find patient email (if available)
      const patient = patients.find(p => String(p.id) === String(invoice.patientId));
      formData.append('to', 'kchaouanis20@gmail.com');
      formData.append('subject', `Invoice ${invoice.invoiceNumber}`);
      formData.append('text', 'Please find your invoice attached.');
      formData.append('html', `<b>Dear ${patient?.fullName || patient?.name || 'Patient'},</b><br/>Please find your invoice attached.<br/>Thank you!`);
      formData.append('attachment', pdfBlob, `invoice_${invoice.invoiceNumber}.pdf`);

      // Send email with attachment
      const res = await axios.post(
        `${BASE_URL}/send-email-with-attachment`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSendResult(res.data);
    } catch (e) {
      setSendResult({ error: 'Failed to send email.' });
    }
    setSending(false);
  };

  // Helper functions to get names by id
  const getPatientName = (id) => {
    const p = patients.find(p => String(p.id) === String(id));
    return p ? (p.fullName || p.name) : id;
  };
  const getClinicName = (id) => {
    const c = clinics.find(c => String(c.id) === String(id));
    return c ? c.name : id;
  };

  const invoiceColumns = [
    { field: 'invoiceNumber', headerName: t('billing.invoice_number'), width: 140 },
    {
      field: 'patientId',
      headerName: t('billing.patient'),
      width: 180,
      valueGetter: (params) => getPatientName(params.row.patientId)
    },
    {
      field: 'clinicId',
      headerName: t('billing.clinic'),
      width: 180,
      valueGetter: (params) => getClinicName(params.row.clinicId)
    },
    {
      field: 'grandTotal',
      headerName: t('billing.total'),
      width: 100,
      valueFormatter: (params) => `$${params.value}`
    },
    {
      field: 'paymentStatus',
      headerName: t('billing.status'),
      width: 110,
      renderCell: (params) => (
        <span style={{
          color: params.value === t('billing.status_paid') ? '#388e3c' : '#d32f2f',
          fontWeight: 'bold'
        }}>
          {t(`billing.status_${params.value.toLowerCase()}`)}
        </span>
      )
    },
    {
      field: 'invoiceDate',
      headerName: t('billing.date'),
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: t('billing.actions'),
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleViewInvoice(params.row)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDownloadInvoicePDF(params.row)}>
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton color="success" onClick={() => { setSelectedInvoice(params.row); setSendInvoiceDialog(true); }}>
            <SendIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PictureAsPdfIcon sx={{ color: '#1976d2', fontSize: 38, mr: 1 }} />
          <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
            {t('billing.title')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            select
            label={t('billing.select_patient')}
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            sx={{ minWidth: 220, flex: 1 }}
          >
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.fullName || p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('billing.select_clinic')}
            value={clinicId}
            onChange={e => setClinicId(e.target.value)}
            sx={{ minWidth: 180, flex: 1 }}
          >
            {clinics.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('billing.service')}
            value={service}
            onChange={e => setService(e.target.value)}
            sx={{ minWidth: 180, flex: 1 }}
          >
            {services.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name} (${s.price})</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('billing.quantity')}
            type="number"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            sx={{ width: 110 }}
            inputProps={{ min: 1 }}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ height: 40, fontWeight: 600, minWidth: 120 }}
            disabled={!service}
          >
            {t('billing.add')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            label={t('billing.discount_amount')}
            type="number"
            value={discount.amount}
            onChange={e => setDiscount({ ...discount, amount: Number(e.target.value) })}
            sx={{ width: 140 }}
            inputProps={{ min: 0 }}
          />
          <TextField
            label={t('billing.discount_percentage')}
            type="number"
            value={discount.percentage}
            onChange={e => setDiscount({ ...discount, percentage: Number(e.target.value) })}
            sx={{ width: 120 }}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            label={t('billing.discount_reason')}
            value={discount.discountReason}
            onChange={e => setDiscount({ ...discount, discountReason: e.target.value })}
            sx={{ minWidth: 180, flex: 1 }}
          />
          <TextField
            label={t('billing.tax_amount')}
            type="number"
            value={taxAmount}
            onChange={e => setTaxAmount(Number(e.target.value))}
            sx={{ width: 120 }}
            inputProps={{ min: 0 }}
          />
          <TextField
            select
            label={t('billing.payment_method')}
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            sx={{ width: 140 }}
          >
            <MenuItem value="Cash">{t('billing.method_cash')}</MenuItem>
            <MenuItem value="Card">{t('billing.method_card')}</MenuItem>
            <MenuItem value="Insurance">{t('billing.method_insurance')}</MenuItem>
          </TextField>
          <TextField
            label={t('billing.due_date')}
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            sx={{ width: 150 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label={t('billing.notes')}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{t('billing.service')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('billing.price')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('billing.quantity')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('billing.total')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{t('billing.remove')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.total}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {billItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">{t('billing.no_services_added')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" align="right" sx={{ mb: 2, color: '#1976d2', fontWeight: 700 }}>
          {t('billing.total')}: ${totalAmount}
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleGenerateBill}
          disabled={!selectedPatient || !clinicId || billItems.length === 0}
          sx={{ fontWeight: 700, minWidth: 180, fontSize: 16 }}
        >
          {t('billing.generate_bill')}
        </Button>
      </Paper>

      {/* Invoice DataTable */}
      <Paper sx={{ p: 2, mb: 4, boxShadow: 2, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 700 }}>
          {t('billing.invoices')}
        </Typography>
        <div style={{ height: 420, width: '100%' }}>
          <DataGrid
            rows={invoices}
            columns={invoiceColumns}
            pageSize={8}
            rowsPerPageOptions={[8, 16, 32]}
            loading={loadingInvoices}
            getRowId={row => row.id}
            disableSelectionOnClick
            autoHeight={false}
            sx={{
              fontSize: 15,
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#e3f2fd', fontWeight: 700 },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f0f6ff' }
            }}
          />
        </div>
      </Paper>

      {/* View Invoice Dialog */}
      <Dialog open={viewInvoiceDialog} onClose={handleCloseInvoiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PictureAsPdfIcon sx={{ color: '#1976d2' }} />
            <span>{t('billing.invoice_details')}</span>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Box sx={{ bgcolor: '#fafdff', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <b>Invoice Code:</b> {selectedInvoice.invoiceNumber}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t('billing.patient')}: {getPatientName(selectedInvoice.patientId)} | {t('billing.clinic')}: {getClinicName(selectedInvoice.clinicId)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t('billing.date')}: {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}<br />
                {t('billing.due')}: {new Date(selectedInvoice.dueDate).toLocaleDateString()}<br />
                {t('billing.status')}: <b>{t(`billing.status_${selectedInvoice.paymentStatus.toLowerCase()}`)}</b><br />
                {t('billing.payment_method')}: {selectedInvoice.paymentMethod || '-'}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>{t('billing.items')}</Typography>
              <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>{t('billing.type')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('billing.description')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('billing.quantity')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('billing.unit_price')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('billing.total')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.itemType}</TableCell>
                        <TableCell>{item.itemDescription}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice}</TableCell>
                        <TableCell>${item.totalPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body2">
                {t('billing.subtotal')}: <b>${selectedInvoice.subTotal}</b><br />
                {t('billing.discount')}: <b>${selectedInvoice.discount?.amount || 0} ({selectedInvoice.discount?.percentage || 0}%)</b><br />
                {t('billing.tax')}: <b>${selectedInvoice.taxAmount}</b><br />
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>{t('billing.grand_total')}: ${selectedInvoice.grandTotal}</span>
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {t('billing.notes')}: {selectedInvoice.notes || '-'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog} variant="outlined" color="secondary">
            {t('billing.close')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => handleDownloadInvoicePDF(selectedInvoice)}
          >
            {t('billing.download_pdf')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bill Preview Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AddIcon sx={{ color: '#1976d2' }} />
            <span>{t('billing.bill_preview')}</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#fafdff', borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('billing.patient')}: {getPatientName(selectedPatient)}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>{t('billing.service')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('billing.price')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('billing.quantity')}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('billing.total')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="h6" align="right" sx={{ mt: 2, color: '#1976d2', fontWeight: 700 }}>
              {t('billing.total')}: ${totalAmount}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
            {t('billing.close')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              // Prepare invoice object
              const now = new Date();
              const invoiceObj = {
                invoiceNumber: `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getTime()}`,
                patientId: Number(selectedPatient),
                clinicId: Number(clinicId),
                items: billItems.map((item, idx) => ({
                  itemId: idx + 1,
                  itemType: item.name,
                  quantity: item.quantity,
                  unitPrice: item.price,
                  totalPrice: item.total,
                  itemDescription: item.name
                })),
                subTotal: totalAmount,
                discount,
                taxAmount,
                grandTotal: totalAmount - (discount.amount || 0) + Number(taxAmount),
                paymentStatus: 'Pending',
                paymentMethod,
                transactionId: null,
                invoiceDate: now.toISOString(),
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                notes,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
              };
              try {
                await axios.post(`${BASE_URL}/invoices`, invoiceObj);
                setOpenDialog(false);
                fetchInvoices();
                setBillItems([]);
              } catch (e) {
                alert('Failed to save invoice');
              }
            }}
            disabled={
              !selectedPatient ||
              !clinicId ||
              billItems.length === 0
            }
            sx={{ fontWeight: 700, minWidth: 180, fontSize: 16 }}
          >
            {t('billing.confirm_save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Invoice Dialog */}
      <Dialog open={sendInvoiceDialog} onClose={() => setSendInvoiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SendIcon sx={{ color: '#1976d2' }} />
            <span>{t('billing.send_invoice')}</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <b>To:</b> {patients.find(p => String(p.id) === String(selectedInvoice.patientId))?.email || 'No email found'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <b>Subject:</b> Invoice {selectedInvoice.invoiceNumber}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <b>Message:</b> Please find your invoice attached.
              </Typography>
              {sending && <Typography color="info.main" sx={{ mt: 2 }}>Sending...</Typography>}
              {sendResult && sendResult.error && <Typography color="error" sx={{ mt: 2 }}>{sendResult.error}</Typography>}
              {sendResult && sendResult.success && <Typography color="success.main" sx={{ mt: 2 }}>Email sent successfully!</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendInvoiceDialog(false)} variant="outlined" color="secondary">
            {t('billing.close')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={sending || !selectedInvoice}
            onClick={() => handleSendInvoice(selectedInvoice)}
          >
            {t('billing.send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing;