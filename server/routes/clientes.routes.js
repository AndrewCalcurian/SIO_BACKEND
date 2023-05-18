const express = require('express');
const Cliente = require('../database/models/clientes.model');
const QRCode = require('qrcode');
const printer = require('@thiagoelg/node-printer');
const fs = require('fs')
const path = require('path');
var util = require('util');
const app = express();
var moment = require('moment')
var Gestion = require('../database/models/gestiones.model')

const {getDefaultPrinter, print } = require('pdf-to-printer')


//test
const {DocumentDefinition, Table, Cell, Txt, Img, Stack, QR} = require('pdfmake-wrapper/server');
const Pdfmake = require('pdfmake');
const { text } = require('body-parser');


app.post('/api/prints', (req, res)=>{

    let body = req.body
    HOY = moment().format('yyyy-MM-DD');
    let change;
    if(!body.resto){
        change = {Impreso:HOY}
    }else{
        change = {Resto:HOY}
    }

    Gestion.findByIdAndUpdate(body.gestion, change, (err, GestionDB)=>{
        async function ImprimirPDF(){

            const printer__ = new Pdfmake({
                Roboto: {
                    normal: __dirname + '/fonts/Roboto/Roboto-Regular.ttf',
                    bold: __dirname + '/fonts/Roboto/Roboto-Medium.ttf',
                    italics: __dirname + '/fonts/Roboto/Roboto-Italic.ttf',
                    bolditalics: __dirname + '/fonts/Roboto/Roboto-MediumItalic.ttf'
                },
                BarlowCondensed: {
                    normal: __dirname + '/fonts/Etiquetas/BarlowCondensed-Regular.ttf',
                    bold: __dirname + '/fonts/Etiquetas/BarlowCondensed-Bold.ttf',
                    italics: __dirname + '/fonts/Etiquetas/BarlowCondensed-Ligth.ttf',
                }
            });
            
            // PdfMakeWrapper.useFont('BarlowCondensed');
        
            const doc = new DocumentDefinition();
            doc.pageOrientation('landscape');
            doc.pageMargins([ 10, 10 ]);
        
            doc.add(
                new Table([
                    [
                        new Cell(
                            await new Img(__dirname + '/images/Logo-etiquetas.png', true).width(250).build()
                        ).end,
                        new Cell(new QR(`${body.value}`).fit(120).alignment('center').end).end,
                        new Cell(
                            new Table([
                                [
                                    new Txt('ORDEN DE PRODUCCIÓN').alignment('center').font('BarlowCondensed').bold().fontSize(30).end,
                                ],
                                [
                                    new Txt(`${body.orden.sort}`).alignment('center').font('BarlowCondensed').margin([0,-18]).bold().fontSize(80).end,
                                ]
                            ]).alignment('center').end
                        ).fillColor('#000000').color('#FFFFFF').end,
                    ]
                ]).widths(['40%','27%','33%']).layout('noBorders').end
            )
            doc.add(
                '\n'
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Table([
                                [
                                    new Txt('PRODUCTO:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.orden.producto.producto}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                    ]
                ]).widths('100%').end
            )
            doc.add(
                '\n'
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Table([
                                [
                                    new Txt('CLIENTE:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.orden.cliente.nombre}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                        new Cell(
                            new Table([
                                [
                                    new Txt('ORDEN DE COMPRA N°:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.orden.orden}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                    ]
                ]).widths(['70%','30%']).end
            )
            doc.add(
                '\n'
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Table([
                                [
                                    new Txt('SUSTRATO:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.sustrado}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                        new Cell(
                            new Table([
                                [
                                    new Txt('CÓDIGO DE PRODUCTO:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.orden.producto.cod_cliente}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                    ]
                ]).widths(['70%','30%']).end
            )
            doc.add(
                '\n'
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Table([
                                [
                                    new Txt('COD. ESPECIFICACIÓN:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`E-${body.orden.cliente.codigo}-${body.orden.producto.codigo}-${body.orden.producto.edicion}-${body.orden.producto.version}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                        new Cell(
                            new Table([
                                [
                                    new Txt('FECHA DE FABRICACIÓN:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.fecha}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                        new Cell(
                            new Table([
                                [
                                    new Txt('FECHA DE ETIQ:').font('BarlowCondensed').fontSize(17).end,
                                ],
                                [
                                    new Txt(`${body.hoy}`).font('BarlowCondensed').fontSize(38).end,
                                ]
                            ]).layout('noBorders').end 
                        ).end,
                    ]
                ]).widths(['25%','20%','20%']).end
            )
    
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Table([
                                [
                                    new Txt(`${body.cantidad}`).font('BarlowCondensed').bold().alignment('center').fontSize(75).end,
                                ],
                                [
                                    new Txt('unidades').font('BarlowCondensed').bold().alignment('center').fontSize(38).margin([0,-8]).end,
                                ]
                            ]).width("100%").end 
                        ).fillColor('#000000').color('#FFFFFF').end
                    ]
                ]).margin([575,-85]).end
            )
    
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`\n\nSe recomienda el uso de este producto dentro de un lapso no mayor a 6 meses
                            Para mas información lea detenidamente nuestra "Politica de devoluciones o Reclamos (DD-005)"`).font('BarlowCondensed').fontSize(16).end,
    
                        ).alignment('center').end
                    ]
                ]).layout('noBorders').widths('65%').end
            )
    
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`FPR-018`).font('BarlowCondensed').fontSize(16).margin([755,3]).end,
                        ).end
                    ]
                ]).layout('noBorders').end
            )
        
            const pdf = printer__.createPdfKitDocument(doc.getDefinition());
        
            pdf.pipe(fs.createWriteStream('documento_test.pdf'));
            pdf.end();
    
        }
        ImprimirPDF();
    
    
        // print("C:/Users/administrador.POLINDUSTRIAL/Downloads/Label.pdf").then(console.log);
        const options = {
            printer: `${printer.getDefaultPrinterName()}`,
            scale: "fit",
            paperSize:'USER',
            orientation : 'portrait',
            copies:body.copias
        };
    
    
        console.log(body.copias)
        // console.log(printer.getDefaultPrinterName())
        // getDefaultPrinter().then(console.log)
        print("C:/Users/administrador.POLINDUSTRIAL/Desktop/Desarrollo/BK/documento_test.pdf", options).then(console.log);
        res.json('ok')
    })
    

   

})

app.get('/api/clientes', (req, res)=>{


    // --CONSULTA A LA COLECCION DE CLIENTES--
    Cliente.find((err, clientesDB)=>{

        // --EN CASO DE ERROR--
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        // --MOSRAR LOS CLIENTES--
        res.json({
            clientes:clientesDB
        })

    })

});

app.put('/api/cliente/:id', (req, res)=>{


    let id = req.params.id
    let data = req.body

    console.log(data)

    Cliente.findByIdAndUpdate(id, data, (err, ClienteDB)=>{
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json(ClienteDB)

    })

})

app.get('/api/qr/:info', (req, res)=>{

    let info = req.params.info

    QRCode.toString(info,{type:'terminal'}, function (err, url) {
        console.log(url)
        res.json('ok')
      })
})

app.post('/api/clientes', (req, res)=>{

    // --SE ACORTA EL REQUEST--
    let body = req.body;

// ----SE VACIA EL BODY EN UNA NUEVA CLASE DEL MODELO---
    const NewCliente = new Cliente({
        nombre: body.nombre,
        codigo:body.codigo,
        rif:body.rif,
        direccion:body.direccion,
        contactos:body.contactos,
        almacenes:body.almacenes
    })

// ----SE GUARDA LA INFORMACION EN LA BASE DE DATOS---
    NewCliente.save((err, grupoDB)=>{

        // --EN CASO DE ERROR--
        if( err ){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        // --MOSTRAR NUEVA MAQUINA AÑADIDA--
        res.json({
            NuevoGrupo:grupoDB
        });

    });

});

module.exports = app;