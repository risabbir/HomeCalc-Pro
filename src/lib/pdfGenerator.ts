
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

// Function to fetch image and convert to Base64
async function getImageBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error converting image to Base64:", error);
        // Return a transparent pixel as a fallback
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
}

export async function generatePdf({ title, slug, inputs, results, disclaimer }: PdfContent) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const primaryColor = [1, 151, 224]; // Approx HSL(200, 99%, 44%)

    try {
        const logoUrl = new URL('/logo-light.png', window.location.origin).toString();
        const logoBase64 = await getImageBase64(logoUrl);
        if (logoBase64 && !logoBase64.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')) {
            // The logo's aspect ratio (200/53) to calculate height from width, ensuring it's contained
            const logoWidth = 35; 
            const logoHeight = logoWidth * (53 / 200); 
            doc.addImage(logoBase64, 'PNG', 14, 15, logoWidth, logoHeight);
        }
    } catch (error) {
        console.error("Could not add logo to PDF:", error);
    }

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(title, pageWidth - 14, 22, { align: 'right' });

    // Add a dividing line under the header
    doc.setDrawColor(224, 224, 224); // light grey
    doc.line(14, 30, pageWidth - 14, 30);


    // Footer
    const drawFooter = () => {
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            const date = new Date().toLocaleDateString();
            doc.text(`© ${new Date().getFullYear()} HomeCalc Pro`, 14, pageHeight - 10);
            doc.text(`Generated on ${date}`, doc.internal.pageSize.width - 14, pageHeight - 10, { align: 'right' });
        }
    };
    
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
