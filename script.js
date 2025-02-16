window.addEventListener('scroll', () => {
    const productosSection = document.getElementById('productos'); // Obtiene la sección de productos
    const botonFlotante = document.querySelector('.boton-flotante-categorias'); // Obtiene el botón flotante

    // Verifica si la sección de productos está en la pantalla
    if (productosSection.getBoundingClientRect().top <= window.innerHeight && productosSection.getBoundingClientRect().bottom >= 0) {
        botonFlotante.style.display = 'block'; // Muestra el botón
    } else {
        botonFlotante.style.display = 'none'; // Oculta el botón
    }
});