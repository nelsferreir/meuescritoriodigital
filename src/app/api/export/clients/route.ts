import { NextResponse } from "next/server";
import { getClients } from "@/lib/actions/client.actions";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET() {
  try {
    const clients = await getClients();
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 10;
    const margin = 50;
    let y = height - margin;

    page.drawText("Relatório de Clientes", {
      x: margin,
      y,
      font: boldFont,
      size: 18,
      color: rgb(0, 0, 0),
    });
    y -= 30;

    const tableHeader = ["Nome", "Email", "Telefone", "Data de Cadastro"];
    const colWidths = [150, 180, 100, 100];
    let x = margin;

    tableHeader.forEach((header, i) => {
        page.drawText(header, { x, y, font: boldFont, size: fontSize });
        x += colWidths[i];
    });
    y -= 20;

    page.drawLine({
        start: { x: margin, y: y + 5 },
        end: { x: width - margin, y: y + 5 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    clients.forEach((client) => {
        if (y < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
        }

        let currentX = margin;
        
        page.drawText(client.name, { x: currentX, y, font, size: fontSize });
        currentX += colWidths[0];

        page.drawText(client.email || "N/A", { x: currentX, y, font, size: fontSize });
        currentX += colWidths[1];

        page.drawText(client.phone || "N/A", { x: currentX, y, font, size: fontSize });
        currentX += colWidths[2];
        
        page.drawText(new Date(client.created_at).toLocaleDateString(), { x: currentX, y, font, size: fontSize });
        
        y -= 20;
    });

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