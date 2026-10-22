# Studio Van der Horst

De actuele statische website staat in `outputs/dist`. De homepage is `outputs/dist/index.html`.

## Netlify
- Productiebranch: `main`.
- Base directory: leeg.
- Build command: leeg.
- Publish directory: `outputs/dist` (vastgelegd in `netlify.toml`).
- Geen Node-build, functions, database of omgevingsvariabelen nodig.
- Formspree behouden; Netlify Forms is niet nodig.

Wijzig de actuele bestanden in `outputs/dist`. Historische bouwscripts en lokale back-ups worden niet opgenomen in Git. Voer oude bouwscripts niet blind opnieuw uit: zij kunnen recente wijzigingen overschrijven.

Na koppeling aan Netlify kunnen pushes op de productiebranch automatisch publiceren.
De sitemap en canonical-adressen verwijzen naar `https://www.studiovanderhorst.nl`.
Stel bij publicatie het domein, HTTPS en permanente domeindoorverwijzingen in. Controleer Formspree-ontvangst vanaf het definitieve domein. Richt redirects voor de oude Webflow-adressen afzonderlijk in.

De websitebestanden staan indexering toe. Bescherm een eventuele openbare testomgeving afzonderlijk via de hosting.
