import { Injectable } from '@angular/core';
import { Registro } from '../modelos/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  escaneados: Registro[] = [];

  constructor(
    private storage: Storage,
    private navController:NavController,
    private inAppBrowser:InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
    ) {
    // tomar lo que este en el storage y almacenar en la variable de clase escaneados
    this.cargarStorage();
  }

  async cargarStorage() {
    // si lo del storage retorna un nulo, se debe reemplazar con un array vacio
    // opcion 1
    /*
    this.storage.get('escaneados').then((data)=>{
      this.escaneados = (data ) ? data: [];
    });
    */
    // opcion 2
    this.escaneados = await (this.storage.get('escaneados')) || [];
  }

  async guardarRegistro( format: string , text: string) {
    // esto es para garantizar que traiga la data que haya guardada antes de ir a registrar mas, asi lo coloco fernando herrera
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format,text);
    this.escaneados.unshift(nuevoRegistro);
    this.storage.set('escaneados', this.escaneados);
    // registros
    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro( registro: Registro ) {

    this.navController.navigateForward('/tabs/tab2');
    switch ( registro.type ) {
      case 'http':
        this.inAppBrowser.create( registro.text, '_system' );
      break;
      case 'geo':
        this.navController.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
      break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrTemp.push( titulos );

    this.escaneados.forEach( registro => {
      // el registro.text.replace(',', ' ') se usa por que hay data que contiene ejemplo 'geo: 11111, 2222' , si no se hace el replace probablemente el csv interprete eso como que existe una columna por la ',' y no es asi

      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',', ' ') }\n`;
      arrTemp.push( linea );

    });

    this.crearArchivoFisico( arrTemp.join('') );
  }

  crearArchivoFisico( text: string ) {
    // crea un archivo y lo almacena en el telefono antes de enviarlo por correo
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then( existe => {
        console.log('Existe archivo?', existe );
        return this.escribirEnArchivo( text );
      })
      .catch( err => {

        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
                .then( creado => this.escribirEnArchivo( text ) )
                .catch( err2 => console.log( 'No se pudo crear el archivo', err2 ));

      });


  }
  async escribirEnArchivo( text: string ) {

    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );

    const archivo = `${this.file.dataDirectory}/registros.csv`;
    // console.log(this.file.dataDirectory + 'registros.csv');

    const email = {
      to: 'fernando.herrera85@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'], // el bcc es para enviar una copia del correo enviado, sin que aparezca registrado ni visible para las demas personas a las que se le envio
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aquí tienen sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    };

    // Send a text message using default options

    // la siguiente linea levanta una ventana para que se envie por el correo proveedor asociado al telefono 'ejemplo gmail', esta linea retorna una promesa pero en este caso no la estoy usando
    this.emailComposer.open(email);

  }
}
