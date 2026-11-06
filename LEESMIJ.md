# Winkeltemplate voor Elsa's Kapsalon

De template staat in `kapper website/winkel/`. Open de bestaande kapsalonwebsite en kies **Shop**. Daar staan drie productplekken met een link naar de afzonderlijke winkelpagina. Je kunt ook `winkel/index.html` rechtstreeks openen.

## Bestanden

- `index.html`: de winkelpagina, twee categorieën en zes productkaarten.
- `style.css`: de winkelopmaak en de opmaak van de drie kaarten op de bestaande Shop-pagina.
- `script.js`: alleen commentaar, gereserveerd voor later. Er draait geen nieuwe JavaScript-code.

## Je eigen inhoud invullen

1. Vervang de teksten tussen vierkante haken in de HTML. Dit zijn gewone HTML-teksten die je in je editor aanpast, geen invoervelden met opslag.
2. Vervang bij een product het beeldvlak door bijvoorbeeld:

   ```html
   <div class="store-product-image">
     <img src="images/jouw-product.jpg"
          alt="Beschrijving van jouw product"
          width="600" height="600" loading="lazy">
   </div>
   ```

   Bewaar die afbeelding in `winkel/images/`. In de bestaande kapsalonpagina gebruik je voor dezelfde afbeelding `winkel/images/jouw-product.jpg`.
3. Vul bij ieder product merk, naam, korte beschrijving, inhoud en prijs in.
4. Kopieer een volledig `<article class="store-product">` om een product toe te voegen. Geef het product, zijn titel en `aria-labelledby` passende unieke id's.
5. Kopieer voor een extra categorie een volledige `<section class="store-category">`. Voeg ook een link met het juiste `href="#..."` toe bij `.store-categories`.
6. Werk de drie productplekken in de oorspronkelijke `index.html` apart bij. Er is bewust nog geen automatisch gedeelde productlijst. De links verwijzen naar `product-01`, `product-02` en `product-03` in de winkel.

## Kleuren en opbouw

Bovenaan `style.css` staan de kleuren uit de kapsalonwebsite: `#1D1917`, `#292320`, `#4A3D35`, `#A58F7C` en `#C8AD7F`. De serifkoppen sluiten aan bij de grote titel van de kapsalon. Alle nieuwe classnamen beginnen met `store-` om botsingen met de bestaande stijlen te voorkomen.

De winkel heeft een header, een compacte introductie, categorieën naast het productoverzicht en een footer. Op kleinere schermen staan categorieën boven de producten; het productgrid gaat naar twee en vervolgens één kolom. Afbeeldingen blijven vierkant en worden met `object-fit: contain` volledig zichtbaar gehouden.

De template heeft geen zoekfunctie, filters, winkelmand, checkout, betaling of backend. Categorielinks en links tussen de twee pagina's zijn gewone HTML-links. Er zijn geen verzonnen producten, productfoto's, prijzen, reviews of leveringsbeloften toegevoegd.

## Later een aparte winkelsite

`winkel/index.html` is nu een aparte lokale pagina. Er is nog geen publiek webadres aangemaakt. Je kunt de bestanden in `winkel/` later zelfstandig hosten. Pas dan de links `winkel/index.html` en de drie productlinks op de kapsalonsite aan naar dat adres. Pas in de winkel ook `../index.html` aan naar het adres van de kapsalonsite. De kapsalon gebruikt voor de productvoorbeelden `winkel/style.css`; houd dat bestand daar beschikbaar als je de winkel naar een ander domein kopieert.

## Gebruikte inspiratie

Bekeken op 5 oktober 2026:

- [Haarspullen — haarverzorging](https://www.haarspullen.nl/collections/haarverzorging): categorieën, een herhaalbaar productoverzicht en vaste plaatsen voor productgegevens.
- [Etos — shampoo](https://www.etos.nl/haarverzorging/shampoo/): indeling naar producttype en een duidelijke hiërarchie van naam, inhoud en prijs.

Die structuur is teruggebracht tot een eenvoudige basis met de kleuren en sfeer van de bestaande kapsalonwebsite.
