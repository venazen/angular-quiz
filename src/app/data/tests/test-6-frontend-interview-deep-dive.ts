import { QuizTest } from '../../models/question.model';

/**
 * Test 6: Frontend interview deep-dive (JS, TS, CSS, browser, web, sigurnost, pristupačnost).
 * Cilj: razumjeti "zašto" iza odgovora i moći ga objasniti svojim riječima.
 * Savjet: prije nego pogledaš opcije, pokušaj naglas odgovoriti na pitanje.
 * Svako objašnjenje završava dijelom "Kako to reći na intervjuu".
 */
export const test6FrontendInterviewDeepDive: QuizTest = {
  id: 'test-6-frontend-interview-deep-dive',
  title: 'Test 6: Frontend Interview Deep-Dive',
  description:
    'JavaScript (event loop, closures, this, async), TypeScript, CSS, browser, performanse, keširanje, CORS, sigurnost i pristupačnost.',
  questions: [
    {
      id: 'q1',
      prompt: `Šta ispisuje sljedeći kod i ZAŠTO je to taj redoslijed?

console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('D'));
console.log('E');`,
      options: [
        {
          id: 'a',
          text: 'A B C D E, jer se kod izvršava redom od vrha prema dnu, a timeout sa 0 ms se izvršava odmah.',
        },
        {
          id: 'b',
          text: 'A E B C D, jer se timeout (macrotask) uvijek izvršava prije promise-a.',
        },
        {
          id: 'c',
          text: 'A E C D B: prvo se izvrši sav sinhroni kod, zatim microtask red (promise then, queueMicrotask), a tek poslije toga sljedeći macrotask (timer).',
        },
        {
          id: 'd',
          text: 'A C D E B, jer se promise izvrši odmah čim se kreira, čak i prije sljedeće sinhrone linije.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Event loop: poziv-stack izvršava sinhroni kod (A, E). Kad je stack prazan, prazni se microtask red (promise callback-i, queueMicrotask, MutationObserver): C, pa D. Tek tada event loop uzima sljedeći macrotask (setTimeout, događaji, I/O): B. Zato setTimeout(fn, 0) nije "odmah", nego "čim stack i microtask red budu prazni". Microtask red se prazni potpuno prije sljedećeg macrotask-a.\n\nKako to reći na intervjuu: "JavaScript je single-threaded. Prvo ide sinhroni kod, pa microtask-ovi (promise-i), pa macrotask-ovi (timeri, događaji). Zato promise callback stiže prije setTimeout-a, čak i sa nula milisekundi."',
    },
    {
      id: 'q2',
      prompt: `Šta ispisuje kod i kako bi ga popravio da ispiše 0, 1, 2?

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
      options: [
        {
          id: 'a',
          text: 'Ispisuje 0 1 2; ništa se ne mora popravljati jer svaki callback pamti svoju vrijednost.',
        },
        {
          id: 'b',
          text: 'Ispisuje undefined tri puta, jer i ne postoji izvan petlje.',
        },
        {
          id: 'c',
          text: 'Ispisuje 2 2 2, jer petlja staje na posljednjoj vrijednosti prije uslova.',
        },
        {
          id: 'd',
          text: 'Ispisuje 3 3 3: var je function-scoped, pa svi callback-i dijele JEDNU promjenljivu i izvršavaju se tek nakon što petlja završi (i = 3). Popravka: let (nova vezana vrijednost po iteraciji) ili IIFE koji "uhvati" vrijednost.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Closure je funkcija zajedno sa okruženjem u kojem je nastala: callback "pamti" promjenljivu, ne njenu vrijednost u tom trenutku. Sa var postoji samo jedna i za cijelu funkciju, a callback-i se izvršavaju kad je petlja već završila (i je 3). let u for petlji pravi novu vezu za svaku iteraciju, pa svaki callback vidi svoju vrijednost.\n\nKako to reći na intervjuu: "Callback pamti promjenljivu, ne vrijednost. Sa var svi dijele jednu, pa dobijem 3 3 3. Sa let svaka iteracija ima svoju, pa dobijem 0 1 2."',
    },
    {
      id: 'q3',
      prompt: `Kod:

class Counter {
  count = 0;
  inc() { this.count++; }
}
const c = new Counter();
button.addEventListener('click', c.inc);

Šta se dešava pri kliku i kako to popraviti?`,
      options: [
        {
          id: 'a',
          text: 'this unutar inc() pokazuje na element (button), a ne na c, pa c.count ostaje 0. Popravka: arrow funkcija () => c.inc(), c.inc.bind(c), ili definisati inc kao arrow polje klase.',
        },
        {
          id: 'b',
          text: 'Radi ispravno; c.count raste pri svakom kliku jer metoda pamti svoju instancu.',
        },
        {
          id: 'c',
          text: 'this je uvijek globalni objekat (window), pa kod mijenja window.count.',
        },
        {
          id: 'd',
          text: 'Baca SyntaxError jer metode klase ne mogu biti proslijeđene kao callback.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'this u JavaScriptu zavisi od toga KAKO je funkcija pozvana, a ne gdje je napisana. Kad metodu proslijediš kao callback, gubi se veza sa objektom. Event listener ga poziva sa this = element na koji je listener vezan, pa se mijenja button.count, a ne c.count. Kad se funkcija pozove "gola", u strict modu this je undefined. Arrow funkcije nemaju svoj this, nego ga preuzimaju iz okoline, pa su prirodno rješenje.\n\nKako to reći na intervjuu: "this zavisi od načina poziva. Kad metodu proslijedim kao callback, gubi se kontekst, pa koristim arrow funkciju ili bind."',
    },
    {
      id: 'q4',
      prompt: `Šta ispisuje kod?

console.log(a);
var a = 1;
console.log(b);
let b = 2;`,
      options: [
        { id: 'a', text: 'undefined, 2' },
        {
          id: 'b',
          text: 'ReferenceError već na prvoj liniji, jer a nije deklarisano prije upotrebe.',
        },
        {
          id: 'c',
          text: 'undefined, a zatim ReferenceError: var deklaracija se hoist-uje i inicijalizuje na undefined; let/const su također hoist-ovani, ali su u "temporal dead zone" do linije svoje deklaracije.',
        },
        { id: 'd', text: '1, 2' },
      ],
      correctOptionId: 'c',
      explanation:
        'Hoisting znači da se deklaracije obrađuju prije izvršavanja koda. var se podiže i odmah dobija vrijednost undefined, pa čitanje prije dodjele ne baca grešku. let i const se također podižu, ali ostaju neinicijalizovani do linije deklaracije (temporal dead zone), pa pristup prije toga baca ReferenceError. Zato su let/const sigurniji: greške se vide ranije.\n\nKako to reći na intervjuu: "var se hoist-uje sa vrijednošću undefined, a let i const postoje ali su u temporal dead zone dok izvršavanje ne dođe do deklaracije. Zato preferiram let i const."',
    },
    {
      id: 'q5',
      prompt:
        'Dashboard učitava tri nezavisna widgeta (vrijeme, vijesti, statistika). Ako jedan zahtjev padne, ostala dva se i dalje moraju prikazati.\n\nKoju Promise metodu koristiš?',
      options: [
        {
          id: 'a',
          text: 'Promise.all, jer čeka sve promise-e i vraća rezultate i kad neki padne.',
        },
        {
          id: 'b',
          text: 'Promise.allSettled: čeka sve i za svaki vraća status (fulfilled/rejected), pa prikažeš ono što je uspjelo. Promise.all odbija čim jedan padne, race vraća prvi završeni, a any prvi uspješni.',
        },
        {
          id: 'c',
          text: 'Promise.race, jer vraća rezultat onog koji se prvi završi, a ostale ignoriše.',
        },
        {
          id: 'd',
          text: 'Promise.any, jer čeka da svi uspiju i vraća sve rezultate zajedno.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Promise.all: sve ili ništa (odbija se na prvu grešku). Promise.allSettled: čeka sve i daje { status, value/reason } za svaki. Promise.race: prvi koji se završi (uspjehom ili greškom). Promise.any: prvi koji uspije (odbija samo ako svi padnu). Za nezavisne widgete gdje djelimičan uspjeh ima smisla, allSettled je prava opcija.\n\nKako to reći na intervjuu: "Za nezavisne izvore koristim allSettled da jedna greška ne sruši ostale. All koristim kad mi trebaju svi rezultati, race za timeout obrasce, a any kad mi je dovoljan prvi uspješan."',
    },
    {
      id: 'q6',
      prompt: `Funkcija vraća prazan niz iako svi pozivi uspiju. Zašto?

async function load(ids) {
  const results = [];
  ids.forEach(async (id) => {
    results.push(await fetchItem(id));
  });
  return results;
}`,
      options: [
        {
          id: 'a',
          text: 'forEach ne čeka async callback-e: pozivi se pokrenu, forEach se odmah vrati i funkcija vrati results dok je još prazan. Popravka: await Promise.all(ids.map(fetchItem)) za paralelno, ili for...of sa await za sekvencijalno izvršavanje.',
        },
        {
          id: 'b',
          text: 'fetchItem nikad ne vrati vrijednost, pa se push nikad ne izvrši.',
        },
        {
          id: 'c',
          text: 'await ne radi unutar arrow funkcija, pa se poziv preskače.',
        },
        {
          id: 'd',
          text: 'push je asinhrona operacija koja se izvrši tek nakon return-a.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Array.prototype.forEach ignoriše povratnu vrijednost callback-a, pa ne zna da je to Promise i ne čeka ga. Svaka iteracija pokrene svoju async funkciju, a spoljna funkcija nastavi i vrati results prije nego što bilo koji await završi. Za paralelno izvršavanje koristi se Promise.all(ids.map(...)), a za jedno po jedno for...of petlja sa await.\n\nKako to reći na intervjuu: "forEach ne čeka async callback-e. Za paralelni rad koristim Promise.all sa map, a za sekvencijalni for...of sa await."',
    },
    {
      id: 'q7',
      prompt: `Kod:

const state = { user: { name: 'Ana' }, tags: ['a'] };
const copy = { ...state };
copy.user.name = 'Marko';
copy.tags = [...copy.tags, 'b'];

Šta je tačno nakon izvršavanja?`,
      options: [
        {
          id: 'a',
          text: "state.user.name je i dalje 'Ana', jer spread operator pravi duboku kopiju.",
        },
        {
          id: 'b',
          text: "state.user.name je 'Marko', a state.tags je ['a', 'b'], jer spread dijeli sve reference.",
        },
        {
          id: 'c',
          text: 'Ni state.user.name ni state.tags se ne mijenjaju, jer je copy potpuno nezavisan objekat.',
        },
        {
          id: 'd',
          text: "state.user.name je 'Marko' jer spread pravi samo plitku kopiju (user je ista referenca), dok state.tags ostaje ['a'] jer je copy.tags dodijeljen novim nizom. Za duboku kopiju koristi structuredClone ili imutabilno ažuriraj i ugniježdene dijelove.",
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Objekti i nizovi se prenose po referenci. Spread ({ ...obj }) kopira samo prvi nivo: ugniježdeni objekti ostaju zajednički. Zato mutacija copy.user mijenja i state.user. Dodjela novog niza copy.tags mijenja samo copy, a ne state. Ovo je česti izvor bugova u state managementu i razlog zašto se ugniježdena stanja ažuriraju imutabilno ili preko structuredClone.\n\nKako to reći na intervjuu: "Spread je plitka kopija, pa ugniježdeni objekti dijele referencu. Za duboku kopiju koristim structuredClone, a za stanje radim imutabilne izmjene na svakom nivou koji se mijenja."',
    },
    {
      id: 'q8',
      prompt: `HTML: <p id="note" class="text highlight">Hi</p>

CSS (ovim redom u fajlu):
p { color: blue; }
.text { color: green; }
#note { color: red; }
.text.highlight { color: orange; }

Koje boje je tekst i zašto?`,
      options: [
        {
          id: 'a',
          text: 'Narandžasta, jer je posljednje deklarisano pravilo uvijek jače.',
        },
        {
          id: 'b',
          text: 'Plava, jer selektor po tagu ima prioritet nad klasama.',
        },
        {
          id: 'c',
          text: 'Crvena: specifičnost (ID > klasa > tag) ima prednost nad redoslijedom. Redoslijed odlučuje tek kad je specifičnost ista, a iznad su inline stil i !important.',
        },
        {
          id: 'd',
          text: 'Zelena, jer je prva klasa na elementu ona koja se primjenjuje.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Cascade odlučuje koje pravilo pobjeđuje: (1) važnost (!important), (2) specifičnost selektora (ID je jači od klase, klasa od taga, inline stil je iznad svega bez !important), (3) redoslijed pojavljivanja kad je sve ostalo jednako. #note (1,0,0) pobjeđuje .text.highlight (0,2,0) iako je ovaj kasnije. Dobra praksa je držati specifičnost niskom (klase) i izbjegavati !important.\n\nKako to reći na intervjuu: "Prvo gledam važnost, pa specifičnost, pa redoslijed. ID pobjeđuje klase bez obzira na redoslijed. Zato držim selektore jednostavnim i izbjegavam !important."',
    },
    {
      id: 'q9',
      prompt:
        'Trebaš (1) navigacioni red sa linkovima u liniji s razmacima i (2) layout stranice sa headerom, sidebar-om, sadržajem i footerom raspoređenim u redove i kolone. Takođe moraš podržati mobilne uređaje.\n\nKoji izbor je najprirodniji?',
      options: [
        {
          id: 'a',
          text: 'Grid za oboje, jer Flexbox ne podržava razmake ni poravnanje.',
        },
        {
          id: 'b',
          text: 'Flexbox za jednodimenzionalni raspored (red ili kolona), npr. navigaciju; Grid za dvodimenzionalni raspored (redovi i kolone istovremeno). Responsivnost: mobile-first, media/container queries i relativne jedinice.',
        },
        {
          id: 'c',
          text: 'Flexbox za layout cijele stranice, a Grid samo za tabele sa podacima.',
        },
        {
          id: 'd',
          text: 'float i table layout, jer su najkompatibilniji i ne traže media queries.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Flexbox je jednodimenzionalan: raspoređuje elemente duž jedne ose i odlično radi za navigacije, toolbar-e i kartice u redu. Grid je dvodimenzionalan: definišeš redove i kolone i smještaš elemente u ćelije, pa je pogodan za layout stranice. Mobile-first znači da pišeš osnovne stilove za male ekrane, a media query-ji dodaju složenije rasporede za veće. Container queries omogućavaju da komponenta reaguje na veličinu svog kontejnera, a ne ekrana.\n\nKako to reći na intervjuu: "Flexbox koristim kad rasporedom upravljam u jednoj dimenziji, a Grid kad trebam redove i kolone. Dizajniram mobile-first i dodajem breakpoint-e prema sadržaju."',
    },
    {
      id: 'q10',
      prompt:
        'Dropdown meni ima z-index: 9999, a ipak ga prekriva element iz drugog dijela stranice koji ima z-index: 1.\n\nKoji je najvjerovatniji razlog?',
      options: [
        {
          id: 'a',
          text: 'z-index vrijednosti iznad 999 browseri ignorišu.',
        },
        {
          id: 'b',
          text: 'z-index radi samo na div elementima, a ne na listama.',
        },
        {
          id: 'c',
          text: 'To je poznati bug browsera koji se rješava samo dodavanjem !important.',
        },
        {
          id: 'd',
          text: 'Dropdown je unutar stacking contexta roditelja (npr. roditelj ima position + z-index, transform, opacity < 1 ili filter), pa se njegov z-index poredi samo unutar tog konteksta, dok se cijeli kontekst poredi sa susjedom. Rješenje: ukloniti uzrok konteksta ili premjestiti dropdown (portal/overlay) na viši nivo DOM-a.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Stacking context je "zatvorena kutija" redoslijeda slojeva. Novi kontekst stvaraju npr. position sa z-index, transform, opacity manji od 1, filter, will-change. Z-index djeteta ima značenje samo unutar roditeljskog konteksta, pa ni 9999 ne može "izaći" iznad elementa koji je u višem kontekstu. Zato se modali i dropdown-i često renderuju na kraju body-ja (portal, CDK overlay).\n\nKako to reći na intervjuu: "z-index važi samo unutar stacking contexta. Tražim koji roditelj stvara kontekst, a overlay elemente renderujem blizu korijena DOM-a da izbjegnem taj problem."',
    },
    {
      id: 'q11',
      prompt: `Petlja:

for (const el of items) {
  el.style.width = box.offsetWidth + 10 + 'px';
}

Stranica je spora pri većem broju elemenata. Šta je problem i kako ga ublažiti?`,
      options: [
        {
          id: 'a',
          text: 'Petlja naizmjenično piše stil i čita svojstvo koje zahtijeva layout (offsetWidth), pa browser pri svakoj iteraciji mora sinhrono preračunati layout (layout thrashing). Rješenje: prvo sva čitanja pa sva pisanja, grupisati u requestAnimationFrame, a za animacije koristiti transform/opacity koji se mogu izvesti bez reflow-a.',
        },
        {
          id: 'b',
          text: 'Nema problema; browser uvijek grupiše sve izmjene stila i layout računa samo jednom na kraju.',
        },
        {
          id: 'c',
          text: 'Problem je što je petlja napisana sa for...of; klasična for petlja je kudikamo brža u browseru.',
        },
        {
          id: 'd',
          text: 'offsetWidth je asinhrono svojstvo, pa se vrijednost čita prije nego što je izračunata.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Browser odlaže izračunavanje layouta kad može (izmjene stila se "gomilaju"). Čim kod pročita svojstvo koje zavisi od layouta (offsetWidth, getBoundingClientRect, scrollTop), browser mora odmah izvršiti layout da bi vratio tačnu vrijednost. Ako se čitanje i pisanje miješaju u petlji, layout se računa iznova u svakoj iteraciji. Izbjegava se grupisanjem čitanja i pisanja. Za animacije su transform i opacity povoljni jer se mogu obraditi na compositor-u bez ponovnog layouta.\n\nKako to reći na intervjuu: "Miješanje čitanja layouta i pisanja stilova izaziva forsirane reflow-ove. Grupišem čitanja pa pisanja, a animacije radim transformom i opacity-jem."',
    },
    {
      id: 'q12',
      prompt:
        'Lighthouse izvještaj: LCP 4.8 s (hero slika), CLS 0.35 (banner se ubacuje i gura sadržaj), INP 450 ms (klik na filter blokira UI).\n\nKoji par "metrika → najizglednija popravka" je tačan?',
      options: [
        {
          id: 'a',
          text: 'LCP: dodati više animacija; CLS: ukloniti hero sliku; INP: povećati veličinu fonta.',
        },
        {
          id: 'b',
          text: 'LCP: optimizovati i preload-ovati hero sliku (format, dimenzije, bez lazy loada iznad prijeloma); CLS: rezervisati prostor za banner (width/height, aspect-ratio, min-height); INP: razbiti dugi JS zadatak, odgoditi težak posao (debounce, Web Worker, prepuštanje main thread-a).',
        },
        {
          id: 'c',
          text: 'LCP: minifikovati HTML; CLS: dodati više JavaScripta za pozicioniranje; INP: onemogućiti klikove dok se stranica ne učita.',
        },
        {
          id: 'd',
          text: 'Sve tri metrike se popravljaju isključivo brzim serverom; front-end nema uticaja.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'LCP (Largest Contentful Paint) mjeri koliko brzo se prikaže najveći vidljivi element, pa pomažu optimizacija slike, preload i brz server. CLS (Cumulative Layout Shift) mjeri neočekivano pomjeranje sadržaja; popravlja se rezervisanjem prostora za slike, reklame i bannere. INP (Interaction to Next Paint) mjeri reaktivnost na interakcije; popravlja se smanjenjem dugih JS zadataka na main thread-u.\n\nKako to reći na intervjuu: "LCP je brzina prikaza glavnog sadržaja, CLS stabilnost layouta, INP reaktivnost na interakciju. Za svaku znam tipičan uzrok: velika slika, nerezervisan prostor, dugi JS zadatak."',
    },
    {
      id: 'q13',
      prompt:
        'Nakon deploya neki korisnici i dalje vide staru verziju aplikacije jer je browser keširao main.js.\n\nKoja strategija je standardna i zašto?',
      options: [
        {
          id: 'a',
          text: 'Isključiti kešovanje svih fajlova zauvijek (Cache-Control: no-store), da se uvijek preuzima najnovija verzija.',
        },
        {
          id: 'b',
          text: 'Zamoliti korisnike da ručno očiste keš nakon svakog deploya.',
        },
        {
          id: 'c',
          text: 'Fajlovi sa hash-om u imenu (main.3fa9c1.js) keširaju se dugo (Cache-Control: max-age=31536000, immutable), a index.html se ne kešira dugo (no-cache, revalidacija putem ETag-a), pa uvijek pokazuje na nove hash-irane fajlove.',
        },
        {
          id: 'd',
          text: 'Dodati nasumičan parametar (?v=123) ručno u svaki URL nakon svakog deploya.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Ideja je kombinovati dugo keširanje sa "cache busting" imenima. Sadržaj fajla određuje hash u imenu: kad se kod promijeni, promijeni se i ime, pa stari keš ne smeta. index.html je ulazna tačka koja referencira te fajlove, pa mora ostati svjež (no-cache znači "validiraj prije upotrebe", ne "nemoj keširati"). Angular build to radi automatski (outputHashing).\n\nKako to reći na intervjuu: "Statičke fajlove sa hash-om keširam godinu dana jer se ime mijenja sa sadržajem, a index.html držim svježim da uvijek pokazuje na nove hash-irane fajlove."',
    },
    {
      id: 'q14',
      prompt:
        "Frontend na https://app.example.com poziva https://api.example.com i dobijaš 'blocked by CORS policy'. Kolega predlaže: 'isključi CORS u browseru pa radi'.\n\nŠta je tačno o CORS-u?",
      options: [
        {
          id: 'a',
          text: 'CORS je browser mehanizam (same-origin policy) čije izuzetke server odobrava zaglavljima poput Access-Control-Allow-Origin; za ne-jednostavne zahtjeve browser prvo šalje preflight (OPTIONS). Ispravan fix je konfiguracija servera (ili dev proxy); isključivanje u browseru samo maskira problem i ne štiti API jer drugi klijenti (curl) ionako ne poštuju CORS.',
        },
        {
          id: 'b',
          text: 'CORS je sigurnosna zaštita servera od loših klijenata; server odbija zahtjeve i zato se javlja greška.',
        },
        {
          id: 'c',
          text: 'CORS greške proizvodi Angular HttpClient; rješenje je koristiti fetch umjesto njega.',
        },
        {
          id: 'd',
          text: 'Rješava se dodavanjem zaglavlja Access-Control-Allow-Origin u frontend zahtjev.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Same-origin policy sprječava da stranica sa jednog origin-a (protokol + domen + port) čita odgovore drugog. CORS je kontrolisano popuštanje te politike: server kaže koji origin-i, metode i zaglavlja su dozvoljeni. Zaglavlje Access-Control-Allow-Origin postavlja SERVER u odgovoru, pa ga klijent ne može "dodati" u zahtjev. CORS štiti korisnikov browser, a ne server: API se štiti autentifikacijom i autorizacijom.\n\nKako to reći na intervjuu: "CORS je mehanizam browsera, a server odobrava izuzetke zaglavljima. Rješenje je konfiguracija na serveru ili proxy u razvoju. CORS ne štiti API, za to služi autentifikacija."',
    },
    {
      id: 'q15',
      prompt: 'Gdje čuvati JWT i kako Angular pomaže protiv XSS-a?',
      options: [
        {
          id: 'a',
          text: 'Uvijek u localStorage jer je najjednostavnije; Angular ne radi ništa protiv XSS-a.',
        },
        {
          id: 'b',
          text: 'httpOnly cookie je nesigurniji od localStorage jer ga server može vidjeti.',
        },
        {
          id: 'c',
          text: 'XSS je isključivo serverski problem i frontend ne može ništa da uradi po tom pitanju.',
        },
        {
          id: 'd',
          text: 'Angular po defaultu escapuje interpolaciju i sanitizuje vezivanje na [innerHTML], a bypassSecurityTrust* to isključuje pa ga treba izbjegavati. Token u localStorage može pročitati svaka XSS skripta; httpOnly (Secure, SameSite) cookie JavaScript ne može pročitati, ali tada je potrebna CSRF zaštita. Svaki izbor je kompromis.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'XSS znači da napadač ubaci skriptu u tvoju stranicu. Angular tretira sve vrijednosti u template-u kao nepouzdane i escapuje ih ili sanitizuje, osim ako ručno koristiš bypassSecurityTrustHtml. localStorage je dostupan svakoj skripti na stranici, pa XSS može ukrasti token. httpOnly cookie nije dostupan JS-u, ali se automatski šalje uz zahtjeve, pa je potrebna CSRF zaštita (SameSite, CSRF token). Dodatni slojevi: Content-Security-Policy, kratkotrajni tokeni, refresh rotacija.\n\nKako to reći na intervjuu: "Angular me štiti escapovanjem i sanitizacijom, ako ne zaobilazim to bypass-om. Token u httpOnly cookie-ju je otporniji na XSS, ali traži CSRF zaštitu, pa je to kompromis koji biram prema aplikaciji."',
    },
    {
      id: 'q16',
      prompt:
        'Trebaš sačuvati:\n(1) draft dugog obrasca dok korisnik ne zatvori tab,\n(2) preferencu teme trajno,\n(3) veliku offline kolekciju podataka sa pretragom po indeksima,\n(4) identifikator sesije koji server čita uz svaki zahtjev.\n\nKoji mapping je najbolji?',
      options: [
        {
          id: 'a',
          text: '(1) cookie, (2) IndexedDB, (3) sessionStorage, (4) localStorage',
        },
        {
          id: 'b',
          text: '(1) sessionStorage, (2) localStorage, (3) IndexedDB, (4) cookie (httpOnly, Secure)',
        },
        {
          id: 'c',
          text: 'Sve u localStorage; jednostavno je i dovoljno za sve slučajeve.',
        },
        {
          id: 'd',
          text: '(1) localStorage, (2) sessionStorage, (3) cookie, (4) IndexedDB',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'sessionStorage živi dok je tab otvoren (dobar za privremeni draft). localStorage je trajan, sinhron i ograničen (~5 MB), pa je prikladan za male preference poput teme. IndexedDB je asinhrona baza za velike, strukturirane podatke sa indeksima. Cookie se automatski šalje serveru uz svaki zahtjev, pa je prirodan za sesiju (uz httpOnly i Secure). localStorage je sinhron i blokira main thread, pa nije za velike količine podataka.\n\nKako to reći na intervjuu: "Biram prema životnom vijeku i veličini: sessionStorage za tab, localStorage za male trajne postavke, IndexedDB za velike podatke, a cookie kad server treba vrijednost uz svaki zahtjev."',
    },
    {
      id: 'q17',
      prompt:
        "Kolega pravi dugme kao <div class='btn' (click)='save()'>Sačuvaj</div>.\n\nŠta je problem i kako popraviti?",
      options: [
        {
          id: 'a',
          text: 'Nema problema; stilizovan div izgleda isto kao dugme pa ga korisnici ne razlikuju.',
        },
        {
          id: 'b',
          text: 'Problem je samo boja teksta; dovoljno je povećati kontrast.',
        },
        {
          id: 'c',
          text: 'Div nema semantiku ni tastatursku podršku: nije fokusabilan, ne reaguje na Enter/Space i čitač ekrana ga ne najavljuje kao dugme. Ispravno je <button type="button">. ARIA (role, tabindex, key handleri) je zakrpa kad nativni element nije opcija, jer je prvo pravilo ARIA-e koristiti nativni element.',
        },
        {
          id: 'd',
          text: 'Dovoljno je dodati aria-label="dugme" i sve je pristupačno.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Semantički HTML daje besplatno ponašanje: <button> je fokusabilan, aktivira se tasterima Enter i Space, ima ispravnu ulogu za čitače ekrana i može biti onemogućen (disabled). Div sve to mora ručno naknadno dobiti (role="button", tabindex="0", key handleri), što je lako pogrešno uraditi. Pristupačnost uključuje i kontrast, vidljiv fokus, alt tekst na slikama, labele na poljima formi i navigaciju tastaturom.\n\nKako to reći na intervjuu: "Uvijek krećem od semantičkog HTML-a: button za akcije, a za linkove a. ARIA dodajem tek kad nativni element ne postoji. Provjerim i navigaciju tastaturom i čitač ekrana."',
    },
    {
      id: 'q18',
      prompt: `TypeScript:

const a: any = JSON.parse(text);
const b: unknown = JSON.parse(text);

a.user.name.toUpperCase();
b.user.name.toUpperCase();

Koja je razlika između any i unknown?`,
      options: [
        {
          id: 'a',
          text: 'any isključuje provjeru tipova (sve je dozvoljeno, a greške se otkriju tek u runtime-u). unknown je type-safe: prije upotrebe moraš suziti tip (typeof, instanceof, type guard ili validacija npr. Zod-om), pa je bolji za podatke spolja (API, JSON.parse).',
        },
        {
          id: 'b',
          text: 'Nema razlike; oba se ponašaju isto i koriste se naizmjenično.',
        },
        {
          id: 'c',
          text: 'unknown troši više memorije u runtime-u, pa se any preferira u performance-kritičnom kodu.',
        },
        {
          id: 'd',
          text: 'any je stroži od unknown i zahtijeva eksplicitnu provjeru prije svake upotrebe.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'any je "izlaz iz tip-sistema": kompajler ne provjerava ništa, pa greške poput pristupa svojstvu na undefined ostaju skrivene do runtime-a. unknown znači "ne znam tip": možeš ga dodijeliti bilo čemu, ali prije upotrebe moraš dokazati tip (suženje). U primjeru, b.user.name bi bio greška pri kompajliranju dok ne provjeriš strukturu. TypeScript tipovi ne postoje u runtime-u, pa za podatke iz mreže treba i runtime validacija.\n\nKako to reći na intervjuu: "any gasi provjeru tipova, a unknown me tjera da prvo provjerim tip. Za podatke izvana koristim unknown i validaciju, jer TypeScript tipovi ne postoje u runtime-u."',
    },
    {
      id: 'q19',
      prompt:
        'API vraća 401 kad korisnik nije prijavljen, a 403 kad je prijavljen ali nema pravo pristupa.\n\nKoja je razlika između 401 i 403, i između PUT, PATCH i POST?',
      options: [
        {
          id: 'a',
          text: '401 i 403 su isto; PUT, PATCH i POST su takođe zamjenjivi i razlikuju se samo po imenu.',
        },
        {
          id: 'b',
          text: '401 znači da je server pao, a 403 da je resurs obrisan; PUT kreira, a POST briše resurs.',
        },
        {
          id: 'c',
          text: '401 znači da resurs ne postoji, a 403 da je zahtjev pogrešno formatiran; PATCH uvijek zamjenjuje cijeli resurs.',
        },
        {
          id: 'd',
          text: '401 = neautentifikovan (identitet nepoznat ili nevažeći, treba login/refresh); 403 = autentifikovan ali neautorizovan. PUT zamjenjuje cijeli resurs i idempotentan je, PATCH parcijalno mijenja, a POST kreira resurs ili pokreće akciju i nije idempotentan.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Autentifikacija odgovara na pitanje "ko si ti?" (401), a autorizacija na "smiješ li ti ovo?" (403). Idempotentnost znači da ponovljeni isti zahtjev ima isti efekat kao jedan: GET, PUT i DELETE jesu, a POST tipično nije. Zato se na klijentu 401 obično obrađuje osvježavanjem tokena ili preusmjeravanjem na login, a 403 prikazom poruke o nedostatku prava.\n\nKako to reći na intervjuu: "401 je problem identiteta, 403 problem prava. PUT je idempotentna zamjena, PATCH parcijalna izmjena, a POST kreira i nije idempotentan, što je bitno kod retry logike."',
    },
    {
      id: 'q20',
      prompt:
        "Tri situacije:\n(1) korisnik kuca u polje za pretragu koje gađa API,\n(2) korisnik skroluje stranicu, a ti ažuriraš indikator progresa,\n(3) klik na 'Kupi' ne smije poslati zahtjev dvaput.\n\nKoje tehnike najbolje odgovaraju (redom)?",
      options: [
        {
          id: 'a',
          text: '(1) throttle, (2) debounce, (3) throttle',
        },
        {
          id: 'b',
          text: '(1) debounce (čeka pauzu u kucanju), (2) throttle (najviše jednom u intervalu), (3) ignorisati dodatne klikove dok je zahtjev u toku (disable dugmeta, flag ili exhaustMap).',
        },
        {
          id: 'c',
          text: 'Sve tri situacije rješava debounce, jer je debounce univerzalno rješenje.',
        },
        {
          id: 'd',
          text: 'Nijedna tehnika nije potrebna; browser sam ograničava učestalost događaja.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Debounce čeka da događaji prestanu (npr. 300 ms tišine) pa izvrši akciju jednom, što je idealno za pretragu dok se kuca. Throttle garantuje najviše jedno izvršavanje u zadatom intervalu, što je dobro za kontinuirane događaje (scroll, resize, mousemove). Za akciju poput kupovine cilj nije odgoditi ni usporiti, nego spriječiti duplo izvršavanje dok je prvo u toku, pa se dugme onemogući ili se ignorišu dodatni klikovi (exhaustMap u RxJS-u).\n\nKako to reći na intervjuu: "Debounce čeka pauzu, throttle ograničava učestalost, a za dvostruki klik na kritičnu akciju ignorišem nove klikove dok je prvi zahtjev u toku."',
    },
  ],
};
