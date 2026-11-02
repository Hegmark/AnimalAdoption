# Állat Örökbefogadási Platform – MEAN Stack Projekt

Teljes körű webes alkalmazás állatok örökbefogadásának támogatására.
A rendszer **MEAN** (MongoDB · ExpressJS · Angular 2+ · NodeJS) stackre épül, **TypeScript** nyelven,
és **konténerizált**, reprodukálható környezetben futtatható.

---

## Architektúra

| Komponens | Technológia | Port | Megjegyzés |
|-----------|-------------|------|------------|
| Adatbázis | MongoDB (konténer) | 27017 | Tartós adattárolás named volume-on |
| API | Express + Node.js | 5000 | REST API, session-alapú autentikáció |
| Kliens | Angular 19 (nginx) | 4200 (dev) / 8080 (prod) | Statikus SPA, az `/api`-t és `/uploads`-ot az API-hoz proxyzza |
| E-mail | MailHog (fejlesztői SMTP) | 8025 (webes felület) | Kimenő e-mailek elkapása fejlesztéshez |

A kliens **relatív** URL-eket használ, amelyeket az nginx reverse proxy továbbít az API-nak,
így a rendszer bármely környezetben, portfüggetlenül működik (nincs beégetett hoszt).

---

## Funkciók és jogosultságok

- **Vendégek**: böngészhetik az állatokat és a híreket.
- **Örökbefogadók** (regisztráció után): kedvencek jelölése, örökbefogadási kérelem benyújtása és
  követése, időpont-egyeztetés ismerkedésre.
- **Admin**: állatok kezelése (képfeltöltéssel), hírek posztolása, kérelmek elbírálása.

### Kiemelt feldolgozás / integráció

- **Képfeldolgozás (sharp, szinkron)**: feltöltéskor a kép automatikus elforgatása, EXIF-adatok
  eltávolítása, **vízjel** ráhelyezése, tömörített **WebP** fő kép + **bélyegkép** előállítása.
  Egy állathoz **több kép** is feltölthető: az első kép a (vízjel nélküli) borító/bélyegkép,
  a többi vízjellel, lapozható galériában jelenik meg az állat oldalán.
- **Örökbefogadási munkafolyamat + e-mail**: egy kérelem jóváhagyásakor az állat **foglaltra**
  kerül, a többi függő kérelem **automatikusan elutasításra** kerül, és minden érintett örökbefogadó
  **e-mail értesítést** kap (MailHog-on keresztül). Az e-mailküldés hibatűrő: többszöri újrapróbálás
  után sem dob hibát, a kérelem állapota ettől függetlenül elmentésre kerül.

---

## Előfeltételek

- **Docker Desktop** (vagy Docker Engine + Compose plugin).
- *Opcionális* – csak konténer nélküli fejlesztéshez: **Node.js 22+**.

---

## Gyors indítás (Docker)

```bash
# 1. Környezeti változók (a gyökérben) — csak a session titok kell hozzá
cp .env.example .env            # szükség esetén állíts be erős SESSION_SECRET-et

# 2. A teljes stack indítása (MongoDB + API + kliens + MailHog)
docker compose up -d --build

# 3. Adatbázis feltöltése minta-adatokkal (admin + állatok + hír)
docker compose --profile seed run --rm seed

# 4. Megnyitás böngészőben
#    Alkalmazás:  http://localhost:4200
#    MailHog:     http://localhost:8025
```

**Admin belépés** (a seed hozza létre): `admin@example.com` / `admin123`

Leállítás:

```bash
docker compose down            # leállítás, az adatok megmaradnak
docker compose down -v         # leállítás + az adatbázis és feltöltések törlése
```

---

## Környezetek

A konfiguráció egy közös alapból és környezet-specifikus felülírásokból áll:

| Fájl | Szerep |
|------|--------|
| `docker-compose.yml` | Közös alap (minden szolgáltatás) |
| `docker-compose.override.yml` | **Dev** – automatikusan érvényesül; portok, bind mount a feltöltésekhez |
| `docker-compose.prod.yml` | **Prod** – kötelező `SESSION_SECRET`, named volume-ok, csak a kliens elérhető kívülről |

Prod indítása elkülönített projektként (a dev mellett is futhat):

```bash
# SESSION_SECRET kötelező – enélkül a prod stack nem indul el
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") \
  docker compose -f docker-compose.yml -f docker-compose.prod.yml -p animaladoption_prod up -d --build

docker compose -f docker-compose.yml -f docker-compose.prod.yml -p animaladoption_prod \
  --profile seed run --rm seed
# Alkalmazás: http://localhost:8080
```

---

## Hasznos parancsok

```bash
docker compose logs -f server                      # szerver logok
docker compose --profile seed run --rm seed        # (újra)seedelés – idempotens
docker compose ps                                  # szolgáltatások állapota
```

---

## Konténer nélküli fejlesztés (opcionális)

A MongoDB-t és a MailHog-ot érdemes konténerben hagyni, az alkalmazást pedig a hoszton futtatni:

```bash
# Szerver
cd server
cp .env.example .env            # MONGODB_URI, SESSION_SECRET, SMTP_* a hoszthoz
npm install
npm run build && npm start      # vagy: npm run seed

# Kliens (másik terminálban)
cd animal-adoption-client
npm install
npm start                       # ng serve; az /api és /uploads az 5000-re proxyzva (proxy.conf.json)
```

---

## Konfiguráció (környezeti változók)

| Változó | Alapértelmezés | Leírás |
|---------|----------------|--------|
| `MONGODB_URI` | – (kötelező) | MongoDB kapcsolati URI |
| `SESSION_SECRET` | dev: beégetett placeholder / prod: **kötelező** | Session cookie aláíró titka |
| `CORS_ORIGINS` | `http://localhost:4200,http://localhost:8080` | Engedélyezett böngésző-originek (vesszővel) |
| `SESSION_COOKIE_SECURE` | `false` | `true` HTTPS mögött (Secure cookie) |
| `SMTP_HOST` / `SMTP_PORT` | `localhost` / `1025` | SMTP szerver (konténerben: `mailhog`) |
| `MAIL_FROM` | `Örökbefogadás <no-reply@orokbefogadas.local>` | Kimenő e-mail feladó |

A titkok **soha nincsenek verziókezelve** – csak a `.env.example` fájlok. A szerver hiányzó
kötelező változó esetén egyértelmű hibaüzenettel leáll. Részletek: [SECURITY.md](SECURITY.md).

---

## Adatmodell

A MongoDB adatbázis **4 kollekciót** tartalmaz:

| Kollekció | Tartalom |
|-----------|----------|
| `users` | Felhasználói fiókok (admin, örökbefogadó) |
| `animals` | Örökbefogadásra elérhető állatok (képek, bélyegkép) |
| `adoptionRequests` | Örökbefogadási kérelmek és állapotuk |
| `news` | Hírek, frissítések |
