document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotalElement = document.getElementById('cart-subtotal');
  const cartTotalElement = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-btn');

  let cart = [];

  // FetchData
  async function fetchCartData() {
    try {
      loading.classList.remove('hidden');
      const response = await fetch(
        'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889'
      );
      const data = await response.json();
      // console.log(data);
      cart = data.items;
      renderCart();
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      loading.classList.add('hidden');
    }
  }
  // RenderItems
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const itemElement = document.createElement('tr');
      itemElement.innerHTML = `
                <tr class="cart-item">
                        <td><img src="${item.image}" alt="${
        item.product_title
      }" class="product-image"></td>
                        <td class="product">${item.product_title}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td><input type="number" value="${
                          item.quantity
                        }" min="1" class="quantity-input" id="quantity"></td>
                        <td id="subtotal">₹${itemSubtotal.toFixed(2)}</td>
                        <td><div data-index="${index}" class="remove-item"><img src="assets/image.png"</div></td>
                </tr>
          `;

      cartItemsContainer.appendChild(itemElement);
    });
    updateCartTotals();
    attachEventListeners();
  }

  function updateCartTotals() {
    let subtotal = 0;
    cart.forEach(
      (lineItem) => (subtotal += lineItem.price * lineItem.quantity)
    );

    cartSubtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    cartTotalElement.textContent = `₹${subtotal.toFixed(2)}`;
  }

  function handleQuantityChange(event, index) {
    const newQuantity = parseInt(event.target.value);

    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
      updateCartTotals();
    }
  }

  function handleRemoveItem(event) {
    console.log('first');
    const index = event.target.getAttribute('data-index');
    const confirmRemoval = confirm('remove this item?');
    if (confirmRemoval) {
      cart.splice(index, 1);
      renderCart();
    }
  }

  function attachEventListeners() {
    document.querySelectorAll('#quantity').forEach((input, index) => {
      // console.log(input)
      input.addEventListener('change', (e) => handleQuantityChange(e, index));
    });

    document.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', handleRemoveItem); 
    });
  }

  fetchCartData();
});
