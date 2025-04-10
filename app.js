"use strict";

// Tasa de cambio: 1 USD equivale a 340.0 CUP (ajusta según necesites)
const tasaCambio = 340.0;

// Ubicaciones disponibles
const ubicaciones = {
  provincias: {
    "Artemisa": {
      id: 1,
      municipios: {
        "Bahía Honda": 1,
        "San Cristóbal": 2,
        "Candelaria": 3,
        "Artemisa": 4,
        "Alquízar": 5,
        "Güira de Melena": 6,
        "San Antonio de los Baños": 7,
        "Bauta": 8,
        "Caimito": 9,
        "Guanajay": 10,
        "Mariel": 11,
      }
    },
    "Pinar Del Río": {
      id: 2,
      municipios: {
        "Los Palacios": 12,
        "Consolación": 13,
      }
    },
  },
  provinciaSeleccionada: null,
  municipioSeleccionado: null
};

// Función para mostrar el modal de selección de provincia
function mostrarModalProvincias() {
  const modal = document.createElement('div');
  modal.id = 'modal-provincias';
  modal.className = 'modal';
  modal.style.display = 'block';
  
  let options = '<option value="">Seleccione una provincia</option>';
  for (const provincia in ubicaciones.provincias) {
    options += `<option value="${provincia}">${provincia}</option>`;
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>Seleccione su provincia</h3>
      <select id="select-provincia" class="form-select">
        ${options}
      </select>
      <button id="confirmar-provincia" class="btn-confirmar">Confirmar</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Eventos para el modal de provincias
  document.getElementById('select-provincia').addEventListener('change', (e) => {
    ubicaciones.provinciaSeleccionada = e.target.value;
  });
  
  document.getElementById('confirmar-provincia').addEventListener('click', () => {
    if (ubicaciones.provinciaSeleccionada) {
      modal.style.display = 'none';
      mostrarModalMunicipios();
    } else {
      alert('Por favor seleccione una provincia');
    }
  });
  
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Función para mostrar el modal de selección de municipio
function mostrarModalMunicipios() {
  const modal = document.createElement('div');
  modal.id = 'modal-municipios';
  modal.className = 'modal';
  modal.style.display = 'block';
  
  const provincia = ubicaciones.provinciaSeleccionada;
  let options = '<option value="">Seleccione un municipio</option>';
  
  for (const municipio in ubicaciones.provincias[provincia].municipios) {
    const idMunicipio = ubicaciones.provincias[provincia].municipios[municipio];
    options += `<option value="${idMunicipio}">${municipio}</option>`;
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>Seleccione su municipio en ${provincia}</h3>
      <select id="select-municipio" class="form-select">
        ${options}
      </select>
      <button id="confirmar-municipio" class="btn-confirmar">Confirmar</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Eventos para el modal de municipios
  document.getElementById('select-municipio').addEventListener('change', (e) => {
    ubicaciones.municipioSeleccionado = parseInt(e.target.value);
  });
  
  
  document.getElementById('confirmar-municipio').addEventListener('click', () => {
    if (ubicaciones.municipioSeleccionado) {
      modal.style.display = 'none';
      localStorage.setItem('municipioSeleccionado', ubicaciones.municipioSeleccionado);
      renderizarProductos();
      renderizarOfertas();
      renderizarProductosRecientes();
      renderizarCombosTemporales(); 
    } else {
      alert('Por favor seleccione un municipio');
    }
  });
  
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Función para capturar el parámetro 'ref' (vendedor) de la URL y almacenarlo
function capturarVendedor() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) {
    localStorage.setItem("vendedor", ref);
  }
}

// Lista de productos (solo un ejemplo, añade el resto de tus productos siguiendo este formato)
const productos = [
  // Ejemplo de producto con atributo municipios
  
  {
    id: 1,
    nombre: " Carne de Res 2da Cat troceada ",
    precio: 14.40,
    imagen: "res.png",
    description: "Bolsa de 1 Kg ",
    categoria: "Alimentos/Cárnicos",
    reciente: 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 2,
    nombre: "Caja de Pollo",
    precio: 52,
    imagen: "pollocaja.png",
    description: "caja de 40 lb de muslo y contramuslo 4 paquetes de 10 lb",
    categoria: "Alimentos/Cárnicos",
     reciente: 0,
     descuento: 10,
     municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 3,
    nombre: "Paquete de pollo 10 lb ",
    precio: 13,
    imagen: "pollopqte.png",
    description: "paquete de 10 lb de muslo y contra muslo",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 4,
    nombre: "Lomo de cerdo deshuesado",
    precio: 12,
    imagen: "lomo.png",
    description: "Lomo de cerdo Importado sellado en bolsa de 4 lb ",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

  },
  /*{
    id: 5,
    nombre: "Masas de Cerdo",
    precio: 19,
    imagen: "masas.svg",
    description: "bolsa sellada al vacio de 4lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 6,
    nombre: "Bistec de cerdo",
    precio: 10.5,
    imagen: "bistec.svg",
    description: "Bandeja de bistec sellada al vacio 2.2 lb",
    categoria: "Alimentos/Cárnicos"
  },*/
  {
    id: 8,
    nombre: "Jamon vicky",
    precio: 9.20,
    imagen: "vicky.png",
    description: "Porción de 3  lb sellado al vacio ",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
 /* {
    id: 9,
    nombre: "Lomo ahumado",
    precio: 12,
    imagen: "ahumado.png",
    description: "porcionado y sellado en 2 lb ",
    categoria: "Alimentos/Cárnicos",
    descuento:10,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    
  },
  /*{
    id: 10,
    nombre: "Lomo Ahumado",
    precio: 8,
    imagen: "ahumado.svg",
    description: "bandeja sellada al vacio de 1.2 lb lasqueado",
    categoria: "Alimentos/Cárnicos"
  },*/                                                                                                          
  {
    id: 11,
    nombre: "Pechuga de pollo",
    precio: 18,
    imagen: "pechuga.png",
    description: "Paquete de 2 kg",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 12,
    nombre: "Jamón Embuchado",
    precio: 12.00,
    imagen: "embuchado.png",
    description: "Porción sellada de 3 Lb",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 13,
    nombre: "Picadillo de pollo",
    precio: 2.40,
    imagen: "picadillo.png",
    description: "unidad de 400 gr",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 14,
    nombre: "Salchichas",
    precio: 1.90,
    imagen: "perritos.png",
    description: "paquete de 12 unidades",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  /*{
    id: 15,
    nombre: "Chorizo Tipo vela",
    precio: 3.20,
    imagen: "vela.svg",
    description: "x lb porcion sellada segun pedido del cliente",
    categoria: "Alimentos/Cárnicos"
  },*/
  {
    id: 16,
    nombre: "Atún",
    precio: 13,
    imagen: "atun.png",
    description: "Lata de 1 Kg en aceite",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 101,
    nombre: "Hamburguesas Mixtas",
    precio: 2.3,
    imagen: "hamburguesas.png",
    description: "Bolsa de 5 Hamburguesas de 90 gr cada una", 
    categoria: "Alimentos/Cárnicos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  // Alimentos/Líquidos
  {
    id: 17,
    nombre: "Cerveza Cristal",
    precio: 22,
    imagen: "cristal.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 18,
    nombre: "Cerveza Bucanero",
    precio: 22,
    imagen: "bucanero.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 19,
    nombre: "Cerveza Economica",
    precio: 20,
    imagen: "timber.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 20,
    nombre: "Vino Acantus",
    precio: 5,
    imagen: "acantus.png",
    description: "Botella de vino rosado, tinto o Blanco",
    categoria: "Alimentos/Líquidos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 21,
    nombre: "Vino Espumoso",
    precio: 10,
    imagen: "espumoso.png",
    description: "botella de vino espumoso Varons d Valls 750 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 22,
    nombre: "Ron Habana Club",
    precio: 7.70,
    imagen: "3años.png",
    description: "Añejo 3 años 750 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 23,
    nombre: "Malta Guajira",
    precio: 6.50,
    imagen: "guajira.svg",
    description: "Blister de 6 uds de 500 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3,  12, 13]
  },
  {
    id: 24,
    nombre: "Jugo",
    precio: 14.40,
    imagen: "200ml.png",
    description: "Caja de 24 uds de 200 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 25,
    nombre: "Jugo",
    precio: 1.60,
    imagen: "naranja.png",
    description: "Jugo La estancia Sabor Naranja 1 L",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 26,
    nombre: "Jugo",
    precio: 6.50,
    imagen: "multifrutas.png",
    description: "Blister de 6 uds 330 ml Multifrutas de lata",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 27,
    nombre: "Malta Morena",
    precio: 18,
    imagen: "morena.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: 28,
    nombre: "Refresco",
    precio: 0.75,
    imagen: "refrescolata.png",
    description: "Lata 330 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 202,
    nombre: "Refresco Zuko",
    precio: 3.6,
    imagen: "zuko.png",
    description: "Caja de 8 sobres",
    categoria: "Alimentos/Líquidos",
    reciente:1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 29,
    nombre: "Refresco",
    precio: 1.90,
    imagen: "1.5lt.png",
    description: "Pomo de 2 Lt",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 30,
    nombre: "Café",
    precio: 5.5,
    imagen: "aroma.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 76,
    nombre: "Café Expreso ",
    precio: 5.5,
    imagen: "cafenezka.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ],
    reciente: 1, 
  },
  // Alimentos/Otros
  {
    id: 31,
    nombre: "pasta de tomate Sabrosísimo",
    precio: 3.50,
    imagen: "800gr.png",
    description: "Pasta doble concentrado 800 gr",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 32,
    nombre: "Pomo de Garbanzos Cocidos",
    precio: 2.20,
    imagen: "garbanzos.png",
    description: "Pomo de 540 gr",
    categoria: "Alimentos/Otros",
    reciente: 1, 
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,] 
  },
  {
    id: 33,
    nombre: "Mayonesa Celorio",
    precio: 6.50,
    imagen: "mayonesa.png",
    description: "Pomo de 450 gr",
    categoria: "Alimentos/Otros",
    reciente:0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 34,
    nombre: "Sazón Completo Nezka ",
    precio: 4.20,
    imagen: "sazonmixto.png",
    description: "Pomo de 250 gr",
    categoria: "Alimentos/Otros",
    reciente:1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 35,
    nombre: "Spaguetis",
    precio: 1.55,
    imagen: "spaguetis.png",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 36,
    nombre: "Codito",
    precio: 1.55,
    imagen: "codito.png",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 37,
    nombre: "Azucar Blanca",
    precio: 2,
    imagen: "azucar1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 38,
    nombre: "Frijol Negro ",
    precio: 8,
    imagen: "frijol5lb.png",
    description: "bolsa de 5 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 39,
    nombre: "Frijol Negro ",
    precio: 3.2,
    imagen: "frijol1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 40,
    nombre: "Frijol Colorado ",
    precio: 8,
    imagen: "colorados5lb.png",
    description: "bolsa de 5 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 41,
    nombre: "Sal Iodada ",
    precio: 0.5,
    imagen: "sal.png",
    description: "bolsa de 1 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 42,
    nombre: "Arroz Brasileño",
    precio: 2.2,
    imagen: "arroz1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 43,
    nombre: "Fideos",
    precio: 1.80,
    imagen: "fideos.png",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
 {
    id: 38,
    nombre: "Sopa Intantanea",
    precio: 0.70,
    imagen: "sopa.png",
    description: "Sabor pollo sobre 75 gr",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,],
    reciente: 1, 
  },
  {
    id: 44,
    nombre: "Zumo de Limón ",
    precio: 2.25,
    imagen: "zumo.png",
    description: "Botella de 1l",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,],
    reciente: 1
  },
  {
    id: 45,
    nombre: "Cartón de huevos",
    precio: 8.80,
    imagen: "huevo.png",
    description: "30 uds frescos 100 % orgánicos",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 201,
    nombre: "Gelatina ",
    precio: 1.10,
    imagen: "gelatina.png",
    description: "Bolsa de gelatina 75 gr ",
    categoria: "Alimentos/Otros",
    reciente:1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 74,
    nombre: "Mayonesa Nezka  ",
    precio: 3.20,
    imagen: "mayonezka.png",
    description: "pomo de 500  gr ",
    categoria: "Alimentos/Otros",
    reciente:1,
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  // Lácteos
  /*{
    id: 41,
    nombre: "Queso Gouda",
    precio: 13.5,
    imagen: "queso.png",
    description: "Porción de 1 kg sellado",
    categoria: "Alimentos/Lácteos"
  },*/
  {
    id: 42,
    nombre: "Yogurt Probiótico",
    precio: 15,
    imagen: "yogurt.png",
    description: "Cubeta de 4L",
    categoria: "Alimentos/Lácteos"
  },
 /* {
    id: 43,
    nombre: "Queso Crema",
    precio: 4.20,
    imagen: "crema.png",
    description: "Pote de 300 gr",
    categoria: "Alimentos/Lácteos"
  },*/
  {
    id: 404,
    nombre: "Helado",
    precio: 12,
    imagen: "helado.png",
    description: "Caja de 4L",
    categoria: "Alimentos/Lácteos",
    descuento: 10,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 100,
    nombre: "Leche en Polvo",
    precio: 10,
    imagen: "lechepolvo.png",
    description: "Bolsa de 1 kg",
    categoria: "Alimentos/Lácteos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 46,
    nombre: "Leche Condensada",
    precio: 1.90,
    imagen: "condensada.png",
    description: "Lata con abre fácil",
    categoria: "Alimentos/Lácteos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
 
  // Del Agro
  {
    id: 47,
    nombre: "Ajo",
    precio: 4.7,
    imagen: "ajo.png",
    description: "Bolsa de 10 cabezas",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 48,
    nombre: "Malanga",
    precio: 3,
    imagen: "malanga.png",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 49,
    nombre: "cebolla",
    precio: 3.30,
    imagen: "cebolla.png",
    description: "bolsa de 2.5 lb aproximadamente ",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 50,
    nombre: "Papas frescas",
    precio: 8.40,
    imagen: "papas.png",
    description: "Bolsa de 5 lb frescas",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    descuento: 55,
  },
 /*{
    id: 51,
    nombre: "Col",
    precio: 1.70,
    imagen: "col.svg",
    description: "bolsa con 1 unidad sellada",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 52,
    nombre: "Boniato",
    precio: 2.40,
    imagen: "boniato.svg",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro"
  },*/
  // Del Hogar
  {
    id: 53,
    nombre: "Frazada de limpiar suelo",
    precio: 2.4,
    imagen: "frazada.png",
    description: "2 unidad",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 54,
    nombre: "Detergente para ropa",
    precio: 5.2,
    imagen: "4en1.png",
    description: "Pomo de 1 L",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 55,
    nombre: "Detergente polvo Multiuso",
    precio: 2.4,
    imagen: "detergente.png",
    description: "bolsa de 500 gr",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 56,
    nombre: "Jabon De Olor",
    precio: 1.2,
    imagen: "jabon.png",
    description: "por unidades",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    descuento : 30, 
  },
  {
    id: 57,
    nombre: "Papel Higienico",
    precio: 2.2,
    imagen: "papel.png",
    description: "bolsa con 4 unidad sellada",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 58,
    nombre: "Perlas de olor para ropa",
    precio: 3.5,
    imagen: "perlas.png",
    description: "frasco de 200 gr",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 59,
    nombre: "Suavizante para ropa",
    precio: 6,
    imagen: "suavizante.png",
    description: "Pomo de 1 lt",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 60,
    nombre: "Toallitas humedas multiuso premiun",
    precio: 3.8,
    imagen: "toallas.png",
    description: "Paquete de 120 udst",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 61,
    nombre: "Pastillas de inodoro",
    precio: 2.40,
    imagen: "pastillas.png",
    description: "4 uds",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  // De Electrodomésticos
  {
    id: 62,
    nombre: "Ventilador de pedestal",
    precio: 60,
    imagen: "ventilador.png",
    description: "Ventilador tipo ciclón Milexus",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 63,
    nombre: "Split milexus",
    precio: 380,
    imagen: "split.png",
    description: "Milexus 1200 btu",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 64,
    nombre: "Frezeer",
    precio: 350,
    imagen: "nevera.png",
    description: "Milexus 5pies",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 65,
    nombre: "Tv de 32",
    precio: 260,
    imagen: "32.png",
    description: "Tv inteligente 32 pulgadas",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  /*{
    id: 66,
    nombre: "Tv de 55",
    precio: 450,
    imagen: "55.png",
    description: "Tv inteligente Milexus 55 pulgadas",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },*/
  {
    id: 67,
    nombre: "Batidora Milexus",
    precio: 45,
    imagen: "batidora.png",
    description: "Batidora 2 en 1 (+ moledor de sazones)",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 68,
    nombre: "Cefetera Milexus",
    precio: 45,
    imagen: "cafetera.png",
    description: "Cafetera Electrica de 6 tazas",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  // Del Confi
  {
    id: 69,
    nombre: "Galletas María 100 gr",
    precio: 1.25,
    imagen: "maria.png",
    description: "100 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 70,
    nombre: "Bolita de chocolate",
    precio: 3.20,
    imagen: "bolitas.png",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 71,
    nombre: "Best Chocolate",
    precio: 3.20,
    imagen: "conito.png",
    description: "Pomo de conitos 595 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: 72,
    nombre: "Galletas Saltine Nezka",
    precio: 3.00,
    imagen: "saltine.png",
    description: "Cajita de 454 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,]
  },
  {
    id: 73,
    nombre: "Galletas Soda",
    precio: 3.20,
    imagen: "soda.png",
    description: "Paquete de 8 uds",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: 73,
    nombre: "Galletas Soda",
    precio: 3.20,
    imagen: "soda.png",
    description: "Paquete de 8 uds",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11]
  },
  
];
// Combos temporales (justo después de la lista de productos existente)
const combosTemporales = [
  {
    id: 1001,
    nombre: "Combo Adulto Mayor",
    precio: 34.99,
    imagen: "combo1.png",
    description: "Incluye 12 Jugos de 200 ml, 10 jabones de baño, 3 Gelatinas, 5 Fideos, 6 Malta, 2 lecshes Condensada",
    categoria: "Combos Temporales",
    reciente: 0,
        descuento: 15,
    tiempoLimite: 1, // Horas de duración
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 1002,
    nombre: "Combo De Granos",
    precio: 18.50,
    imagen: "combo2.png",
    description: "Incluye 11 Lb de Arroz Brasileño, 3 Lb de Frijol Negro , 2 Lb de frijol Colorados ",
    categoria: "Combos Temporales",
    reciente: 1,
    descuento: 0,
    tiempoLimite: 72,
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13 ]
  }
];

// Agregar al final del array de productos (busca: const productos = [...])
productos.push(...combosTemporales);
// Función para renderizar combos temporales
function renderizarCombosTemporales() {
  const combosContainer = document.getElementById("combos-temporales-container");
  if (!combosContainer) return;

  // 🔥 NO filtramos por municipio, solo por categoría
  const combosFiltrados = productos.filter(p => p.categoria === "Combos Temporales");

  // Ocultar o mostrar sección de combos según si hay resultados
  const seccionCombos = document.getElementById("combos-temporales");
  if (!seccionCombos) return;

  if (combosFiltrados.length === 0) {
    seccionCombos.style.display = "none";
    return;
  } else {
    seccionCombos.style.display = "block";
  }

  // Renderizar combos
  const fragment = document.createDocumentFragment();

  combosFiltrados.forEach(combo => {
    const div = document.createElement("div");
    div.className = "producto combo-temporal";
    div.dataset.id = combo.id;

    // Cálculo del precio con o sin descuento
    const tieneDescuento = combo.descuento && combo.descuento > 0;
    const precioConDescuento = tieneDescuento
      ? (combo.precio * (1 - combo.descuento / 100)).toFixed(2)
      : combo.precio.toFixed(2);

    // Temporizador por combo
    let fechaLimite;
    const storageKey = `combo_tiempo_${combo.id}`;
    const fechaGuardada = localStorage.getItem(storageKey);

    if (fechaGuardada) {
      fechaLimite = new Date(parseInt(fechaGuardada));
    } else {
      fechaLimite = new Date();
      fechaLimite.setHours(fechaLimite.getHours() + combo.tiempoLimite);
      localStorage.setItem(storageKey, fechaLimite.getTime());
    }

    // Estructura HTML del combo
    div.innerHTML = `
      <div class="img-container">
        <img src="images/${combo.imagen}" alt="${combo.nombre}" loading="lazy">
        ${tieneDescuento ? `<div class="discount-label">-${combo.descuento}%</div>` : ""}
        <div class="time-label">⏳ Oferta limitada</div>
      </div>
      <div class="etiqueta-categoria Combos-Temporales">${combo.categoria}</div>
      <h3>${combo.nombre}</h3>
      ${tieneDescuento ? `<p class="precio-original">USD ${combo.precio.toFixed(2)}</p>` : ""}
      <p class="precio-nuevo">USD ${precioConDescuento}</p>
      <div class="combo-timer" data-fechalimite="${fechaLimite.getTime()}">
        <p>Tiempo restante:</p>
        <div class="timer">
          <span class="days">00</span>d : 
          <span class="hours">00</span>h : 
          <span class="minutes">00</span>m : 
          <span class="seconds">00</span>s
        </div>
      </div>
      <button data-id="${combo.id}" class="btn-agregar">Agregar al carrito</button>
    `;

    fragment.appendChild(div);
  });

  combosContainer.innerHTML = "";
  combosContainer.appendChild(fragment);

  iniciarContadoresTemporales();
}

// Función para activar los temporizadores de los combos
function iniciarContadoresTemporales() {
  document.querySelectorAll('.combo-timer').forEach(timer => {
    const fechaLimite = parseInt(timer.dataset.fechalimite);
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const tiempoRestante = fechaLimite - ahora;

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        const boton = timer.closest('.combo-temporal')?.querySelector('.btn-agregar');
        if (boton) boton.disabled = true;
        timer.innerHTML = `<p style="color:red; font-weight:bold;">⏳ Tiempo agotado</p>`;
        return;
      }

      const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
      const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

      timer.querySelector('.days').textContent = dias.toString().padStart(2, '0');
      timer.querySelector('.hours').textContent = horas.toString().padStart(2, '0');
      timer.querySelector('.minutes').textContent = minutos.toString().padStart(2, '0');
      timer.querySelector('.seconds').textContent = segundos.toString().padStart(2, '0');
    }, 1000);
  });
}



// Variables globales y caching de elementos
let carrito = [];
const productosContainer = document.getElementById("productos-container");
const contadorCarritoElem = document.getElementById("contador-carrito");

// Función que retorna el total en USD (sin conversión)
function calcularTotalUSD() {
  return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
}

/**
 * RENDERIZAR PRODUCTOS
 * - Muestra el nombre, la categoría y la imagen.
 * - Si tiene descuento, se muestra el precio original TACHADO y el precio nuevo.
 * - Filtra por municipio seleccionado
 */
function renderizarProductos(categoria = "todas") {
  if (!productosContainer) return;
  
  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  const fragment = document.createDocumentFragment();
  
  let filtrados = categoria === "todas" 
    ? productos 
    : productos.filter(p => p.categoria === categoria);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    filtrados = filtrados.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    div.dataset.categoria = prod.categoria;
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    if (prod.categoria === "Servicios") {
      div.innerHTML = `
        <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
        <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        <h3>${prod.nombre}</h3>
        <a href="https://wa.me/5353933247?text=${encodeURIComponent("Me interesa una cotización para " + prod.nombre)}" 
           target="_blank" class="btn-cotizacion">Cotización del Servicio</a>
      `;
    } else {
      if (prod.descuento && prod.descuento > 0) {
        const descuento = prod.descuento;
        const precioOriginal = prod.precio;
        const precioNuevo = precioOriginal * (1 - descuento / 100);
        div.innerHTML = `
          <div class="img-container">
              <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
              <div class="discount-label">Descuento ${descuento}%</div>
          </div>
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <h3>${prod.nombre}</h3>
          <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
          <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      } else {
        div.innerHTML = `
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <h3>${prod.nombre}</h3>
          <p class="precio-nuevo">USD ${prod.precio.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      }
    }
    fragment.appendChild(div);
  });
  productosContainer.innerHTML = "";
  productosContainer.appendChild(fragment);
}

// Renderiza la sección de ofertas con filtro por municipio
function renderizarOfertas() {
  const ofertasContainer = document.querySelector(".ofertas-container");
  if (!ofertasContainer) return;
  
  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  let ofertas = productos.filter(p => p.descuento && p.descuento > 0);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    ofertas = ofertas.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  const fragment = document.createDocumentFragment();

  ofertas.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    const descuento = prod.descuento;
    const precioOriginal = prod.precio;
    const precioNuevo = precioOriginal * (1 - descuento / 100);
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    div.innerHTML = `
      <div class="img-container">
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <div class="discount-label">Descuento ${descuento}%</div>
      </div>
      <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
      <h3>${prod.nombre}</h3>
      <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
      <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  ofertasContainer.innerHTML = "";
  ofertasContainer.appendChild(fragment);
}

// Renderiza productos recientes con filtro por municipio
function renderizarProductosRecientes() {
  const productosRecientesContainer = document.querySelector(
    "#productos-recientes .productos-recientes-container"
  );
  if (!productosRecientesContainer) return;

  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  let productosRecientes = productos.filter((p) => p.reciente === 1);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    productosRecientes = productosRecientes.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  const fragment = document.createDocumentFragment();

  productosRecientes.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, "-");

    div.innerHTML = `
      <div class="img-container">
        <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      </div>
      <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
      <h3>${prod.nombre}</h3>
      <p class="precio">USD ${prod.precio.toFixed(2)}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  productosRecientesContainer.innerHTML = "";
  productosRecientesContainer.appendChild(fragment);
}

// Agrega producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  let precioCarrito = producto.precio;
  if (producto.descuento && producto.descuento > 0) {
    precioCarrito = producto.precio * (1 - producto.descuento / 100);
  }
  const enCarrito = carrito.find(p => p.id === id);
  if (enCarrito) {
    enCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, precio: precioCarrito, cantidad: 1 });
  }
  mostrarMensaje(`¡${producto.nombre} agregado al carrito!`);
  actualizarContadorCarrito();
  guardarCarritoEnLocalStorage();
}

