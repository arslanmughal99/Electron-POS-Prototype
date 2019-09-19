"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var Store = require("electron-store");
var PDFDocument = require("pdfkit");
var electron_1 = require("electron");
var store = new Store({ cwd: path.join(electron_1.app.getPath('appData'), '.cusResSetApp') });
function generatePdf(bill, filepath) {
    var config = {
        companyLogo: store.get('companyLogo', ''),
        printLogo: store.get('printLogo'),
        appSettings: store.get('appSettings')
    };
    var pdf = new PDFDocument({ margin: 50, size: 'A4' });
    generateHeader(pdf, bill, config);
    generateCustomerInformation(pdf, bill);
    generateInvoiceTable(pdf, bill, config);
    generateFooter(pdf, config);
    pdf.end();
    pdf.pipe(fs.createWriteStream("" + path.join(filepath)));
}
function generateHeader(doc, billObj, config) {
    if (config.printLogo && config.companyLogo !== '') {
        doc
            .image(config.companyLogo, 50, 52, { width: 100 });
    }
    if (!config.printLogo) {
        doc
            .fillColor('#444444')
            .fontSize(20)
            .text("" + config.appSettings.companyName, 50, 65);
    }
    doc
        .fillColor('#444444')
        .fontSize(10)
        .text("" + config.appSettings.companyContact, 50, 65, { align: 'right' })
        .text("" + config.appSettings.companyAddress, 50, 80, { align: 'right' })
        .moveDown();
}
function generateCustomerInformation(doc, bill) {
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Invoice', 50, 160);
    generateHr(doc, 185);
    var customerInformationTop = 200;
    doc
        .fontSize(10)
        .text('Name:', 50, customerInformationTop)
        .font('Helvetica-Bold')
        .text(bill.clientName, 150, customerInformationTop)
        .font('Helvetica')
        .text('Date :', 50, customerInformationTop + 15)
        .text(new Date(bill.dateOfInvoice).toDateString(), 150, customerInformationTop + 15)
        .font('Helvetica')
        .text('Invoice Number:  ', 400, customerInformationTop)
        .font('Helvetica-Bold')
        .text(bill.reciptId, 450, customerInformationTop, { align: 'right' })
        .font('Helvetica')
        .text('Print Date : ', 400, customerInformationTop + 15)
        .font('Helvetica-Bold')
        .text(new Date().toDateString(), 450, customerInformationTop + 15, { align: 'right' })
        .moveDown();
    generateHr(doc, 247);
}
function generateInvoiceTable(doc, bill, config) {
    var itemsCount = 0;
    var totalPrice = calculateTotalPrice(bill);
    var salesTaxPrice = Math.floor(calculateSalesTax(totalPrice, bill.salesTaxPercent)) || 0;
    var i;
    var invoiceTableTop = 330;
    doc.font('Helvetica-Bold');
    generateTableRow(doc, invoiceTableTop, 'Item', 'Price', 'Quantity', 'Unit', 'Total');
    generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    var itemsPerPage = 13;
    for (i = 0; i < bill.itemsPurchased.length; i++) {
        var item = bill.itemsPurchased[i];
        var position = invoiceTableTop + (itemsCount + 1) * 30;
        generateTableRow(doc, position, item.itemName, item.pricePerUnit, item.itemQuantity, item.unitOfMeasure, item.pricePerUnit * item.itemQuantity);
        generateHr(doc, position + 20);
        itemsCount++;
        // add new page if items are more thant that of paper size i.e A4
        if (itemsCount % itemsPerPage === 0) {
            invoiceTableTop = 5;
            itemsCount = 0;
            doc.addPage();
            itemsPerPage = 21;
        }
    }
    var subtotalPosition = invoiceTableTop + (itemsCount + 1) * 30;
    generateTableRow(doc, subtotalPosition, '', '', '', 'Total:', totalPrice);
    var salesTax = subtotalPosition + 20;
    generateTableRow(doc, salesTax, '', '', '', 'Sales tax: ', salesTaxPrice);
    var nettotal = salesTax + 25;
    doc.font('Helvetica-Bold');
    generateTableRow(doc, nettotal, '', '', '', 'Net Total: ', totalPrice + salesTaxPrice);
    doc.font('Helvetica');
}
function generateTableRow(doc, y, item, price, quantity, discount, total) {
    doc
        .fontSize(10)
        .text(item, 50, y, { width: 100 })
        .text(price, 200, y, { width: 50, align: 'right' })
        .text(quantity, 290, y, { width: 50, align: 'right' })
        .text(discount, 360, y, { width: 50, align: 'right' })
        .text(total, 460, y, { width: 50, align: 'right' });
}
function generateHr(doc, y) {
    doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
function generateFooter(doc, config) {
    doc
        .fontSize(11)
        .text(config.appSettings.ccustomReciptMessage, 50, 779, { align: 'center', width: 500 });
}
function calculateTotalPrice(bill) {
    var items = bill.itemsPurchased;
    var total = 0;
    items.forEach(function (item) {
        total += item.pricePerUnit * item.itemQuantity;
    });
    return total;
}
function calculateSalesTax(total, percentage) {
    return (total / 100) * percentage;
}
function getPdfCommandDynamic() {
    electron_1.ipcMain.on('generate-pdf', function (event, commandsObj) {
        try {
            generatePdf(commandsObj.billObj, commandsObj.path);
            event.sender.send('generate-pdf-status', true);
        }
        catch (_) {
            event.sender.send('generate-pdf-status', false);
        }
    });
}
exports.getPdfCommandDynamic = getPdfCommandDynamic;
//# sourceMappingURL=pdf-generator-dynamic.js.map