const nodemailer = require('nodemailer');
const {header6,header2, footer} = require('../templates/template.email');
let {tituloCorreo} = require('../templates/template.email')

function NuevaSolicitud_(correo,adjunto,table){
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


    let titulo = `<h1>Hola Admin!</h1>`
    let random = Math.floor(Math.random() * 100) + 1;
    var mailOptions = {
        from: '"SIO - Sistema Integral de Operacion" <sio.soporte@poligraficaindustrial.com>',
        to: correo,
        subject: `Solicitud de Material ${random}`,
        attachments: [{
            filename: `AL-SOL.pdf`,
            content:adjunto
        }],
        html:`${header6(titulo)}
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
                       <th>Cantidad</th>
                   </tr>
                   ${table}
               </table><br>
    <b>Motivo:</b><br>
    Dirígete al sistema SIO para asignarlo(s).

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
    NuevaSolicitud_
}