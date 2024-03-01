const stream = require('./stream')
var PdfPrinter = require('pdfmake')
const path = require('path')
const factory = require('./../handlerFactory')
const Client = require('./../../models/clientModel')

exports.facture = async (data) => {
    var options = { style: 'currency', currency: 'USD' }
    var form = new Intl.NumberFormat('en-US', options)


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
                text: 'FACTURA \n PRO-FORMA',
                color: '#333333',
                fontSize: 11,
                fontSize: 28,
                bold: true,
                alignment: 'right',
                absolutePosition: { x: 0, y: 70 },
            },
            '\n\n',
            {
                lineHeight: 1.20,
                text: ` Data: ${new Date().toLocaleDateString('pt-PT')} \n Quote No.:`,
                fontSize: 11,
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
                text: `${data.client} \n`.toUpperCase(),
                color: '#333333',
                // absolutePosition: {x: 0, y: 70},
            },
            {
                text: `NUIT: ${await getNuit(data.clientID)}`.toUpperCase(),
                color: '#333333',
                // absolutePosition: {x: 0, y: 70},
            },
            '\n\n',
            {
                columns: [
                    {
                        table: {
                            border: [true, true, true, true],
                            headerRows: 1,
                            widths: [30, 300, 80, 70],
                            body: data.rows,
                        }

                    }
                ]
            },
            '\n',
            { text: `Subtotal: ${form.format(data.total).slice(1)} MT \n IVA: ${form.format(data.total * 0.16).slice(1)} MT`, margin: [0, 10], alignment: 'right', fontSize: 11, },
            { text: `Total: ${form.format((data.total * 0.16) + data.total).slice(1)} MT`, bold: true, margin: [0, 0], alignment: 'right', fontSize: 11, },
            '\n\n\n',
            { text: 'Please contact us for more information about payment options.', bold: true, margin: [0, 0], fontSize: 11, },
            '\n',
            { text: 'Moza Conta: 2678621910001 NIB: 00340000 2678621910166', margin: [0, 0], fontSize: 11, },
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


const getNuit = async (orderID) => {
    const doc = await Client.find({ clientID: orderID })
    if (doc.length == 0) { return '' } else {
        return doc[0].client_nuit
    }
}