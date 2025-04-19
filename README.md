🐾 Állat Örökbefogadási Platform – MEAN Stack Projekt
Ez a projekt egy teljes körű webes alkalmazást valósít meg, amely állatok örökbefogadását támogatja. A rendszer MEAN (MongoDB, ExpressJS, Angular 2+, NodeJS) technológiai stack-re épül, és TypeScript nyelven készült.

🔧 Főbb komponensek
A projekt három fő részből áll:

MongoDB – NoSQL adatbázis, amely az állatok, felhasználók és kérelmek adatait tárolja.

ExpressJS + NodeJS – REST API-t biztosító szerver, amely kezeli a CRUD műveleteket, autentikációt és session-kezelést.

Angular 2+ – Webes kliensalkalmazás, amely lehetővé teszi a felhasználók számára az adatok megtekintését, szerkesztését és benyújtását.

🔐 Funkcionalitás és jogosultságok
A rendszer többféle szerepkört támogat:

👤 Vendégek:
Böngészhetik az örökbefogadásra elérhető állatokat

Regisztráció után örökbefogadási kérelmet nyújthatnak be

🐶 Leendő örökbefogadók:
Regisztráció és bejelentkezés után:

Kedvencnek jelölhetik az állatokat

Benyújthatják örökbefogadási kérelmeiket

Nyomon követhetik kérelmeik állapotát

🏥 Menhely adminisztrátorok:
Állatok adatainak kezelése (név, fotó, fajta, életkor, egészségi állapot, leírás stb.)

Örökbefogadási kérelmek jóváhagyása/elutasítása

Időpont-egyeztetés ismerkedésre

Frissítések posztolása az állatokról

Poszt-örökbefogadási támogatás kezelése

🗄️ Adatmodell és kapcsolatkezelés
A MongoDB adatbázis 4 kollekciót tartalmaz:

users – felhasználói fiókok (admin, örökbefogadó)

animals – örökbefogadásra elérhető állatok adatai

adoptionRequests – örökbefogadási kérelmek

posts – állatokhoz kapcsolódó frissítések, hírek



📦 Telepítés és futtatás

