
let categories = {
  'shirt': '#shirts',
  'formal shirt': '#formal-shirts',
  'polo': '#mk-polo', 
  'china polo': '#china-polo', 
  'jacket': '#padding-jacket', 
  'double pocket shirts': '#double_pocket_shirts',
  'jersey': 'jersey',
  'trouser': 'trouser',
  'joggers': 'trouser'
};



// Search product

let inputArea = document.querySelector('.input-area')
let searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  let searchQuery = inputArea.value.trim().toLowerCase();

  // Check if the search query matches a category
  if (categories[searchQuery]) {
      // Scroll to the respective category section
      document.querySelector(categories[searchQuery]).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
      });

      inputArea.placeholder = 'Search for a category...';
  } else {
      inputArea.placeholder = 'Category not found';
  }

  inputArea.value = '';
});

// Function to handle cart
  document.querySelector('.cart-icon').addEventListener('click',()=>{
    let cartBody = document.querySelector('.cart-body');
    cartBody.classList.toggle('d-none');
  });

// Function to update the cart UI
function updateCart() {
  const cartList = document.querySelector('.cart-list');
  const totalPriceElement = document.querySelector('.total-price');
  const emptyMsg = document.querySelector('.empty-msg');
  const cartFill = document.querySelector('.cart-fill');
  let cartNum = document.querySelector('.cart-num');
  
  // Clear the current cart list
  cartList.innerHTML = '';
  if (cart.length === 0) {
    emptyMsg.classList.remove('d-none');
    cartFill.classList.add('d-none');
    cartNum.classList.add('d-none');
    document.querySelectorAll('.active').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.innerHTML = `Add To Cart`;
    });

    let confirmCart = document.querySelector('.confirm-cart');
    confirmCart.classList.add('slide-bottom');
    setTimeout(() => {
      confirmCart.classList.add('d-none');
    }, 600);
    return; 
  }

  // If cart has items, show the cart details and hide the empty message
  emptyMsg.classList.add('d-none');
  cartFill.classList.remove('d-none');
  cartNum.classList.remove('d-none');

  let totalPrice = 0;
  let totalQuantity = 0;

  // Populate the cart list
  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    totalQuantity += item.quantity;
  
    const cartItem = document.createElement('li');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <div class="cart-item-content d-flex align-items-center">
        <div class="cart-item-img me-3">
          <img src="${item.image}" class="img-fluid" alt="${item.name}">
        </div>
        <div class="cart-detail d-flex flex-column flex-grow-1">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price * item.quantity}tk</div>
        </div>
      </div>
      <div class="cart-item-rmv-btn"><i class="bi bi-x" data-index="${index}"></i></div>
    `;

    cartList.appendChild(cartItem);
  });

  // Update total price and quantity
  totalPriceElement.textContent = `${totalPrice}tk`;
  cartNum.textContent = totalQuantity;

  // Add event listeners to remove buttons
  document.querySelectorAll('.cart-item-rmv-btn i').forEach((removeBtn) => {
    removeBtn.addEventListener('click', () => {
        const cartItem = removeBtn.closest('.cart-item');
        const itemName = cartItem.querySelector('.cart-item-name').textContent.trim();
        cartItem.classList.add('remove');

       
        cartItem.addEventListener('transitionend', () => {
            cartItem.remove();

            // Remove from cart array
            const itemIndex = cart.findIndex(item => item.name === itemName);
            if (itemIndex !== -1) {
                cart.splice(itemIndex, 1);
            }

            // Update mini cart UI
            updateCart();
            updateConfirmCart();

            // Remove from the confirm cart
            document.querySelectorAll('.confirm-item').forEach((confirmItem) => {
                let confirmItemName = confirmItem.querySelector('.item-name')?.textContent.trim();
                if (confirmItemName === itemName) {
                    confirmItem.remove();
                }
            });
            document.querySelectorAll('.product-item').forEach((productItem) => {
              let productItemName = productItem.querySelector('.product-name')?.textContent.trim();
              if (productItemName === itemName) {
                productItem.classList.remove('active');
                let btn = productItem.querySelector('.add-btn');
                if (btn) {
                  btn.classList.remove('active');
                  btn.innerHTML = 'Add To Cart';
                }
              }
            });
        });
    });
});

}


// add to cart 
let cart = []; 

document.querySelectorAll('.add-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const productItem = button.closest('.product-item');
    if (!productItem) return; // Exit if not found

    const productName = productItem.querySelector('.product-name').textContent.trim();
    const productPrice = productItem.querySelector('.new-price').textContent.trim();
    const productImage = productItem.querySelector('.product-img img').src;


    // If button is not active, initialize quantity controls
    if (!button.classList.contains('active')) {
      button.classList.add('active');
      productItem.classList.add('active');

      cart.push({
        name: productName,
        price: parseFloat(productPrice.replace('tk', '')), 
        image: productImage,
        quantity: 1, 
      });
      button.innerHTML = `
        <div class="quantity-controls">
          <span class="decrement">-</span>
          <span class="item-quantity">1</span> 
          <span class="increment">+</span>
        </div>`;

      updateCart();
      updateConfirmCart();
      const itemQuantity = button.querySelector('.item-quantity');
      const increment = button.querySelector('.increment');
      const decrement = button.querySelector('.decrement');

      // Increment quantity
      increment.addEventListener('click', () => {
        let currentQuantity = parseInt(itemQuantity.textContent);
        itemQuantity.textContent = currentQuantity + 1;

        // Update cart data
        updateCartQuantity(productName, currentQuantity + 1);
      });

      // Decrement quantity
      decrement.addEventListener('click', () => {
        let currentQuantity = parseInt(itemQuantity.textContent);
        currentQuantity -= 1;
        console.log(currentQuantity);
        
        if (currentQuantity == 0) {
          button.classList.remove('active');
          productItem.classList.remove('active');
          button.innerHTML = `Add To Cart`;
          // Remove product from cart
          removeProductFromCart(productName);
          
          
        } else{
          itemQuantity.textContent = currentQuantity; 
      
          // Update the cart data
          updateCartQuantity(productName, currentQuantity);
        }
      });
      
    }
  });
});

function updateCartQuantity(productName, newQuantity) {
 
  const cartItem = cart.find(item => item.name === productName);
  if (cartItem) {
    cartItem.quantity = newQuantity;
  }
  updateCart(); 
  updateConfirmCart();
}

function removeProductFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  updateCart(); 
  updateConfirmCart();
}




// Function to handle cart
let cartBtn = document.querySelector('.cart-btn');
cartBtn.addEventListener('click', () => {
  let checkoutForm = document.querySelector('.checkout-form');
  checkoutForm.classList.add('slide-bottom');

  let confirmCart = document.querySelector('.confirm-cart');
  confirmCart.classList.remove('d-none', 'slide-up', 'slide-up-2', 'slide-bottom');
  confirmCart.classList.add('slide-up');

  updateConfirmCart(); 
});



function updateConfirmCart() {
  let confirmCart2 = document.querySelector('.confirm-cart-2');
  let confirmBody = confirmCart2.querySelector('.confirm-body');
  let emptyCartMsg = document.querySelector('.empty-cart-message');

  let confirmCarts = document.querySelectorAll('.confirm-cart, .confirm-cart-2');

  confirmCarts.forEach(confirmCart => {
      let confirmContent = confirmCart.querySelector('.confirm-content');
      if (!confirmContent) return;
      confirmContent.innerHTML = ''; 

      if (cart.length > 0) {
          confirmBody.classList.remove('d-none');  
          emptyCartMsg.classList.add('d-none');  
      } else {
          confirmBody.classList.add('d-none');  
          emptyCartMsg.classList.remove('d-none');  
      }

      cart.forEach((item, index) => {
          let cartItem = document.createElement('div');
          cartItem.classList.add('confirm-item', 'position-relative', 'd-flex', 'align-items-center');

          cartItem.innerHTML = `
              <img src="${item.image}" class="img-fluid confirm-img" alt="${item.name}">
              <div class="cart-item-detail">
                  <div class="item-name">${item.name}</div>
                  <div class="confirm-item-quantity d-flex justify-content-between align-items-center">
                      <div class="item-quantity-price">
                          <span class="quantity">${item.quantity}x</span>
                          <span class="price">@${item.price}tk</span>
                      </div>
                      <div class="confirm-total-price">
                          <span>${(item.quantity * item.price)}tk</span>
                      </div>
                      <span class="remove-btn"><i class="bi bi-x" data-index="${index}"></i></span>
                  </div>
              </div>
          `;

          confirmContent.appendChild(cartItem);
      });

      // Update total order price
      let completeOrder = confirmCart.querySelector('.complete-order h4');
      let completePrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);
      completeOrder.textContent = `${completePrice}tk`;

      // Add event listeners for remove buttons
      confirmContent.querySelectorAll('.remove-btn i').forEach(removeBtn => {
          removeBtn.addEventListener('click', (e) => {
              let parentItem = e.target.closest('.confirm-item');
              let itemName = parentItem.querySelector('.item-name').textContent.trim();

              parentItem.classList.add('remove');
              parentItem.addEventListener('transitionend', () => {
                  parentItem.remove();

                  // Remove item from cart array
                  const itemIndex = cart.findIndex(item => item.name === itemName);
                  if (itemIndex !== -1) {
                      cart.splice(itemIndex, 1);
                  }

                  updateCart();
                  updateConfirmCart();
                  
                  document.querySelectorAll('.product-item').forEach((productItem) => {
                    let productItemName = productItem.querySelector('.product-name')?.textContent.trim();
                    if (productItemName === itemName) {
                      productItem.classList.remove('active');
                      let btn = productItem.querySelector('.add-btn');
                      if (btn) {
                        btn.classList.remove('active');
                        btn.innerHTML = 'Add To Cart';
                      }
                    }
                  });

                  // If cart is empty, hide confirm-cart 
                  let confirmCart = document.querySelector('.confirm-cart');
                  if (cart.length === 0) {
                      confirmCart.classList.add('slide-bottom');
                      setTimeout(() => confirmCart.classList.add('d-none'), 600);

                      confirmBody.classList.add('d-none');  // Hide confirm body
                      emptyCartMsg.classList.remove('d-none');  // Show empty cart message

                      // Reset buttons
                      document.querySelectorAll('.product-item').forEach(item => item.classList.remove('active'));
                      document.querySelectorAll('.add-btn').forEach(btn => {
                          btn.classList.remove('active');
                          btn.innerHTML = 'Add To Cart';
                      });
                  }
              }, { once: true });
          });
      });
  });
}




// Function to handle confirm back btn
document.querySelector('#confirm-back-btn').addEventListener('click', (e) => {
  e.preventDefault(); 
  let confirmCart = document.querySelector('.confirm-cart');
  confirmCart.classList.remove('slide-up', 'd-none', 'slide-bottom');
  confirmCart.classList.add('slide-up-2');
  setTimeout(() => {
    confirmCart.classList.add('d-none');
  }, 600);
});

// Function to handle checkout form  back btn
document.querySelector('#checkout-back-btn').addEventListener('click', (e) => {
  e.preventDefault(); 
  let checkoutForm = document.querySelector('.checkout-form');
  checkoutForm.classList.remove('slide-up', 'd-none', 'slide-bottom');
  checkoutForm.classList.add('slide-up-2');
  setTimeout(() => {
   checkoutForm.classList.add('d-none');
 }, 600);
 
});



// Function to handle checkout form
let checkoutBtn = document.querySelectorAll('.checkout-btn');

checkoutBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    let confirmCart = document.querySelector('.confirm-cart');
    confirmCart.classList.add('slide-bottom');
    let checkoutForm = document.querySelector('.checkout-form');
    checkoutForm.classList.remove('slide-up', 'slide-bottom', 'slide-up-2', 'd-none');
    checkoutForm.classList.add('slide-up');
  });
});


// function to handle cancel
document.querySelector('.cancel-btn').addEventListener('click', (e) => {
  e.preventDefault();
  cart = [];
  updateCart();

  // Clear all the content in the container
  let confirmCart = document.querySelector('.confirm-cart');
  let confirmContent = confirmCart.querySelector('.confirm-content');
  confirmContent.innerHTML = ''; 

  document.querySelector('.cart-body').classList.add('d-none');
  // Remove all active classes
  document.querySelectorAll('.active').forEach(item => {
    item.classList.remove('active');
  });

  // Slide the confirm cart to the bottom
  confirmCart.classList.remove('slide-up', 'slide-up-2');
  confirmCart.classList.add('slide-bottom');

  // After the animation ends, hide the confirm cart
  setTimeout(() => {
    confirmCart.classList.add('d-none');
  }, 600);
});

// Function to handle animation
document.addEventListener("DOMContentLoaded", () => {
    const productItems = document.querySelectorAll(".product-item");
    const categoryItems = document.querySelectorAll('.category-item');
    const bannerContent = document.querySelector('.banner-content');
    const navLogo = document.querySelector('.nav-logo');
    const navRight = document.querySelector('.nav-right');
    bannerContent.classList.add("show"); 
    navLogo.classList.add('show');
    navRight.classList.add('show');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.2 } 
    );
  
    productItems.forEach((item) => observer.observe(item));
    categoryItems.forEach((item) => observer.observe(item));
});
  
