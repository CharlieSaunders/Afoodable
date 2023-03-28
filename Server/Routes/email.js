const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../Data/conn');
const emailRoutes = express.Router();

emailRoutes.route('/api/email').post(async function (_req, res) {
    
    const dbConnect = dbo.getDb();

    return await dbConnect.collection('secrets')
    .find({})
    .limit(1)
    .toArray(function (err, result) {
        if (err) {
            console.log(`There was an error connecting to MongoDB Secrets. The application hasn't been terminated:\n${err}`);
        } else {
            console.log(JSON.stringify(_req.body));
            var ingredients = "";
            var secret = result[0].gmailPassword;
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'afoodable.dev@gmail.com',
                pass: secret,
              },
            });
        
            transporter.sendMail({
                from: '"Afoodable" afoodable.dev@gmail.com',
                to: "charlie.g.saunders@gmail.com",
                subject: "🌟 Here's the shopping list you asked for...", 
                html: getHtml(),
              })
              .then(info => {
                console.log({info});
              })
              .catch(console.error);
        }
    });
})

function getHtml(){
    return "<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
"<html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>"+
"<head>"+
"  <!--[if gte mso 9]>"+
"  <xml>"+
"    <o:OfficeDocumentSettings>"+
"      <o:AllowPNG/>"+
"      <o:PixelsPerInch>96</o:PixelsPerInch>"+
"    </o:OfficeDocumentSettings>"+
"  </xml>"+
"  <![endif]-->"+
"  <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+
"  <meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
"  <meta name='x-apple-disable-message-reformatting'>"+
"  <!--[if !mso]><!--><meta http-equiv='X-UA-Compatible' content='IE=edge'><!--<![endif]-->"+
"    <title>Your Afoodable shoppin glist</title>"+
"    <style type='text/css'>"+
"      a,a[href],a:hover, a:link, a:visited {"+
"        text-decoration: none!important;"+
"        color: #0000EE;"+
"      }"+
"      .link {"+
"        text-decoration: underline!important;"+
"      }"+
"      p, p:visited {"+
"        font-size:15px;"+
"        line-height:24px;"+
"        font-family:'Helvetica', Arial, sans-serif;"+
"        font-weight:300;"+
"        text-decoration:none;"+
"        color: #000000;"+
"      }"+
"      h1 {"+
"        font-size:22px;"+
"        line-height:24px;"+
"        font-family:'Helvetica', Arial, sans-serif;"+
"        font-weight:normal;"+
"        text-decoration:none;"+
"        color: #000000;"+
"      }"+
"      .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}"+
"      .ExternalClass {width: 100%;}"+
"    </style>"+
"</head>"+
"  <body style='text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-color: #f2f4f6; color: #000000' align='center'>"+
"  <div style='text-align: center;'>"+
"    <img style='width: 600px; max-width: 600px; height: 350px; max-height: 350px; text-align: center;' alt='Hero image' src='https://img.freepik.com/free-photo/chicken-wings-barbecue-sweetly-sour-sauce-picnic-summer-menu-tasty-food-top-view-flat-lay_2829-6471.jpg' align='center' width='600' height='350'>"+
"    <table align='center' style='text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;' width='600'>"+
"      <tbody>"+
"        <tr>"+
"          <td style='width: 596px; vertical-align: top; padding-left: 0; padding-right: 0; padding-top: 15px; padding-bottom: 15px;' width='596'>"+
"            <img style='width: 85px; max-width: 85px; height: 85px; max-height: 85px; text-align: center; color: #ffffff;' alt='Logo' src='https://cdn-icons-png.flaticon.com/512/5787/5787016.png' align='center' width='85' height='85'>"+
"          </td>"+
"        </tr>"+
"      </tbody>"+
"    </table>"+
"    <table align='center' style='text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;' width='600'>"+
"        <tbody>"+
"          <tr>"+
"            <td style='width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;' width='596'>"+
"              <h1 style='font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;'>Hey Charlotte & Charlie 👋</h1>"+
"              <h3 style='font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;'>Your selected recipes</h3>"+
"              <p> Steak & Mash (x2) </p>"+
"              <h3 style='font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;'>The ingredients you need</h3>"+
"              <input type='checkbox' id='steak' name='steak' value='Steak'><label for='steak'> Steak - 4 fillets</label><br>"+
"            </td>"+
"          </tr>"+
"        </tbody>"+
"      </table>"+
"  </div>"+
"  </body>"+
"</html>"
}

module.exports = emailRoutes;