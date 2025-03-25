# Google Keep Clone Frontend

Frontendrakendus Google Keep API kloonile. Võimaldab märkmete loomist, muutmist, kustutamist ning siltide haldamist.

## Eeldused

Veenduge, et teil on installitud:
- [Node.js](https://nodejs.org/) (v14 või uuem)
- [npm](https://www.npmjs.com/) (tuleb koos Node.js-iga)
- [Google Keep API](https://github.com/your-username/google-keep-api) - backend server peab olema käivitatud

## Paigaldamine

1. **Klooni repo**
   ```sh
   git clone https://github.com/your-username/google-keep-frontend.git
   cd google-keep-frontend
   ```

2. **Installi sõltuvused**
   ```sh
   npm install
   ```

3. **Seadista keskkond**

   Kopeeri `.env.example` fail nimega `.env` ja seadista API URL:
   ```sh
   cp .env.example .env
   ```

   Muuda `.env` faili sisu vastavalt oma API serverile:
   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

## Käivitamine

### Arendusrežiimis
   ```sh
   npm start
   ```
Rakendus käivitub aadressil http://localhost:3000

### Tootmisversiooni ehitamine
   ```sh
   npm run build
   ```
Tootmisversioon luuakse `build` kausta, mida saab serveerida staatilise failidena.

## Kasutusjuhend

1. **Kasutajaks registreerimine**
    - Avage rakendus ja klõpsake "Registreeri"
    - Sisestage kasutajanimi ja parool
    - Klõpsake "Registreeri" nuppu

2. **Sisselogimine**
    - Avage rakendus ja klõpsake "Logi sisse"
    - Sisestage oma kasutajanimi ja parool
    - Klõpsake "Logi sisse" nuppu

3. **Märkmete loomine**
    - Sisselogituna sisestage märkme pealkiri ja sisu ülaosas olevas vormis
    - Vajutage "Lisa märge" nuppu

4. **Märkmete muutmine**
    - Klõpsake märkmel, mida soovite muuta
    - Muutke märkme sisu avanevas aknas
    - Vajutage "Salvesta" nuppu

5. **Siltide lisamine**
    - Klõpsake "Sildid" menüüpunktil vasakus menüüs
    - Sisestage uue sildi nimi ja vajutage "Lisa silt"
    - Märkmetele saab silte lisada märkme muutmise režiimis