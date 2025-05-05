# Állat Örökbefogadási Platform – MEAN Stack Projekt

Ez a projekt egy teljes körű webes alkalmazást valósít meg, amely állatok örökbefogadását támogatja.  
A rendszer **MEAN** (MongoDB · ExpressJS · Angular 2+ · NodeJS) technológiai stack‑re épül, és **TypeScript** nyelven készült.

---

## Főbb komponensek

A projekt három fő részből áll:

- **MongoDB** – NoSQL adatbázis, amely az állatokat, velük kapcsolatos híreket, felhasználókat és kérelmeiket adatait tárolja.  
- **ExpressJS + NodeJS** – REST API‑t biztosító szerver, amely kezeli a CRUD‑műveleteket, autentikációt és session‑kezelést.  
- **Angular 2+** – Webes kliensalkalmazás, amely lehetővé teszi a felhasználók számára az adatok megtekintését, szerkesztését és benyújtását.

---

## Funkcionalitás és jogosultságok

A rendszer többféle szerepkört támogat:

### Vendégek
- Böngészhetik az örökbefogadásra elérhető állatokat valamint a híreket.  

### Leendő örökbefogadók
Regisztráció és bejelentkezés után:
- Kedvencnek jelölhetik az állatokat.  
- Benyújthatják örökbefogadási kérelmeiket.  
- Nyomon követhetik kérelmeik állapotát.
- Időpont‑egyeztetés ismerkedésre.  

### Menhely‑adminisztrátorok
- Állatok adatainak kezelése (név, fotó, fajta, életkor, egészségi állapot, leírás stb.).  
- Örökbefogadási kérelmek jóváhagyása/elutasítása.  
- Frissítések posztolása az állatokról.  

---

## Adatmodell és kapcsolatkezelés

A MongoDB adatbázis **4 kollekciót** tartalmaz:

| Kollekció         | Tartalom (főbb adatok)                        |
|-------------------|-----------------------------------------------|
| `users`           | Felhasználói fiókok (admin, örökbefogadó)     |
| `animals`         | Örökbefogadásra elérhető állatok adatai       |
| `adoptionRequests`| Örökbefogadási kérelmek                       |
| `news`           | Állatokhoz kapcsolódó frissítések, hírek      |

---

## Telepítés és futtatás

1. **Előkészítés**
   - Legyen telepítve: Node.js, npm, Angular CLI.
   - Szerezz egy működő MongoDB‑kapcsolati URI‑t.

2. **Szerver‑oldal (mappa: `server`)**
   - Hozz létre egy `.env` fájlt, benne:  
     `MONGODB_URI=<mongodb_uri>`
   - npm install
   - npm run build
   - npm start

3. **Kliens‑oldal (mappa: `animal-adoption-client`)**
   - npm install
   - ng serve

4. **Használat**
   - A böngészőben nyisd meg: `http://localhost:4200`.
   - A frontend a háttérben a `http://localhost:5000`‑on futó API‑hoz kapcsolódik, ezért a két folyamat fusson párhuzamosan.
   - Friss adatbázisnál admin felhasználóhoz először regisztrálni kell egy felhasználót, majd az adatbázisban átírni a `role`-t `adopter`-ről `admin`-ra.