// Muestra mensaje emergente
function mostrarMensaje(msg) {
  const mensajeElem = document.createElement("div");
  mensajeElem.className = "mensaje-carrito";
  mensajeElem.textContent = msg;
  document.body.appendChild(mensajeElem);
  setTimeout(() => mensajeElem.remove(), 2000);
}

// Actualiza el contador del carrito
function actualizarContadorCarrito() {
  const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  if (contadorCarritoElem) contadorCarritoElem.textContent = total;
}

// Guarda y carga el carrito desde localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado) || [];
    actualizarContadorCarrito();
  }
}

// Renderiza el carrito en cart.html
function renderizarCarrito() {
  const itemsCarrito = document.getElementById("items-carrito");
  if (!itemsCarrito) return;
  itemsCarrito.innerHTML = "";
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    const totalElem = document.getElementById("total-pedido");
    if (totalElem) totalElem.textContent = "USD 0.00";
    return;
  }
  const totalUSD = calcularTotalUSD();
  carrito.forEach(prod => {
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="images/${prod.imagen}" alt="${prod.nombre}">
      <div class="item-info">
          <h4>${prod.nombre}</h4>
          <p>USD ${prod.precio.toFixed(2)} x ${prod.cantidad}</p>
      </div>
      <div class="contador-cantidad">
          <button class="btn-cambiar" data-id="${prod.id}" data-delta="-1">-</button>
          <input type="text" value="${prod.cantidad}" disabled>
          <button class="btn-cambiar" data-id="${prod.id}" data-delta="1">+</button>
      </div>
      <button class="eliminar-item" data-id="${prod.id}">🗑️</button>
    `;
    itemsCarrito.appendChild(div);
  });
  const totalElem = document.getElementById("total-pedido");
  let totalTexto;
  const metodoSelect = document.getElementById("metodo-pago");
  if (metodoSelect && metodoSelect.value.indexOf("CUP") !== -1) {
    const totalCUP = totalUSD * tasaCambio;
    totalTexto = 'CUP ' + totalCUP.toFixed(2);
  } else {
    totalTexto = 'USD ' + totalUSD.toFixed(2);
  }
  if (totalElem) totalElem.textContent = totalTexto;
}

// Cambia la cantidad de un producto en el carrito
function cambiarCantidad(id, delta) {
  const prod = carrito.find(p => p.id === id);
  if (!prod) return;
  prod.cantidad += delta;
  if (prod.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Elimina un producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Redirige a index.html
function redirigirAPaginaPrincipal() {
  window.location.href = "index.html";
}

function validarFormulario() {
  const nombreComprador = document.getElementById("nombre-comprador").value;
  const emailComprador = document.getElementById("email-comprador").value;
  const telefonoComprador = document.getElementById("telefono-comprador").value;
  const direccionEntrega = document.getElementById("direccion-entrega").value;

  if (!nombreComprador || !emailComprador || !telefonoComprador || !direccionEntrega) {
    alert("Por favor, complete todos los campos obligatorios.");
    return false;
  }

  // Validación del número de teléfono (WhatsApp)
  if (!/^\d{8,10}$/.test(telefonoComprador)) {
    alert("El número de teléfono no es válido. Debe tener 8 o 9 o 10 dígitos.");
    return false;
  }

  // Validación del correo electrónico (opcional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailComprador)) {
    alert("El correo electrónico no es válido.");
    return false;
  }

  return true;
}

// Envía el pedido por WhatsApp y vacía el carrito con el formato solicitado
function enviarPedidoPorWhatsapp() {
  if (!validarFormulario()) {
    return; // Detener si la validación falla
  }

  const nombreComprador = document.getElementById("nombre-comprador").value;
  const emailComprador = document.getElementById("email-comprador").value;
  const telefonoComprador = document.getElementById("telefono-comprador").value;
  const direccionEntrega = document.getElementById("direccion-entrega").value;
  const nota = document.getElementById("nota").value;
  const nombreBeneficiario = document.getElementById("nombre-beneficiario").value;
  const telefonoBeneficiario = document.getElementById("telefono-beneficiario").value;
  const metodoPago = document.getElementById("metodo-pago").value;
  const totalUSD = calcularTotalUSD();

  let totalMensaje;
  let moneda;
  if (metodoPago.indexOf("CUP") !== -1) {
    totalMensaje = totalUSD * tasaCambio;
    moneda = "CUP";
  } else {
    totalMensaje = totalUSD;
    moneda = "USD";
  }
  const totalTexto = totalMensaje.toFixed(2) + " " + moneda;

  let mensaje = `Nuevo Pedido\n\n`;
  mensaje += `Datos del Comprador:\n\n`;
  mensaje += `• Nombre: ${nombreComprador}\n`;
  mensaje += `• Email: ${emailComprador}\n`;
  mensaje += `• Teléfono: ${telefonoComprador}\n\n`;

  if (nombreBeneficiario && telefonoBeneficiario) {
    mensaje += `Datos del Beneficiario:\n\n`;
    mensaje += `• Nombre: ${nombreBeneficiario}\n`;
    mensaje += `• Teléfono: ${telefonoBeneficiario}\n\n`;
  }

  mensaje += `Información de Envío:\n\n`;
  mensaje += `• Dirección: ${direccionEntrega}\n`;
  if (nota) {
    mensaje += `• Nota: ${nota}\n`;
  }
  mensaje += `• Método de Pago: ${metodoPago}\n\n`;

  // Incluir el vendedor si existe
  const vendedor = localStorage.getItem("vendedor");
  if (vendedor) {
    mensaje += `Vendedor: ${vendedor}\n\n`;
  }

  mensaje += `Información de Pago:\n`;
  mensaje += `Total a pagar: ${totalTexto}\n`;
  mensaje += `Por favor en minutos recibirá la cuenta a transferir realice la transferencia y envíe el comprobante por este medio.\n\n`;
  mensaje += `Productos:\n\n`;
  carrito.forEach(prod => {
    let productTotal = prod.cantidad * prod.precio;
    if (moneda === "CUP") {
      productTotal *= tasaCambio;
    }
    mensaje += `• ${prod.cantidad}x ${prod.nombre} - ${productTotal.toFixed(2)} ${moneda}\n`;
  });
  mensaje += `\nTotal a Pagar: ${totalTexto} de 24 a 48 horas pedido completado, Siempre trataremos q sea en el día`;

  try {
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://wa.me/5353933247?text=${mensajeCodificado}`;
    window.open(urlWhatsapp, "_blank");
    alert("¡Pedido enviado correctamente! Gracias por su compra.");
    cerrarModalPedido();
    vaciarCarrito();
    limpiarFormulario();
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Hubo un error al procesar su pedido. Por favor, intente de nuevo.");
  }
}

