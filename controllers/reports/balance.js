const stream = require('./stream')
var PdfPrinter = require('pdfmake')
const path = require('path')

exports.balance = async (data) => {
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
                text: 'Relatório de \nconta',
                color: '#333333',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                absolutePosition: { x: 0, y: 70 },
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
            {
                columns: [
                    {
                        table : {
                            headerRows : 0,
                            widths: ['*'],
                            body : [
                                [''],
                                ['']
                            ]
                        },
                        layout : 'lightHorizontalLines'
                    }
                ]
            },
            '\n',
            { text: `Total: ${data.total}.00 MT \n Balance Due: ${data.total}.00 MT`, bold: true, margin: [0, 0], alignment: 'right', fontSize: 11, },
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

