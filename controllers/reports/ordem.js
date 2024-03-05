const stream = require('./stream')
var PdfPrinter = require('pdfmake')
const path = require('path');

exports.ordem = async (data, downTab) => {
    var rows = downTab

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
    };

    var printer = new PdfPrinter(fonts);

    var docDefinition = {
        pageSize: 'A4',
        content: [
            {
                image: path.join(__dirname, 'img/logo.jpg'),
                width: 130,
                margin: [0, 0, -70, 0]
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
                text: data.class === 'a' ? 'Factura' : 'Ordem',
                color: '#333333',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                absolutePosition: { x: 0, y: 70 },
            },
            {
                text: data.class === 'a' ? `Data emissão:\n ${new Date().toLocaleDateString('pt-PT')} \nFAT No.`: `Data emissão:\n ${new Date().toLocaleDateString('pt-PT')} \nOrdem No.`,
                color: '#333333',
                fontSize: 11,
                alignment: 'right',
                absolutePosition: { x: 0, y: 100 },
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
                text: `Código: ${data.orderID} \n Data: ${data.date}`,
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
            data.class === 'a' ? {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i, node) {
                        return 1;
                    },
                    vLineWidth: function (i, node) {
                        return 1;
                    },
                    hLineColor: function (i, node) {
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
                        return 3;
                    },
                    paddingBottom: function (i, node) {
                        return 3;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                        [
                            {
                                text: `Sub total:\n IVA: \n\n Total:`,
                                border: [false, true, false, true],
                                alignment: 'right',
                                fontSize: 10,
                                margin: [0, 5, 0, 5],
                            },
                            {
                                border: [false, true, false, true],
                                text: ` ${form.format(data.total).slice(1)} MT \n ${form.format(data.total * 0.16).slice(1)} MT \n\n  ${form.format(data.total + (data.total * 0.16)).slice(1)} MT`,
                                alignment: 'right',
                                fontSize: 10,
                                fillColor: '#f5f5f5',
                                margin: [0, 5, 0, 5]
                            }
                        ],
                    ]
                }
            } : { text: '' },
            data.class === 'a' ? '\n\n' : '',
            data.ordem_feedback === 'yes' ? '\n\n' : '',
            {
                text: data.ordem_feedback === 'yes' ? 'Termos & condições aplicáveis' : ''
            },
            '\n',
            {
                text: data.ordem_feedback === 'yes' ? 'O Lorem Ipsum é um texto modelo da indústria \n tipográfica e de impressão' : '',
                style: 'notesText',
            },
            data.ordem_feedback === 'yes' ? '\n\n\n' : '',
            {
                //text: 'ASS. DO CLIENTE:_______________________________________________________'
                text: '------------------------------------------------------------------------------------',
                fontSize: 8,
            },
            {
                text: 'Ass. do Cliente',
            },



            '\n\n\n\n',
            data.class === 'a' ? '' : {
                text: '> --------',
                margin: [0, 0, 0, 0],
                color: '#333333'
            },
            '\n\n\n\n',



            //---------------------------------------------------------------------------------------------------
            data.class === 'a' ? '' : [/*
                {
                    image: path.join(__dirname, 'img/logo.jpg'),
                    width: 130,
                    margin: [0, 0, 0, 0],
                },
                {
                    lineHeight: 1.20,
                    text: 'Zeyn Car Care Center',
                    color: '#333333',
                    bold: true,
                    absolutePosition: { x: 170, y: 430 },
                    margin: [0, 0, 0, 0], //left, rigth, top, bottom
                },
                {
                    fontSize: 11,
                    lineHeight: 1.20,
                    text: 'Email: info@groupzeyn.com \n NUIT: 401287817 \n Bairro: Francisco Manyanga-Tete \n (+258) 871010109',
                    color: '#333333',
                    absolutePosition: { x: 170, y: 445 },
                    margin: [0, 0, 0, 0],
                },*/
                {
                    text: data.class === 'a' ? 'Factura' : 'Ordem',
                    color: '#333333',
                    fontSize: 28,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 0, 0, -10]
                    //absolutePosition: { x: 0, y: 100 },
                },
                '\n',
                {
                    text: data.class === 'a' ? `Data emissão:\n ${new Date().toLocaleDateString('pt-PT')} \nFAT No.`: `Data emissão:\n ${new Date().toLocaleDateString('pt-PT')} \nOrdem No.`,
                    color: '#333333',
                    fontSize: 11,
                    alignment: 'right',
                    margin: [0, 0, 0, -50]
                    // absolutePosition: { x: 0, y: 120},
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
                    text: `Código: ${data.orderID} \n Data: ${data.date}`,
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
                        body: rows
                    },
                },
                '\n',
                data.ordem_feedback === 'yes' ? '\n\n' : '',
                {
                    text: data.ordem_feedback === 'yes' ? 'Termos & condições aplicáveis' : ''
                },
                '\n',
                {
                    text: data.ordem_feedback === 'yes' ? 'O Lorem Ipsum é um texto modelo da indústria \n tipográfica e de impressão' : '',
                    style: 'notesText',
                },
                data.ordem_feedback === 'yes' ? '\n\n\n' : '',
                {
                    //text: 'ASS. DO CLIENTE:_______________________________________________________'
                    text: '------------------------------------------------------------------------------------',
                    fontSize: 8,
                },
                {
                    text: 'Ass. do Cliente'
                }

            ]

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
