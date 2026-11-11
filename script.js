const pages = document.querySelectorAll('.page');
const mobileLayout = window.matchMedia('(max-width: 767px)');
const desktopHeader = document.getElementById('header');
const homeImages = [1, 2, 3].map(number => {
  const image = document.getElementById(`about-image${number}`);
  return { image, originalParent: image.parentNode };
});

function enableMobileLayout() {
  desktopHeader.remove()

  pages.forEach(page => {
    const newMenu = document.createElement('button')
    page.appendChild(newMenu)
    newMenu.type = 'button'
    newMenu.setAttribute('aria-label', 'Menu')
    const menuIcon = document.createElement('img')
    menuIcon.src = 'images/hamburger-menu.svg'
    menuIcon.alt = ''
    menuIcon.width = 32
    menuIcon.height = 32
    menuIcon.style.display = 'block'
    menuIcon.style.filter = 'invert(1)'
    newMenu.appendChild(menuIcon)
    newMenu.style.backgroundColor = 'transparent'
    newMenu.style.border = 'none'
    newMenu.style.padding = '6px'
    newMenu.style.width = '44px'
    newMenu.style.height = '44px'
    newMenu.style.right = '20px'
    newMenu.style.cursor = 'pointer'
    newMenu.style.position = 'absolute'
    newMenu.style.top = '20px'
    newMenu.id = 'newMenuButton'
    const menuContent = document.createElement('nav')
    page.appendChild(menuContent)
    menuContent.style.backgroundColor = '#D4AF37'
    menuContent.style.borderRadius = '8px'
    menuContent.style.position = 'absolute'
    menuContent.style.top = '65px'
    menuContent.style.setProperty('width', '50%', 'important')
    menuContent.style.right = '0'
    document.getElementById('button1').innerHTML = 'Boek nu je afspraak'
    document.getElementById('button2').innerHTML = 'Bekijk onze diensten'
    let hiddenMenu = true
    let done = false
    if (done === false) {
      menuContent.hidden = true
      done = true
    }
    newMenu.onclick = () => showMenu();

    const listelement1 = document.createElement('button')
    listelement1.innerHTML = 'Home'
    listelement1.style.backgroundColor = 'transparent'
    listelement1.style.border = 'none'
    listelement1.style.fontSize = '25px'
    listelement1.style.paddingLeft = '8px'
    listelement1.style.paddingRight = '8px'
    menuContent.appendChild(listelement1)

    const listelement2 = document.createElement('button')
    listelement2.innerHTML = 'Over ons'
    listelement2.style.backgroundColor = 'transparent'
    listelement2.style.border = 'none'
    listelement2.style.fontSize = '25px'
    listelement2.style.paddingLeft = '8px'
    listelement2.style.paddingRight = '8px'
    menuContent.appendChild(listelement2)

    const listelement3 = document.createElement('button')
    listelement3.innerHTML = 'Diensten'
    listelement3.style.backgroundColor = 'transparent'
    listelement3.style.border = 'none'
    listelement3.style.fontSize = '25px'
    listelement3.style.paddingLeft = '8px'
    listelement3.style.paddingRight = '8px'
    menuContent.appendChild(listelement3)

    const listelement4 = document.createElement('button')
    listelement4.innerHTML = 'Shop'
    listelement4.style.backgroundColor = 'transparent'
    listelement4.style.border = 'none'
    listelement4.style.fontSize = '25px'
    listelement4.style.paddingLeft = '8px'
    listelement4.style.paddingRight = '8px'
    menuContent.appendChild(listelement4)

    const listelement5 = document.createElement('button')
    listelement5.innerHTML = 'Afpsraak maken'
    listelement5.style.backgroundColor = 'transparent'
    listelement5.style.border = 'none'
    listelement5.style.fontSize = '25px'
    listelement5.style.paddingLeft = '8px'
    listelement5.style.paddingRight = '8px'
    menuContent.appendChild(listelement5)
    function showMenu() {
      menuContent.hidden = !menuContent.hidden
    }
    listelement1.onclick = () => {
      showPage('home')
      menuContent.hidden = true
    }

    listelement2.onclick = () => {
      showPage('about')
      menuContent.hidden = true
    }
    listelement3.onclick = () => {
      showPage('service')
      menuContent.hidden = true
    }
    listelement4.onclick = () => {
      showPage('shop')
      menuContent.hidden = true
    }
    listelement5.onclick = () => {
      showPage('book')
      menuContent.hidden = true
    }
  })

  homeImages.forEach(({ image }, index) => {
    document.getElementById(`newImage${index + 1}`).appendChild(image);
  });
}

// Ook bij draaien of versmallen de bijbehorende navigatie en foto's tonen.
function syncResponsiveLayout() {
  if (mobileLayout.matches) {
    enableMobileLayout();
  } else {
    document.body.insertBefore(desktopHeader, document.getElementById('home'));
    pages.forEach(page => {
      page.querySelectorAll(':scope > #newMenuButton, :scope > nav').forEach(menu => menu.remove());
    });
    homeImages.forEach(({ image, originalParent }) => originalParent.appendChild(image));
  }
}

syncResponsiveLayout();
mobileLayout.addEventListener('change', syncResponsiveLayout);

function showPage(id) {
  const pages = document.querySelectorAll('.page')
  pages.forEach(page => {
    page.classList.remove('active')
  })
  const currentPage = document.getElementById(id)
  if (currentPage) {
    currentPage.classList.add('active')
    document.body.classList.toggle('service-page', id === 'service')
    const menuButton = currentPage.querySelector('#newMenuButton')
    if (menuButton) menuButton.hidden = false
  }
}

const serviceButton1 = document.getElementById('service-button1')
const serviceButton2 = document.getElementById('service-button2')
const serviceButton3 = document.getElementById('service-button3')
const serviceButton4 = document.getElementById('service-button4')
const serviceSelect = document.getElementById('service-select')

serviceButton1.addEventListener('click', () => handleServiceButton('service1'))
serviceButton2.addEventListener('click', () => handleServiceButton('service2'))
serviceButton3.addEventListener('click', () => handleServiceButton('service3'))
serviceButton4.addEventListener('click', () => handleServiceButton('service4'))

function handleServiceButton(serviceId) {
  serviceInput = serviceId
  showPage('book')
  serviceSelect.value = serviceId
}
