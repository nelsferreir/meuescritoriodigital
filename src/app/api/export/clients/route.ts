import { NextResponse } from "next/server";
import { getClients } from "@/lib/actions/client.actions";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
import { Client } from "@/lib/actions/client.actions";

function drawHeader(page: any, font: PDFFont, boldFont: PDFFont, width: number) {
  const headerText = "Relatório de Clientes";
  const dateText = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
  
  page.drawText(headerText, {
    x: 50,
    y: page.getHeight() - 50,
    font: boldFont,
    size: 20,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(dateText, {
    x: width - 50 - font.widthOfTextAtSize(dateText, 10),
    y: page.getHeight() - 50,
    font: font,
    size: 10,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  page.drawLine({
    start: { x: 50, y: page.getHeight() - 65 },
    end: { x: width - 50, y: page.getHeight() - 65 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
}); }

function drawFooter(page: any, font: PDFFont, pageNumber: number, totalPages: number) {
  const footerText = `Página ${pageNumber} de ${totalPages}`;
  page.drawText(footerText, {
    x: page.getWidth() / 2 - font.widthOfTextAtSize(footerText, 10) / 2,
    y: 30,
    font: font,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
}); }

function drawTableHeader(page: any, y: number, boldFont: PDFFont, colWidths: number[], margin: number) {
  const header = ["Nome", "Email", "Telefone", "Data de Cadastro"];
  let x = margin;
  const headerY = y - 15;

  page.drawRectangle({
    x: margin,
    y: y - 25,
    width: colWidths.reduce((a, b) => a + b, 0),
    height: 25,
    color: rgb(0.94, 0.94, 0.94),
  });

  header.forEach((text, i) => {
    page.drawText(text, {
      x: x + 5,
      y: headerY,
      font: boldFont,
      size: 10,
      color: rgb(0.2, 0.2, 0.2),
    });
    x += colWidths[i];
  });

  return y - 25;
}

function drawTableRow(page: any, y: number, client: Client, font: PDFFont, colWidths: number[], margin: number, isEven: boolean) {
  const rowHeight = 25;
  const textY = y - 15;
  let x = margin;

  if (isEven) {
    page.drawRectangle({
      x: margin,
      y: y - rowHeight,
      width: colWidths.reduce((a, b) => a + b, 0),
      height: rowHeight,
      color: rgb(0.98, 0.98, 0.98),
  }); }

  const rowData = [
    client.name,
    client.email || "N/A",
    client.phone || "N/A",
    new Date(client.created_at).toLocaleDateString('pt-BR'),
  ];
  
  rowData.forEach((text, i) => {
    page.drawText(text, {
      x: x + 5,
      y: textY,
      font: font,
      size: 9,
      color: rgb(0.3, 0.3, 0.3),
    });
    x += colWidths[i];
  });
  
  return y - rowHeight;
}

export async function GET() {
  try {
    const clients = await getClients();
    const pdfDoc = await PDFDocument.create();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageHeight = 841.89;
    const pageTop = pageHeight - margin - 50;
    const pageBottom = margin + 30;

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const colWidths = [150, 180, 100, 100];
    
    const rowsPerPage = Math.floor((pageTop - pageBottom) / 25);
    const totalPages = Math.ceil(clients.length / (rowsPerPage -1));
    let pageNumber = 1;

    drawHeader(page, font, boldFont, width);
    let y = pageTop;
    y = drawTableHeader(page, y, boldFont, colWidths, margin);

    for (let i = 0; i < clients.length; i++) {
      if (y - 25 < pageBottom) {
        drawFooter(page, font, pageNumber, totalPages);
        page = pdfDoc.addPage();
        pageNumber++;
        drawHeader(page, font, boldFont, width);
        y = pageTop;
        y = drawTableHeader(page, y, boldFont, colWidths, margin);
      }
      
      y = drawTableRow(page, y, clients[i], font, colWidths, margin, i % 2 === 0);
    }
    
    drawFooter(page, font, pageNumber, totalPages);

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="relatorio-clientes.pdf"',
    }, });

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return new NextResponse("Erro ao gerar o relatório em PDF.", { status: 500 });
} }