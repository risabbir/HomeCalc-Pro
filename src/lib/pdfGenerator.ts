
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RowInput } from 'jspdf-autotable';

interface PdfContent {
    title: string;
    slug: string;
    inputs: { key: string; value: string }[];
    results: { key: string; value: string }[];
    disclaimer?: string;
}

export function generatePdf({ title, slug, inputs, results, disclaimer }: PdfContent) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(1, 150, 254); // HomeCalc Pro primary blue color
    doc.text('HomeCalc Pro', 14, 22);

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 32);

    // Inputs Table
    autoTable(doc, {
        startY: 40,
        head: [['Your Inputs', '']],
        body: inputs.map(item => [item.key, item.value]) as RowInput,
        theme: 'striped',
        headStyles: {
            fillColor: [220, 220, 220],
            textColor: [40],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { fontStyle: 'bold' }
        }
    });

    // Results Table
    const lastTableY = (doc as any).lastAutoTable.finalY || 80;
    autoTable(doc, {
        startY: lastTableY + 10,
        head: [['Results', '']],
        body: results.map(item => [item.key, item.value]) as RowInput,
        theme: 'grid',
        headStyles: {
            fillColor: [1, 150, 254], // Primary color
            textColor: [255],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { fontStyle: 'bold' }
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // Disclaimer
    if (disclaimer) {
        const finalY = (doc as any).lastAutoTable.finalY || 120;
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(disclaimer, 14, finalY + 10, { maxWidth: 180 });
    }

    doc.save(`${slug}-results.pdf`);
}
