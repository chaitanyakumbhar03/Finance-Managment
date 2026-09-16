import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Client, Karagir } from '../types';

export const exportToCSV = (data: any[], fileName: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Calculate column widths
  const colWidths = Object.keys(data[0] || {}).map(key => {
    const headerLen = key.length;
    const maxDataLen = data.reduce((max, row) => {
      const val = row[key] ? String(row[key]).length : 0;
      return Math.max(max, val);
    }, 0);
    return { wch: Math.max(headerLen, maxDataLen) + 2 };
  });
  
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

export const parseExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      resolve(json);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const downloadSampleCSV = () => {
  const sampleData = [
    {
      clientName: 'John Doe',
      businessName: 'JD Jewels',
      address: '123 Street, City',
      phoneNumber: '9876543210',
      emailId: 'john@example.com',
      dieType: 'Emboss Die',
      size: 10,
      quantity: 5,
      material: 'Gold',
      notes: 'Sample note',
      amountReceived: 5000,
      amountPending: 2000,
    }
  ];
  exportToCSV(sampleData, 'sample_clients');
};
