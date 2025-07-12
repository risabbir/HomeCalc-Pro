
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
    const primaryColor = [1, 151, 224]; // Approx HSL(200, 99%, 44%)

    // Header
    const drawHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('HomeCalc', 14, 22);
        
        const proText = "Pro";
        const homecalcTextWidth = doc.getTextWidth("HomeCalc");
        const proRectX = 14 + homecalcTextWidth + 1.5;
        const proTextWidth = doc.getTextWidth(proText);

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(proRectX, 14.5, proTextWidth + 5, 10, 2, 2, 'F');
        
        doc.setFontSize(22);
        doc.setTextColor(255);
        doc.text(proText, proRectX + 2.5, 22.5);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(title, 14, 34);
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
        startY: 45,
        head: [['Calculation Details', '']],
        body: inputs.map(item => [item.key, item.value]) as RowInput,
        theme: 'striped',
        headStyles: {
            fillColor: [241, 245, 249], // secondary color
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
        startY: lastTableY + 15,
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
            fontSize: 11,
            cellPadding: 3.5,
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
        doc.text(disclaimer, 14, finalY + 12, { maxWidth: 180 });
    }

    drawFooter();
    doc.save(`${slug}-results.pdf`);
}
