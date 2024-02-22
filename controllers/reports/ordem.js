const stream = require('./stream')
var PdfPrinter = require('pdfmake')
const path = require('path')

exports.ordem = async (data) => {
    var fonts = {
        Courier: {
            normal: 'Courier',
            bold: 'Courier-Bold',
            italics: 'Courier-Oblique',
            bolditalics: 'Courier-BoldOblique'
        },
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        },
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic'
        },
        Symbol: {
            normal: 'Symbol'
        },
        ZapfDingbats: {
            normal: 'ZapfDingbats'
        }
    };

    var printer = new PdfPrinter(fonts);

    var docDefinition = {
        pageSize: 'A4',
        content: [
            {
                image: path.join(__dirname, 'img/logo.jpg'),
                width: 130,
                margin: [0, 0, -50, 0]
            },
            {
                lineHeight: 1.20,
                text: 'Zeyn Car Care Center',
                color: '#333333',
                bold: true,
                absolutePosition: { x: 170, y: 76 },
                margin: [0, 0, 0, 0], //left, rigth, top, bottom
            },
            {
                fontSize: 11,
                lineHeight: 1.20,
                text: 'Email: info@groupzeyn.com \n NUIT: 401287817 \n Bairro: Francisco Manyanga-Tete \n (+258) 871010109',
                color: '#333333',
                absolutePosition: { x: 170, y: 90 },
                margin: [0, 0, 0, 0],
            },
            {
                text: 'Ordem',
                color: '#333333',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                absolutePosition: { x: 0, y: 70 },
            },
            '\n\n',
            {
                text: `Data emissão:\n ${new Date().toLocaleDateString('pt-PT')} \nPO No.`,
                color: '#333333',
                fontSize: 11,
                alignment: 'right',
                //absolutePosition: {x: 0, y: 70},
            },
            {
                text: 'Cliente:',
                color: '#333333',
                bold: true,
            }, {
                text: `${data.client}`.toUpperCase(),
                color: '#333333',
                fontSize: 11,
                bold: true,
            },
            {
                text: `Código de ordem: ${data.orderID} \n Data de Ordem: ${data.date}`,
                fontSize: 11,
                color: '#333333',
                // absolutePosition: {x: 0, y: 70},
            },
            {
                text: `Viatura: ${data.vehicleID}`,
                color: '#333333',
                fontSize: 11,
                bold: true,
            },
            '\n\n',
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i, node) {
                        return 1;
                    },
                    vLineWidth: function (i, node) {
                        return 1;
                    },
                    hLineColor: function (i, node) {
                        if (i === 1 || i === 0) {
                            return '#bfdde8';
                        }
                        return '#eaeaea';
                    },
                    vLineColor: function (i, node) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i, node) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i, node) {
                        return 10;
                    },
                    paddingRight: function (i, node) {
                        return 10;
                    },
                    paddingTop: function (i, node) {
                        return 2;
                    },
                    paddingBottom: function (i, node) {
                        return 2;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 80],
                    body: data.rows
                },

            },
            '\n',
            '\n\n',
            {
                text: data.ordem_feedback === 'yes' ? 'Termos & condições aplicáveis': ''
            },
            '\n',
            {
                text: data.ordem_feedback === 'yes' ? 'O Lorem Ipsum é um texto modelo da indústria \n tipográfica e de impressão': '',
                style: 'notesText',
            },
            '\n\n\n',
            {
                //text: 'ASS. DO CLIENTE:_______________________________________________________'
                text: '----------------------------------------------------------------------------------------------------------------',
                fontSize: 8,
            },
            {
                text: 'Ass. do Cliente'
            },
            '\n\n',
            {
                text: 'Processado por\n Zeyn, Orders system',
                style: 'notesText',
            },
        ],
        styles: {
            notesTitle: {
                fontSize: 10,
                bold: true,
                margin: [0, 50, 0, 3],
            },
            notesText: {
                fontSize: 10,
            },
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Helvetica'
        },
    }


    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    let writeStream = new stream.WritableBufferStream();
    pdfDoc.pipe(writeStream);

    pdfDoc.end()
    return new Promise((resolve, reject) => {
        const callback = () => {
            resolve(writeStream.toBuffer())
        }
        writeStream.on('finish', callback)
        //writeStream.end(callback)
    }
    )
}

async function produceRef(bi) {
    const b = bi
    const d = b.charAt(0)
    const d1 = b.charAt(9)
    const d2 = b.charAt(10)
    const d3 = b.charAt(11)
    const d4 = b.charAt(12)
    const codigo = 'ref00' + d1 + d2 + d3 + d4 + d + '@2kdomwriter'
    return new Promise((resolve, reject) => {
        resolve(codigo)
    })
}
