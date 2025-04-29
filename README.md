# Google Keep Clone Frontend

See on lihtne React frontend Google Keep Clone API jaoks. See võimaldab kasutajatel luua, lugeda, uuendada ja kustutada märkmeid ning hallata märgiste abil nende korraldamist.

## Võimalused

- Kasutaja autentimine (sisselogimine/registreerimine)
- Märkmete haldamine (loomine, lugemine, uuendamine, kustutamine)
- Siltide haldamine (loomine, kustutamine, märkmete filtreerimine sildi järgi)
- Meeldetuletused märkmetele
- Kohanduv disain

## Kasutatavad tehnoloogiad

- React
- React Router
- Axios API päringute jaoks
- Context API oleku halduseks
- CSS stiilide jaoks

## Alustamine

### Eeldused

- Node.js (v14 või uuem)
- npm või yarn
- Google Keep Clone API backend töötab aadressil http://localhost:3000

### Paigaldamine

1. Klooni see repositoorium
```bash
git clone https://github.com/sinu-kasutajanimi/google-keep-frontend.git
cd google-keep-frontend
```

2. Paigalda sõltuvused
```bash
npm install
```

3. Käivita arendusserver
```bash
npm start
```

4. Ava brauser ja navigeeri aadressile http://localhost:3001

## Veaotsingu juhend

Kui teil on probleeme registreerimise või sisselogimisega, proovige järgmisi samme:

### 1. Kontrollige, et backend töötab korrektselt

Veenduge, et backend server jookseb pordil 3000 ja vastab päringutele. Saate seda kontrollida käivitades:

```bash
curl http://localhost:3000
```

### 2. Kontrollige konsoolist veateated

Avage brauseri arendaja tööriistad (F12 või Ctrl+Shift+I) ja vaadake konsoolist, mis vead seal ilmuvad. Need võivad aidata tuvastada probleemi.

### 3. CORS probleemid

Kui näete CORS vigu, veenduge, et backend toetab päringuid teie frontendi serverilt:
- Frontend töötab pordil 3001
- Backend töötab pordil 3000
- Backend on seadistatud lubama CORS päringuid

### 4. Päringute jälgimine

Meie API teenus on seadistatud logima konsoolile kõik päringud ja vastused, mis aitab teil jälgida, mis päringud ebaõnnestuvad ja miks.

### 5. API baasaadressi muutmine

Kui teie backend server ei kasuta porti 3000, muutke `.env` failis `REACT_APP_API_URL` väärtust.

## Projekti struktuur

```
src/
  ├── components/      # Taaskasutatavad UI komponendid
  │   ├── Auth/        # Autentimise komponendid
  │   ├── Notes/       # Märkmete komponendid
  │   ├── Tags/        # Siltide komponendid
  │   └── Layout/      # Paigutuse komponendid (päis, külgriba)
  ├── services/        # API teenuse funktsioonid
  ├── contexts/        # React Context oleku halduseks
  └── utils/           # Utiliitfunktsioonid
```

## API seadistus

Frontend on seadistatud suhtlema backendiga, mis töötab aadressil `http://localhost:3000`. Kui teie backend töötab mõnel teisel aadressil, uuendage `.env` failis `REACT_APP_API_URL` väärtust.

## Paigaldamine tootmisse

Rakenduse ehitamiseks tootmiskeskkonna jaoks:

```bash
npm run build
```

See loob `build` kataloogi optimeeritud tootmisfailidega, mida saab paigutada mistahes staatilise majutuse teenusesse.

## Litsents

See projekt on litsentseeritud MIT litsentsi alusel.