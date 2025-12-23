import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { TextField, Button, Typography, Paper, Box, Divider, Alert } from '@mui/material';

interface Bill {
  units: number;
  rate: number;
  subtotal: number;
  vat: number;
  vatAmount: number;
  serviceCharge: number;
  total: number;
}

interface FormData {
  units: number;
  name: string;
}

export const UserCalculator: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState(0);

  const getBill = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<Bill>(
        `${process.env.REACT_APP_BACKEND_URL}/config/bill/calculate`,
        { units: data.units }
      );
      setBill(res.data);
      setName(data.name);
      setUnits(data.units);
      reset();
    } catch (err) {
      setError('Failed to calculate bill. Try again.');
    }
    setLoading(false);
  };

  {/* display of pdf */}
  const downloadPDF = () => {
    if (!bill) return;

    const doc = new jsPDF();

  
    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('A.H. Bill', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text('Receipt', 105, 30, { align: 'center' });

  
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text('Username: ', 20, 65);
    doc.text(name, 45, 65); 



    doc.setFillColor(255, 255, 255);
    doc.rect(15, 85, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, 91);
    doc.text('Amount (Tk)', 180, 91, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    let y = 100;

    doc.text('Subtotal', 20, y);
    doc.text(bill.subtotal.toFixed(2), 180, y, { align: 'right' });
    y += 5;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`(Based on units used by user: ${units} kWh)`, 20, y);
    y += 7;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text('VAT Amount', 20, y);
    doc.text(bill.vatAmount.toFixed(2), 180, y, { align: 'right' });
    y += 8;

    doc.text('Service Charge', 20, y);
    doc.text(bill.serviceCharge.toFixed(2), 180, y, { align: 'right' });
    y += 10;

    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total Payable', 20, y);
    doc.setTextColor(0, 150, 0);
    doc.text(bill.total.toFixed(2), 180, y, { align: 'right' });

    doc.save('electricity_bill.pdf');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mb: 5 }}>
      {/* To take user input */}
      {!bill && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Calculate Electricity Bill
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter name and value of units that has been used 
          </Typography>

          <form onSubmit={handleSubmit(getBill)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Your Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message || ' '}
              />
              <TextField
                fullWidth
                label="Units Used (kWh)"
                type="number"
                inputProps={{ step: '0.01', min: '0.01' }}
                {...register('units', {
                  required: 'This field is required',
                  valueAsNumber: true,
                  min: { value: 0.01, message: 'Units must be greater than 0' }
                })}
                error={!!errors.units}
                helperText={errors.units?.message || ' '}
              />
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={loading}
              size="large"
              sx={{ mt: 3 }}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </form>

          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        </Paper>
      )}

{/* display to show result of calculation */}
      {bill && (
        <Paper elevation={1} sx={{ mt: 5, p: 0, overflow: 'hidden' }}>
  
          <Box sx={{ backgroundColor: '#1976d2', color: '#fff', textAlign: 'center', py: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>A.H. Electricity</Typography>
            <Typography variant="subtitle1">Receipt</Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography sx={{ mb: 0.5, fontWeight: 'bold'}}>Date: {new Date().toLocaleDateString()}</Typography>
            <Typography sx={{ mt: 2, mb: 0.5,fontWeight: 'bold' }}>Username: {name}</Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1, fontWeight: 'bold' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Description</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>Amount (Tk)</Typography>
                  </Box>

            <Box sx={{ px: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal</Typography>
                <Typography>{bill.subtotal.toFixed(2)}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                (Based on units used by user: {units} kWh)
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>VAT Amount</Typography>
                <Typography>{bill.vatAmount.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Service Charge</Typography>
                <Typography>{bill.serviceCharge.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ borderTop: '1px solid #000', mt: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Payable</Typography>
                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>{bill.total.toFixed(2)}</Typography>
              </Box>

              <Button variant="contained" color="primary" onClick={downloadPDF} fullWidth sx={{ mt: 3 }}>
                Download as PDF
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
