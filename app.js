// Base de Datos de Productos
const products = [
    {
        id: 1,
        category: 'electrodomesticos',
        name: 'Licuadora Profesional',
        description: 'Potencia 1000W con 5 velocidades',
        price: 89.99,
        image: 'images/licuadora.jpg'
    },
    {
        id: 2,
        category: 'alimentos',
        name: 'Aceite de Oliva Extra Virgen',
        description: '500ml - Origen España',
        price: 12.50,
        image: 'images/aceite.jpg'
    },
    {
        id: 3,
        category: 'aseo',
        name: 'Detergente Líquido',
        description: 'Envase 3L - Fragancia limón',
        price: 8.75,
        image: 'images/detergente.jpg'
    }
];

// Sistema de Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Renderizar Productos
function renderProducts(category = 'todas') {
    const container = document.getElementById('productos');
    container.innerHTML = '';
    
    const filteredProducts = category === 'todas' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'producto';
        productEl.innerHTML = `
            <div class="etiqueta-categoria ${product.category}">
                ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="precio">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">🛒 Agregar</button>
        `;
        container.appendChild(productEl);
    });
}

// Filtrado
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.categoria);
    });
});

// Carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCounter();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCounter() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (document.getElementById('contador-carrito')) {
        document.getElementById('contador-carrito').textContent = count;
    }
}

// Envío por WhatsApp (Para cart.html)
function setupCartPage() {
    if (window.location.pathname.includes('cart.html')) {
        const itemsContainer = document.getElementById('items-carrito');
        const totalElement = document.getElementById('total-pedido');
        
        function renderCart() {
            itemsContainer.innerHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'item-carrito';
                itemEl.innerHTML = `
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div>
                        <input type="number" value="${item.quantity}" 
                               min="1" 
                               onchange="updateQuantity(${index}, this.value)">
                        <button onclick="removeItem(${index})">🗑️</button>
                    </div>
                `;
                itemsContainer.appendChild(itemEl);
            });
            
            totalElement.textContent = total.toFixed(2);
        }
        
        window.updateQuantity = (index, value) => {
            cart[index].quantity = parseInt(value);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
        
        window.removeItem = (index) => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
        
        document.getElementById('pedir-whatsapp').addEventListener('click', () => {
            const message = `¡Hola! Quiero realizar este pedido:%0A%0A` +
                cart.map(item => 
                    `*${item.name}*%0A` +
                    `Cantidad: ${item.quantity}%0A` +
                    `Precio unitario: $${item.price.toFixed(2)}%0A` +
                    `Subtotal: $${(item.price * item.quantity).toFixed(2)}`
                ).join('%0A%0A') +
                `%0A%0A*Total: $${totalElement.textContent}*`;
            
            window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
        });
        
        renderCart();
    }
}

// Inicialización
if (document.getElementById('productos')) {
    renderProducts();
    updateCartCounter();
}
setupCartPage();