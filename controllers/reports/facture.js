const stream = require('./stream')
var PdfPrinter = require('pdfmake')
const path = require('path')

exports.facture = async (data) => {
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
    }

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
                text: 'Zeyn Car Care Center',
                color: '#333333',
                bold: true,
                absolutePosition: {x: 170, y: 70},
                margin: [0, 0, 0, 0], //left, rigth, top, bottom
            },
            {
                text: 'Email: info@groupzeyn.com \n NUIT: 401287817 \n Bairro: Francisco Manyanga-Tete \n (+258) 871010109',
                color: '#333333',
                absolutePosition: {x: 170, y: 80},
                margin: [0, 0, 0, 0],
            },
            {
                text: 'Cotação',
                color: '#333333',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                absolutePosition: {x: 0, y: 70},
            },
            '\n\n',
            {
                text: 'Cotação No.: 256 \n Data: 15/02/2024',
                color: '#333333',
                alignment: 'right',
               // absolutePosition: {x: 0, y: 70},
            },
            {
                text: 'Cliente:',
                color: '#333333',
                bold: true,
            },
            {
                text: `${data.client} \n NUIT: xxxxxx,`.toUpperCase(),
                color: '#333333',
               // absolutePosition: {x: 0, y: 70},
            },
            '\n\n\n\n',
            {
                columns: [
                    {
                        table: {
                            headerRows: 1,
                            widths: [30, 300, 80, 70],
                            body: data.rows
                                /*
                                [
                                    { text: '12' },
                                    { text: 'Alinhamento de direcao' },
                                    { text: '2500' },
                                    { text: '2500' }
                                ]*/
                                
                        }
                    }
                ]
            },
            { text: `Subtotal: ${data.total}.00 MT \n IVA: ${data.total*0.16}.00 MT`, margin: [0, 10], alignment: 'right' },
            { text: `Total: ${(data.total*0.16) + data.total}.00 MT \n Balance Due: ${(data.total*0.16) + data.total}.00 MT`, bold: true, margin: [0, 0], alignment: 'right' },
            '\n\n\n',
            { text: 'Please contact us for more information about payment options. \n Thank you for your business', bold: true, margin: [20, 0] },
            '\n',
            { text: 'Moza Conta: 2678621910001 \n NIB: 00340000 2678621910166', margin: [10, 0], alignment: 'right' },
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
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 10, 0, 10],
                alignment: 'center'
            },
            tableHeader:
            {
                border: true
            }
        },
        defaultStyle: {
            columnGap: 20,
            font: 'Courier'
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

