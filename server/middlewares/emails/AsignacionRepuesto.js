const nodemailer = require('nodemailer');
const {header7,header2, footer} = require('../templates/template.email');
let {tituloCorreo} = require('../templates/template.email')

function NuevaAsignacion(correo,adjunto,motivo,correlativo,table){

    correlativo = Math.floor(Math.random() * 9000) + 1000;
    var transporter = nodemailer.createTransport({
        host: "mail.poligraficaindustrial.com",
        port: 25,
        secure: false,
        auth: {
            user: 'sio.soporte@poligraficaindustrial.com',
            pass: 'P0l1ndc@'
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    let titulo = `<h1>Hola Equipo!</h1>`
    var mailOptions = {
        from: '"SIO - Sistema Integral de Operacion" <sio.soporte@poligraficaindustrial.com>',
        to: correo,
        subject: `Asignación de repuesto - RP-SOL-24-${correlativo}`,
        attachments: [{
            filename: `RP-ASG-24-${correlativo}.pdf`,
            content:adjunto
        }],
        html:`${header7(titulo, 'Nueva Asignación de Repuesto')}
        <br>
               Se ha realizado una nueva solicitud de repuesto 
               <br>
               <style>
               table, th, td {
               border: 1px solid black;
               border-collapse: collapse;
               }
               </style>
              <table align="center" border=".5" cellpading="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                   <tr>
                       <th>Nº de parte</th>
                       <th>Repuesto</th>
                       <th>Categoria</th>
                       <th>Máquina</th>
                       <th>Ubicación</th>
                       <th>Cantidad</th>
                   </tr>
                   ${table}
               </table><br>
    <b>Motivo:</b>${motivo}<br>

            ${footer}`
    };

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
           console.log(err);
        }else{
            //console.log(info);
        }
    });
}

module.exports = {
    NuevaAsignacion
}