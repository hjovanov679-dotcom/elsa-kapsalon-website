const productName = document.getElementById('productName');
const productDescription = document.getElementById('product-description');
const price = document.getElementById('price');
const bezorging = document.getElementById('bezorging');
const productFoto = document.getElementById('productFoto');

const product = JSON.parse(sessionStorage.getItem('product'));

function updateProduct(product) {
    productName.textContent = product.name;
    productDescription.textContent = product.description || 'beschrijving niet beschikbaar.';
    price.textContent = product.price;
    const img = document.createElement('img');
    img.src = '../' + product.image;
    img.alt = product.name;
    productFoto.replaceChildren(img);}

if (product) {
    updateProduct(product);
}

const submitOrderButton = document.getElementById('submitOrder');
const nameInput = document.getElementById('customerName');
const emailInput = document.getElementById('email');
const adressInput = document.getElementById('adress');
const postalCodeInput = document.getElementById('postalCode');
const cityInput = document.getElementById('city');
const phoneNumberInput = document.getElementById('phoneNumber');
const messageSpan = document.getElementById('message');
const orderMessageSpan = document.getElementById('order-message')


submitOrderButton.addEventListener('click', async function() {
    if (!nameInput.value || !emailInput.value || !adressInput.value || !postalCodeInput.value || !cityInput.value || !phoneNumberInput.value) {
        orderMessageSpan.textContent = 'Vul alstublieft alle velden in.';
    } else if (!emailInput.value.includes('@')) {
        orderMessageSpan.textContent = 'Voer een geldig e-mailadres in.';
    } else {
        const orderData = {
            product: product,
            name: nameInput.value,
            email: emailInput.value,
            adress: adressInput.value,
            postalCode: postalCodeInput.value,
            city: cityInput.value,
            phoneNumber: phoneNumberInput.value
            };
        const response = await fetch('bestellingen.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const send_data = await response.json();
        if (send_data.success) {
            sessionStorage.removeItem('product');
            orderMessageSpan.textContent = 'Bestelling succesvol geplaatst. Er is een e-mail verzonden naar ' + emailInput.value + ' met de link om af te rekenen.';
        } else {
            orderMessageSpan.textContent = 'Er is een fout opgetreden bij het plaatsen van de bestelling.';
        }
    };
    const emailResponse = await fetch('email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });

    const emailData = await emailResponse.json();
    if (emailData.success) {
        orderMessageSpan.textContent = 'Bestelling succesvol geplaatst. Er is een e-mail verzonden naar ' + emailInput.value + ' met de link om af te rekenen.';
    } else {
        orderMessageSpan.textContent = 'Er is een fout opgetreden bij het verzenden van de e-mail. Stuur alstublieft een e-mail naar support@elsas-kapsalon.nl met uw bestelgegevens. Dan helpen wij u verder.';
    }
});
