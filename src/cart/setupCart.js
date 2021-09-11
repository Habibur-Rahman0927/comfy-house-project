// import
import {
  getStorageItem,
  setStorageItem,
  formatPrice,
  getElement,
} from '../utils.js';
import { openCart } from './toggleCart.js';
import { findProduct } from '../store.js';
import addToCartDOM from './addToCartDOM.js';
// set items
const cartItemCountDom = getElement('.cart-item-count');
const cartItemsDom = getElement('.cart-items');
const cartTotalDom = getElement('.cart-total');

let cart = getStorageItem('cart');

export const addToCart = (id) => {
  let item = cart.find((cartItem) => cartItem.id === id);
  if (!item) {
    let product = findProduct(id);
    // add item to the 
    product = { ...product, amount: 1 };
    cart = [...cart, product];
    // add to item the DOM
    addToCartDOM(product);
  }
  else {
    // update value
    const amount = increseAmount(id);
    const items = [...cartItemsDom.querySelectorAll('.cart-item-amount')];
    const newAmount = items.find((value) => value.dataset.id === id);
    newAmount.textContent = amount;
  }

  //add one to the item count
  displayCartItemCount();
  //display cart totals
  displayCartTotal();
  //set cart in local storage;
  setStorageItem('cart', cart);

  // more stuff coming up
  openCart()

};


function displayCartItemCount() {
  const amount = cart.reduce((acc, cur) => {
    return acc += cur.amount;
  }, 0);
  cartItemCountDom.textContent = amount;
}

function displayCartTotal() {
  let total = cart.reduce((acc, cur) => {
    return acc += cur.price * cur.amount;
  }, 0);
  cartTotalDom.textContent = `Total : ${formatPrice(total)}`
}

function displayCartItemsDom() {
  cart.forEach((cartItem) => addToCartDOM(cartItem))
}

function removeItem(id) {
  cart = cart.filter((cartItem) => cartItem.id !== id);
}
function increseAmount(id) {
  let newAmount;
  cart = cart.map(cartItem => {
    if (cartItem.id === id) {
      newAmount = cartItem.amount + 1
      cartItem = { ...cartItem, amount: newAmount }
    }
    return cartItem;
  });
  return newAmount;
}

function decreaseAmount(id) {
  let newAmount;
  cart = cart.map(cartItem => {
    if (cartItem.id === id) {
      newAmount = cartItem.amount - 1;
      cartItem = { ...cartItem, amount: newAmount }
    }
    return cartItem;
  });
  return newAmount;
}
function setupCartFunctionality() {
  cartItemsDom.addEventListener('click', (e) => {
    const element = e.target;
    const parent = e.target.parentElement;
    const id = e.target.dataset.id;
    const parentID = e.target.parentElement.dataset.id;
    // remove
    if (element.classList.contains('cart-item-remove-btn')) {
      removeItem(id);
      // parent.parentELement.remove();
      element.parentElement.parentElement.remove();
    }
    // increase
    if (parent.classList.contains('cart-item-increase-btn')) {
      const newAmount = increseAmount(parentID);
      parent.nextElementSibling.textContent = newAmount;
    }
    // decrease
    if (parent.classList.contains('cart-item-decrease-btn')) {
      const newAmount = decreaseAmount(parentID);
      if (newAmount === 0) {
        removeItem(id);
        parent.parentElement.parentElement.remove();
      }
      else {
        parent.previousElementSibling.textContent = newAmount;

      }
    }


    displayCartItemCount();
    displayCartTotal();
    setStorageItem('cart', cart);
  })
}

const init = () => {
  // display amount of cart items
  displayCartItemCount();
  // display total 
  displayCartTotal();
  // add all cart items to the dom
  displayCartItemsDom()
  // setup cart functionality
  setupCartFunctionality();
}
init();