function limpiarFormulario() {
  document.getElementById("nombre-comprador").value = "";
  document.getElementById("email-comprador").value = "";
  document.getElementById("telefono-comprador").value = "";
  document.getElementById("direccion-entrega").value = "";
  document.getElementById("nombre-beneficiario").value = "";
  document.getElementById("telefono-beneficiario").value = "";
  if (document.getElementById("nota")) {
    document.getElementById("nota").value = "";
  }
}

// Vacía el carrito y actualiza la interfaz y el localStorage
function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
  }
}

// Cierra el modal de pedido
function cerrarModalPedido() {
  const modal = document.getElementById("modal-pedido");
  if (modal) modal.style.display = "none";
}

// Modal para mostrar descripción del producto
function mostrarDescripcionProducto(producto) {
  const modal = document.getElementById("modal-descripcion");
  if (!modal) return;
  const modalNombre = modal.querySelector(".modal-nombre");
  const modalDescripcion = modal.querySelector(".modal-descripcion");
  modalNombre.textContent = producto.nombre;
  modalDescripcion.textContent = producto.description;
  modal.style.display = "block";
}

// Event delegation
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-agregar")) {
    const id = parseInt(e.target.dataset.id, 10);
    agregarAlCarrito(id);
    return;
  }
  const productoDiv = e.target.closest(".producto");
  if (productoDiv) {
    const prodId = parseInt(productoDiv.dataset.id, 10);
    const producto = productos.find((p) => p.id === prodId);
    if (producto) {
      mostrarDescripcionProducto(producto);
    }
  }
  if (e.target.matches(".btn-cambiar")) {
    const id = parseInt(e.target.dataset.id, 10);
    const delta = parseInt(e.target.dataset.delta, 10);
    cambiarCantidad(id, delta);
  }
  if (e.target.matches(".eliminar-item")) {
    const id = parseInt(e.target.dataset.id, 10);
    eliminarDelCarrito(id);
  }
  if (e.target.matches("#seguir-comprando")) {
    redirigirAPaginaPrincipal();
  }
  if (e.target.matches(".cerrar-modal")) {
    cerrarModalPedido();
  }
});

