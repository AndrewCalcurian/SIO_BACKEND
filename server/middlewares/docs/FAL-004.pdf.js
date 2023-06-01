const {DocumentDefinition, Table, Cell, Txt, Img, Stack} = require('pdfmake-wrapper/server');
const Pdfmake = require('pdfmake');

const {NuevaSolicitud, NuevaSolicitud_} = require('../emails/solicitud.email')
const moment = require('moment')

const fs = require('fs')

const nodemailer = require('nodemailer');



async function FAL004(producto_,orden, num_solicitud,producto,cantidad,usuario, motivo,tabla){

    // //console.log(num_solicitud.length)

if(orden === "#"){
    orden = "N/A"
}

const printer = new Pdfmake({
    Roboto: {
        normal: __dirname + '/fonts/Roboto/Roboto-Regular.ttf',
        bold: __dirname + '/fonts/Roboto/Roboto-Medium.ttf',
        italics: __dirname + '/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: __dirname + '/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
});

/**
 * By default, Pdfmake uses 'Roboto' fonts, if you want 
 * to use custom fonts, you need to use the useFont method 
 * like this:
 * 
 * DocumentDefinition.useFont('MyCustomFonts');
 */

const doc = new DocumentDefinition();


const hoy = moment().format('DD/MM/yyyy');


doc.pageOrientation('landscape');
// doc.footer('Si usted esta consultando una versión de este documento, Asegúrese que sea la vigente');

if(num_solicitud >= 10){
    num_solicitud = `00${num_solicitud}`
}
else if(num_solicitud >= 100){
    num_solicitud = `0${num_solicitud}`
}
else if(num_solicitud < 10){
  num_solicitud = `000${num_solicitud}`
}

if(orden === '#'){
    orden = "N/A"
}

doc.add(

    

    new Table([
        [
            new Cell(
                await new Img(__dirname + '/images/poli_cintillo.png', true).width(85).margin([20, 5]).build()
            ).rowSpan(4).end,
            new Cell(new Txt(`
            FORMATO SOLICITUD DE MATERIAL`).bold().end).alignment('center').fontSize(13).rowSpan(4).end,
            new Cell(new Txt('Código: FAL-004').end).fillColor('#dedede').fontSize(7).alignment('center').end,
        ],
        [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('N° de Revisión: 0').end).fillColor('#dedede').fontSize(7).alignment('center').end,
        ],
        [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Fecha de Revisión: 11/10/2022').end).fillColor('#dedede').fontSize(7).alignment('center').end,
        ],
        [
            new Cell(new Txt('').end).end,
            new Cell(new Txt('').end).end,
            new Cell(new Txt('Página: 1 de 1').end).fillColor('#dedede').fontSize(7).alignment('center').end,
        ]
    ]).widths(['25%','50%','25%']).end
);

doc.add(
    '\n'
)

doc.add(
    new Table([
      [
        new Cell(new Txt('FECHA DE SOLICITUD').end).fillColor('#dedede').fontSize(10).alignment('center').end,
        new Cell(new Txt(`${hoy}`).end).end,
        new Cell(new Txt('N° SOLICITUD').end).fillColor('#dedede').fontSize(10).alignment('center').end,
        new Cell(new Txt(`AL-SOL-${num_solicitud}`).end).fontSize(15).alignment('center').end,
      ],
      [
        new Cell(new Txt('UNIDAD ADMINISTRATIVA').end).fillColor('#dedede').fontSize(10).alignment('center').end,
        new Cell(new Txt('GERENCIA DE OPERACIONES').end).end,
        new Cell(new Txt('ORDEN DE PRODUCCIÓN').end).fillColor('#dedede').fontSize(10).alignment('center').end,
        new Cell(new Txt(`${orden}`).end).alignment('center').end,
      ],
      [
        new Cell(new Txt('PRODUCTO').end).colSpan(2).fillColor('#dedede').fontSize(10).alignment('center').end,
        new Cell(new Txt('').end).end,
        new Cell(new Txt('').end).end,
        new Cell(new Txt(``).end).end,
      ]
    ]).widths(['25%','25%','25%','25%']).end
  )

doc.add(
    '\n'
)

doc.add(
    new Table([
        [
            new Cell(new Txt('DESCRIPCIÓN DEL MATERIAL').end).fillColor('#dedede').fontSize(9).alignment('center').end,
            // new Cell(new Txt('N° DE LOTE').end).fillColor('#dedede').fontSize(9).alignment('center').end,
            new Cell(new Txt('CANTIDAD SOLICITADA').end).fillColor('#dedede').fontSize(9).alignment('center').end,
        ],
        [
            // new Cell(new Txt('').end).border([false,false]).end,
            // new Cell(new Txt('').end).border([false,false]).end,


            new Cell(new Stack(producto).end).end,
            new Cell(new Stack(cantidad).end).end
            // // new Cell(new Stack(lotes).end).end,
        ]
    ]).widths(['75%','25%']).end
)

doc.add(
    '\n'
)

doc.add(
    new Table([
        [
            new Cell(new Txt('MOTIVO').end).fillColor('#dedede').fontSize(9).alignment('center').end,
            new Cell(new Txt('SOCITADO POR:').end).fillColor('#dedede').fontSize(9).alignment('center').end,
            new Cell(new Txt('RECIBIDO POR:').end).fillColor('#dedede').fontSize(9).alignment('center').end,
        ],
        [
            new Cell(new Txt(`${motivo}`).end).fontSize(9).end,
            new Cell(new Txt(`
            ${usuario}

            FECHA:${hoy}
            `).end).fontSize(9).end,
            new Cell(new Txt(`
            FIRMA: YRAIDA BAPTISTA

            FECHA:${hoy}
            `).end).fontSize(9).end,

        ]

    ]).widths(['50%','25%','25%']).end
)

doc.add(
    new Txt('Si usted esta consultando una versión de este documento, Asegúrese que sea la vigente').alignment('right').fontSize(8).end
)




const pdf = printer.createPdfKitDocument(doc.getDefinition());

// pdf.pipe(fs.createWriteStream('document.pdf'));
pdf.end();
// NuevaSolicitud(orden,'calcurianandres@gmail.com',motivo,num_solicitud,pdf)
if(orden === 'N/A'){
    NuevaSolicitud_(orden,'enida.aponte@poligraficaindustrial.com,carlos.mejias@poligraficaindustrial.com,freddy.burgos@poligraficaindustrial.com,zuleima.vela@poligraficaindustrial.com,yraida.baptista@poligraficaindustrial.com,calcurianandres@gmail.com',motivo,num_solicitud,pdf,tabla)
    // NuevaSolicitud_(orden,'calcurianandres@gmail.com',motivo,num_solicitud,pdf,tabla)
}else{
    NuevaSolicitud(orden,'enida.aponte@poligraficaindustrial.com,carlos.mejias@poligraficaindustrial.com,freddy.burgos@poligraficaindustrial.com,zuleima.vela@poligraficaindustrial.com,yraida.baptista@poligraficaindustrial.com,calcurianandres@gmail.com',motivo,num_solicitud,pdf,tabla)
    // NuevaSolicitud(orden,'calcurianandres@gmail.com',motivo,num_solicitud,pdf,tabla)
}


// asignacion(orden, solicitud, Lote, pdf,'Equipo', 'calcurian.andrew@gmail.com,enida.aponte@poligraficaindustrial.com,carlos.mejias@poligraficaindustrial.com,freddy.burgos@poligraficaindustrial.com')
//   asignacion(orden, solicitud, Lote, pdf,'EQUIPO DE TRABAJO', 'calcurian.andrew@gmail.com')
//  asignacion(orden, Lote, pdf,'Carlos', 'carlos.mejias@poligraficaindustrial.com')
    //  asignacion(orden, Lote, pdf,'Freddy', 'freddy.burgos@poligraficaindustrial.com')
    return

}

module.exports = {
    FAL004
}