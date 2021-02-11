import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  latitud: number;
  longitud: number;
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    let geo:any = this.route.snapshot.paramMap.get('geo');
    // la variable geo tra algo como 'geo:40.731000000,-74.0060872'
    // le quitamos la palabra geo al string
    geo = geo.substr(4);
    // creamos un array partiendo el string por donde consiga una ','
    geo = geo.split(',');
    this.latitud = Number(geo[0]);
    this.longitud = Number(geo[1]);
    console.log(this.latitud, this.longitud );
  }
  ngAfterViewInit() {
    /********** IMPORTANTE**************** */
    // SI NO SE ENSEÑA EL MAPA O MUESTRA UNA DIRECCION QUE NO CORRESPONDE, ENTONCES RECOMIENDO COLOCAR EN EL CAMPO LONGITUD LO QUE VA EN LATITUD, Y EL LATITUD LO QUE TENGA LONGITUD
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zdWVwZXJlemYiLCJhIjoiY2trenJxc3BxMGVzMDJxbnkwMWlzbTJtcCJ9.4JqnC3t0oqZCp2mDkb4sKA';
    var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v10',
    center: [this.longitud, this.latitud ],
    zoom: 17.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
    });


    map.on('load', ()=> {
      /**************************** importanteeee */
       // para que el mapa no se vea cortado se debe ejecutar en la siguiente linea
       map.resize();
      // CREAR MARCADORESSSSSSSS
      //  FUENTE: https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
      new mapboxgl.Marker()
        .setLngLat([this.longitud, this.latitud])
        .addTo(map);

      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
      }
      }

      map.addLayer(
      {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
      'fill-extrusion-color': '#aaa',

      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
      ],
      'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
      }
      },
      labelLayerId
      );
      });



  }
}
