
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
    const pageHeight = doc.internal.pageSize.height;
    const primaryColor = [1, 150, 254]; // #0196fe

    // Header
    const drawHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text('HomeCalc', 14, 22);
        
        const proText = "Pro";
        const proTextWidth = doc.getTextWidth(proText);
        const homecalcTextWidth = doc.getTextWidth("HomeCalc");
        const proRectX = 14 + homecalcTextWidth + 1;
        
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(proRectX, 15.5, proTextWidth + 4, 8.5, 2, 2, 'F');
        
        doc.setTextColor(255);
        doc.text(proText, proRectX + 2, 21.5);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(title, 14, 32);
    };

    // Footer
    const drawFooter = () => {
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            const date = new Date().toLocaleDateString();
            doc.text(`homecalc.pro`, 14, pageHeight - 10);
            doc.text(`Generated on ${date}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });
        }
    };
    
    drawHeader();

    // Inputs Table
    autoTable(doc, {
        startY: 42,
        head: [['Your Inputs', '']],
        body: inputs.map(item => [item.key, item.value]) as RowInput,
        theme: 'striped',
        headStyles: {
            fillColor: [230, 230, 230], // A light grey
            textColor: 40,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 70 },
            1: { cellWidth: 'auto' }
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
        }
    });

    // Results Table
    const lastTableY = (doc as any).lastAutoTable.finalY || 80;
    autoTable(doc, {
        startY: lastTableY + 12,
        head: [['Results', '']],
        body: results.map(item => [item.key, item.value]) as RowInput,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 70 },
            1: { cellWidth: 'auto' },
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
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

    drawFooter();
    doc.save(`${slug}-results.pdf`);
}
