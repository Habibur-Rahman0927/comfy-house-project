import { getElement } from '../utils.js';
import display from '../displayProducts.js';

const setupCompanies = (store) => {
    let companies = ['all', ...new Set(store.map((product) => product.company))];
    const companiesDom = getElement('.companies');
    companiesDom.innerHTML = companies.map((company) => {
        return `
                <button class="company-btn">${company}</button>

        `
    }).join("");
    companiesDom.addEventListener('click', (e) => {
        const element = e.target;
        if (element.classList.contains('company-btn')) {
            let newStore = [];
            if (element.textContent === 'all') {
                newStore = [...store];
            }
            else {
                newStore = store.filter((product) => product.company === element.textContent)
            }
            display(newStore, getElement('.products-container'));
        }
    })

};

export default setupCompanies;