const modalDescripcionClose = document.querySelector("#modal-descripcion .close");
if (modalDescripcionClose) {
  modalDescripcionClose.addEventListener("click", () => {
    const modal = document.getElementById("modal-descripcion");
    if (modal) modal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-descripcion");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

function actualizarTotalSegunMetodo() {
  renderizarCarrito();
}

window.addEventListener("click", (e) => {
  const modalPedido = document.getElementById("modal-pedido");
  if (modalPedido && e.target === modalPedido) {
    cerrarModalPedido();
  }
});

function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    })
    .then(() => console.log("Página compartida exitosamente"))
    .catch((error) => console.error("Error al compartir:", error));
  } else {
    alert("La función de compartir no es soportada en este navegador.");
  }
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar los modales de ubicación en cada carga de página
  mostrarModalProvincias();
  // Capturar el vendedor desde la URL y guardarlo
  capturarVendedor();

  cargarCarritoDesdeLocalStorage();
  if (productosContainer) {
    renderizarProductos();
    const filtros = document.querySelectorAll(".filtro-btn");
    filtros.forEach(btn => {
      btn.addEventListener("click", () => {
        filtros.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderizarProductos(btn.dataset.categoria);
      });
    });
    renderizarOfertas();
  }
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
    const btnWhatsapp = document.getElementById("pedir-whatsapp");
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("modal-pedido").style.display = "block";
      });
    }
    const formularioPedido = document.getElementById("formulario-pedido");
    if (formularioPedido) {
      formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validarFormulario()) {
          enviarPedidoPorWhatsapp();
        }
      });
    }
    const metodoSelect = document.getElementById("metodo-pago");
    if (metodoSelect) {
      metodoSelect.addEventListener("change", actualizarTotalSegunMetodo);
    }
  }
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      if (!/^\d*$/.test(telefonoInput.value)) {
        telefonoInput.setCustomValidity("Solo se permiten números.");
      } else {
        telefonoInput.setCustomValidity("");
      }
    });
  }
});

// Inicializar las secciones
renderizarCombosTemporales(); 
renderizarOfertas();
renderizarProductosRecientes();