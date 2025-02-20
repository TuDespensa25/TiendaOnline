window.addEventListener('scroll', () => {
    const productosSection = document.getElementById('productos');
    const botonFlotante = document.querySelector('.boton-flotante-categorias');
    if (productosSection.getBoundingClientRect().top <= window.innerHeight &&
        productosSection.getBoundingClientRect().bottom >= 0) {
      botonFlotante.style.display = 'block';
    } else {
      botonFlotante.style.display = 'none';
    }
  });
  