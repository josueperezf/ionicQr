# ionicQr

Este proyecto tiene como objetivo, crear un scaner de codigo de barra y qr, asi mismo permite almacenar  el historial de scaneo, con la opcion de enviar el mismo por correo electronico, es de destacar que para enviar la informacion por correo, primero la almacena en el dispositivo, mediante el plugin *FILE*

*IMPORTANTE:* para el momento de este proyecto, capacitor presenta un problema, por ende, se recomienda despues de ejecutar el npm install, ejecutar ejecutar:


- npm install --save jetifier

- npx jetify

- npx cap sync android

ionic build
ionic capacitor add android
ionic capacitor copy android

## Fuentes utiles

- *Plugin para escanear:* https://ionicframework.com/docs/native/barcode-scanner no se debe combinar varios plugin para escanear, ya que presentaria problemas

- *Pagina generador de QR online:* <https://www.qrcode.es/es/generador-qr-code/>

- *Plugin usado:* <https://ionicframework.com/docs/native/barcode-scanner>

## notas de instalacion

1. para este proyecto se uso https://ionicframework.com/docs/native/sqlite primero y despues se instalo https://ionicframework.com/docs/angular/storage, con esto almacena en el navegador en indexdDB del navegador y no en sqlweb


## Uso de mapbox

Este proyecto permite escanear multiples cosas, entre las que destacan los QR que lleven a mapas, para ello se empleo la *https://www.mapbox.com/* 

- para usar los mapas se instalo mediante cdm y no con npm, al entrar a la pagina debemos ir al dasborad https://account.mapbox.com/ alli seleccionar web, ya que con ionic funciona como pagina web, copiamos la cdn y la pegamos en nuestro index.html, luego presionamos next en la pagina de mapbox

- debemos crear en el html donde querempos que se muestre nuestro mapa, definir un div con id de 'map', dandole un alto y ancho de 100% con css

- en el componentes donde realizamos lo del mapa, declaramos *declare var mapboxgl:any;* y agregamos el metodo

  ngAfterViewInit() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zdWVwZXJlemYiLCJhIjoiY2trenJxc3BxMGVzMDJxbnkwMWlzbTJtcCJ9.4JqnC3t0oqZCp2mDkb4sKA';
      var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
      });
    }

- debemos definir que tipo de mapa usaremos. https://www.mapbox.com/install/js/cdn-complete/  https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/


- nota: en la codigo:  *map.on('load', function () {*, del metodo  *ngAfterViewInit()*, se recomienda se recomienda colocar map.resize(); para que coloque el mapa en el tamaño completo del telefono

-nota: en *map.on('load', function () {*, se recomienda quitar la palabra *function()* y en su lugar colocar una funcion anonima  * ()=>* para no perder relacion las variables de la clase que creamos. 

- para hacer los marker o marcadores en el mapa, se uso: https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/


## cambio en el boton regresar para salir del mapa
 se utilizo

1. text ' ': para que no mostrara contenido por default o algo asi,

2. icon="close-circle" : para cambiar el icon por default del boton back , y en su lugar colocar una 'x'

 <ion-back-button defaultHref="/tabs/tab2"
                   text=" "
                   class="boton-regresar"
                   icon="close-circle"></ion-back-button>
