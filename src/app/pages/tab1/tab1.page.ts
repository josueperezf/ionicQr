import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../servicios/data-local.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  opciones= {
    allowSlidePrev: false,
    allowSlideNext: false,
  };

  constructor(private barcodeScanner: BarcodeScanner, private  dataLocalService: DataLocalService) {}

  scanear() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled) {
        this.dataLocalService.guardarRegistro(barcodeData.format, barcodeData.text);
        console.log('barcode', barcodeData);
      }
     }).catch(err => {
        console.log('Error', err);
        // this.dataLocalService.guardarRegistro('QRCode', 'https://google.com');
     });
  }
}
