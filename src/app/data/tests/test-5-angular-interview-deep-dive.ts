import { QuizTest } from '../../models/question.model';

/**
 * Test 5: Angular interview deep-dive.
 * Cilj: ne samo prepoznati tačan odgovor, nego ga i objasniti svojim riječima.
 * Savjet: prije nego pogledaš opcije, pokušaj naglas odgovoriti na pitanje.
 * Svako objašnjenje završava dijelom "Kako to reći na intervjuu".
 */
export const test5AngularInterviewDeepDive: QuizTest = {
  id: 'test-5-angular-interview-deep-dive',
  title: 'Test 5: Angular Interview Deep-Dive',
  description:
    'Change detection, RxJS, DI, forme, routing, performanse, SSR, testiranje i arhitektura. Scenario pitanja za vježbu objašnjavanja.',
  questions: [
    {
      id: 'q1',
      prompt:
        "Intervjuer pita: 'Kako Angular zna kad treba ažurirati view nakon što korisnik klikne dugme ili stigne HTTP odgovor, i šta se mijenja u zoneless pristupu?'\n\nKoji odgovor je najpotpuniji i tačan?",
      options: [
        {
          id: 'a',
          text: 'Angular interno pokreće timer i svake sekunde provjerava sve komponente; zoneless taj timer zamjenjuje sa requestAnimationFrame-om.',
        },
        {
          id: 'b',
          text: 'Angular ugrađuje Proxy oko svakog polja klase i prati svaku promjenu; zoneless samo isključuje Proxy radi brzine.',
        },
        {
          id: 'c',
          text: 'Zone.js patch-uje async API-je (događaje, timere, promise-e), pa Angular nakon svakog takvog zadatka pokrene change detection; zoneless to izbacuje, a osvježavanje pokreću signali, događaji u template-u, markForCheck i slični okidači.',
        },
        {
          id: 'd',
          text: 'Change detection se pokreće isključivo ručnim pozivom ApplicationRef.tick(); Zone.js služi samo za logovanje grešaka.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Zone.js "omota" browser API-je. Kad se neki async zadatak završi, NgZone obavijesti Angular da nešto možda jeste promijenilo stanje, pa on prođe kroz stablo komponenti. Posljedica je da se provjera pokreće i kad se ništa relevantno nije desilo. U zoneless pristupu nema patch-ovanja: Angular se osvježava kad ga signal, događaj vezan u template-u, markForCheck ili sličan okidač eksplicitno obavijesti. Rezultat je manji bundle, bolje performanse i lakše debugovanje stack trace-ova.\n\nKako to reći na intervjuu: "Zone.js presreće async operacije i nakon svake pokrene change detection. Zoneless to zamjenjuje eksplicitnim okidačima, prije svega signalima, pa se provjerava samo ono što je stvarno promijenjeno."',
      hint: 'Razmisli o tome ko Angularu javlja da se nešto desilo.',
    },
    {
      id: 'q2',
      prompt:
        'U dev modu dobiješ grešku NG0100 (ExpressionChangedAfterItHasBeenCheckedError). Child komponenta u ngAfterViewInit promijeni polje koje je već prikazano u template-u roditelja.\n\nŠta ta greška zapravo znači i kako je ispravno riješiti?',
      options: [
        {
          id: 'a',
          text: 'Template je sintaksno neispravan; rješenje je dodati ?. operator na sve izraze u njemu.',
        },
        {
          id: 'b',
          text: 'Angular u dev modu nakon provjere odmah napravi drugi prolaz i uporedi vrijednosti; ako se izraz promijenio, prikazan je zastarjeli rezultat. Pravi fix je pomjeriti promjenu stanja prije renderovanja ili je modelovati signalom/izvedenom vrijednošću, a ne gušiti grešku.',
        },
        {
          id: 'c',
          text: 'Greška se javlja samo u produkcijskom build-u zbog minifikacije; rješenje je isključiti optimizaciju.',
        },
        {
          id: 'd',
          text: 'Uzrok je dvostruki subscribe na isti Observable; rješenje je dodati take(1) u pipe.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Angular u dev modu nakon provjere radi dodatni prolaz kao sigurnosnu provjeru da se izrazi nisu promijenili. Ako jesu, view je prikazao vrijednost koja više ne važi, pa se baca greška. Česti uzrok je child koji u ngAfterViewInit ili ngOnInit mijenja stanje koje roditelj već prikazuje. Zakrpe poput setTimeout() ili detectChanges() mogu ućutkati grešku, ali ne uklanjaju uzrok. Bolje je promijeniti tok podataka: izračunati vrijednost ranije, koristiti computed() ili signal, ili je ne mijenjati "unazad" iz djeteta.\n\nKako to reći na intervjuu: "To je dev-mode provjera konzistentnosti. Znači da je stanje promijenjeno nakon što je već prikazano. Ne krijem grešku setTimeout-om, nego popravljam tok podataka."',
    },
    {
      id: 'q3',
      prompt:
        "Kolega pita: 'Zašto Angular (HttpClient) koristi Observable kad bi Promise radio isto?'\n\nKoji odgovor najbolje objašnjava razliku?",
      options: [
        {
          id: 'a',
          text: 'Observable je samo sporija verzija Promise-a; Angular ga koristi iz historijskih razloga i nema praktične prednosti.',
        },
        {
          id: 'b',
          text: 'Promise je lijen i može se otkazati, dok je Observable eager i ne može se otkazati nakon pokretanja.',
        },
        {
          id: 'c',
          text: 'Observable radi isključivo sinhrono, a Promise isključivo asinhrono, pa je Observable pogodniji za UI.',
        },
        {
          id: 'd',
          text: 'Observable je lijen (ništa se ne dešava dok se ne pretplatiš), može emitovati više vrijednosti tokom vremena, može se otkazati unsubscribe-om i ima bogate operatore za kompoziciju. Promise je eager, daje jednu vrijednost i ne može se otkazati.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Ključne razlike: (1) lijenost: Promise se izvršava odmah pri kreiranju, Observable tek pri subscribe-u; (2) broj vrijednosti: Promise jednu, Observable nula ili više; (3) otkazivanje: unsubscribe može prekinuti posao (npr. HTTP zahtjev), Promise ne; (4) operatori: switchMap, debounceTime, retry, combineLatest i slično. Za jedan HTTP poziv koji emituje jednom i završi, razlika je mala, ali se prednosti vide kod pretrage, streamova i kompozicije.\n\nKako to reći na intervjuu: "Observable je lijen, može emitovati više vrijednosti, može se otkazati i kompozira se operatorima. Zato je dobar za tokove događaja, dok Promise daje jednu vrijednost i ne može se otkazati."',
    },
    {
      id: 'q4',
      prompt:
        "Tri scenarija:\n(1) polje za pretragu koje šalje upit dok korisnik kuca,\n(2) dugme 'Sačuvaj' koje korisnik može kliknuti više puta zaredom,\n(3) red uploada fajlova koji moraju ići jedan za drugim.\n\nKoji flattening operatori (redom) najbolje odgovaraju?",
      options: [
        { id: 'a', text: 'concatMap, switchMap, mergeMap' },
        { id: 'b', text: 'switchMap, exhaustMap, concatMap' },
        { id: 'c', text: 'mergeMap, mergeMap, mergeMap' },
        { id: 'd', text: 'exhaustMap, concatMap, switchMap' },
      ],
      correctOptionId: 'b',
      explanation:
        'switchMap otkazuje prethodni unutrašnji Observable kad stigne nova vrijednost, što je idealno za pretragu jer zanimaju samo najnoviji rezultati. exhaustMap ignoriše nove vrijednosti dok je prethodni još aktivan, pa štiti od dvostrukog klika na "Sačuvaj". concatMap stavlja vrijednosti u red i izvršava ih jednu po jednu, pa čuva redoslijed uploada. mergeMap ih pokreće paralelno, bez garancije redoslijeda, što je dobro kad su zahtjevi nezavisni.\n\nKako to reći na intervjuu: "Biram operator prema pitanju šta se dešava sa novom vrijednošću dok je stara još u toku: switchMap je otkaže, exhaustMap je ignoriše, concatMap je stavi u red, mergeMap radi sve paralelno."',
      hint: 'Za svaki scenarij pitaj: šta treba da se desi sa novim događajem dok je stari još u toku?',
    },
    {
      id: 'q5',
      prompt:
        "Kod:\n\nngOnInit() {\n  this.route.params.subscribe(p => this.load(p['id']));\n  interval(1000).subscribe(n => this.tick = n);\n  this.http.get('/api/me').subscribe(u => this.user = u);\n}\n\nKomponenta se često kreira i uništava. Koje pretplate su stvaran rizik od memory leak-a i šta je preporučen način čišćenja?",
      options: [
        {
          id: 'a',
          text: 'Sve tri cure jednako, pa se uvijek mora ručno unsubscribe-ovati sve, uključujući HTTP.',
        },
        {
          id: 'b',
          text: 'Nijedna ne cura, jer Angular sam otkazuje sve pretplate kad se komponenta uništi.',
        },
        {
          id: 'c',
          text: 'Stvaran problem je interval(): nikad ne završava, nastavlja raditi i držati referencu na komponentu nakon uništenja. HTTP završava sam, a ActivatedRoute observable-e čisti router. Za čišćenje: takeUntilDestroyed(), async pipe ili toSignal().',
        },
        {
          id: 'd',
          text: 'Samo HTTP poziv cura jer drži otvorenu konekciju; interval i route.params su bezbjedni.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Rizik imaju beskonačni ili dugovječni tokovi (interval, fromEvent na window, Subject-i iz servisa). Observable-i koji sami završe (HttpClient) ne cure, a ActivatedRoute observable-e Angular čisti kad se komponenta uništi. Moderni pristup: takeUntilDestroyed() (u injection contextu ili sa DestroyRef), async pipe u template-u ili toSignal(), koji se sam odpretplati.\n\nKako to reći na intervjuu: "Ručno čistim samo tokove koji ne završavaju sami. Najčešće koristim async pipe, toSignal ili takeUntilDestroyed, da čišćenje bude vezano za životni ciklus komponente i da ga ne mogu zaboraviti."',
    },
    {
      id: 'q6',
      prompt:
        "Kod:\n\nusers$ = this.http.get<User[]>('/api/users');\n\nTemplate na jednom mjestu ima @if (users$ | async; as users), a na drugom {{ (users$ | async)?.length }}. U Network tabu vidiš dva identična zahtjeva.\n\nZašto i kako to riješiti?",
      options: [
        {
          id: 'a',
          text: 'To je bug u browseru koji duplira GET zahtjeve; nema rješenja osim keširanja na serveru.',
        },
        {
          id: 'b',
          text: 'async pipe uvijek šalje zahtjev dvaput radi provjere; rješenje je ChangeDetectionStrategy.OnPush.',
        },
        {
          id: 'c',
          text: 'Problem je što je HTTP Observable hot; rješenje je pretvoriti ga u cold pomoću defer().',
        },
        {
          id: 'd',
          text: 'HTTP Observable je cold: svaki subscribe (svaki async pipe) pokreće novi zahtjev. Rješenje je podijeliti tok (shareReplay({ bufferSize: 1, refCount: true })) ili se pretplatiti jednom (async as users / toSignal) i čitati rezultat na više mjesta.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Cold Observable pokreće svoj izvor za svakog pretplatnika. Zato dva async pipe-a znače dva HTTP poziva. Hot Observable (npr. Subject) emituje svima isti tok. Dijeljenje se radi sa shareReplay/share, ili tako što se podaci jednom pretvore u signal (toSignal) ili u lokalnu varijablu preko @if (... | async; as x).\n\nKako to reći na intervjuu: "HttpClient vraća cold Observable, pa svaki subscribe šalje novi zahtjev. Ili se pretplatim jednom i rezultat koristim na više mjesta, ili tok podijelim sa shareReplay."',
    },
    {
      id: 'q7',
      prompt:
        'Trebaš da svaki HTTP zahtjev nosi Authorization header i da se na 401 korisnik preusmjeri na login.\n\nKoji pristup je ispravan u modernom Angularu?',
      options: [
        {
          id: 'a',
          text: 'Ručno dodati header u svaki servis koji zove API, a 401 hvatati preko window.onerror.',
        },
        {
          id: 'b',
          text: 'Funkcionalni interceptor registrovan u provideHttpClient(withInterceptors([...])). Zahtjev je immutable, pa se header dodaje preko req.clone({ setHeaders }), a 401 hvata sa catchError na next(req).',
        },
        {
          id: 'c',
          text: 'Direktno mijenjati originalni HttpRequest (req.headers.set(...)), jer je mutabilan i interceptori ne smiju praviti klon.',
        },
        {
          id: 'd',
          text: 'Interceptori su uklonjeni iz Angulara; jedina opcija je monkey-patch XMLHttpRequest-a.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Interceptor je centralno mjesto za presretanje svih zahtjeva i odgovora: auth header, logovanje, globalna obrada grešaka, loading indikator. HttpRequest je immutable, pa se mijenja kloniranjem. Redoslijed interceptora u nizu je bitan jer ide "kroz lanac". Class-based interceptori i dalje postoje (withInterceptorsFromDi), ali je funkcionalni oblik preporučen.\n\nKako to reći na intervjuu: "Za cross-cutting stvari koristim funkcionalni interceptor: klonira zahtjev sa tokenom, a u catchError obradi 401. Tako ta logika postoji na jednom mjestu, a ne u svakom servisu."',
    },
    {
      id: 'q8',
      prompt:
        'Želiš da aplikacija dobije konfiguraciju { apiUrl: string } i da u testovima možeš lako zamijeniti vrijednost. TypeScript interfejs ne postoji u runtime-u.\n\nKako to ispravno riješiti u DI sistemu?',
      options: [
        {
          id: 'a',
          text: 'Injektovati interfejs direktno (inject(AppConfig)), jer TypeScript interfejsi postoje i u runtime-u.',
        },
        {
          id: 'b',
          text: 'Čuvati konfiguraciju u globalnoj varijabli window.config; DI se ne koristi za konfiguraciju.',
        },
        {
          id: 'c',
          text: "Napraviti InjectionToken<AppConfig>('APP_CONFIG'), registrovati ga ({ provide: APP_CONFIG, useValue: {...} }) i injektovati sa inject(APP_CONFIG); u testu se samo override-uje provider.",
        },
        {
          id: 'd',
          text: 'Napraviti klasu sa @Injectable i instancirati je ručno (new) u svakoj komponenti koja je treba.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'DI koristi "token" kao ključ. Za klase je token sama klasa, a za vrijednosti koje nisu klase (konfiguracija, stringovi, interfejsi) koristi se InjectionToken. Provider može koristiti useValue, useClass, useFactory ili useExisting. Prednost je što se zavisnost može zamijeniti u testovima ili u drugom okruženju bez izmjene koda koji je koristi.\n\nKako to reći na intervjuu: "Interfejs ne postoji u runtime-u, pa za konfiguraciju pravim InjectionToken i registrujem vrijednost kroz providers. Komponente je dobijaju kroz inject(), a test je lako zamijeni."',
    },
    {
      id: 'q9',
      prompt:
        'Komponenta ima input, koristi DI i prikazuje child view.\n\nKoji je redoslijed lifecycle događaja i zašto se inicijalno učitavanje podataka koje zavisi od input-a radi u ngOnInit, a ne u konstruktoru?',
      options: [
        {
          id: 'a',
          text: 'constructor, ngOnChanges (ako ima input-a), ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterViewInit, ngOnDestroy. U konstruktoru input-i još nisu postavljeni; konstruktor služi za DI i inicijalizaciju polja, a ngOnInit je prvo mjesto gdje su input-i dostupni.',
        },
        {
          id: 'b',
          text: 'ngOnInit, constructor, ngOnChanges, ngAfterViewInit; konstruktor se poziva kasno zato što Angular prvo inicijalizuje template.',
        },
        {
          id: 'c',
          text: 'Svi hook-ovi se pozivaju istovremeno u jednom koraku; redoslijed nije bitan.',
        },
        {
          id: 'd',
          text: 'ngAfterViewInit, ngOnInit, constructor; podaci se učitavaju u ngOnInit jer je to jedini hook u kojem radi HTTP.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Konstruktor je standardni JS/TS koncept: tu se kreira instanca i rješava DI. Angular tek nakon toga postavlja input-e i poziva hook-ove. ngOnChanges se poziva prije ngOnInit kad postoje input-i, ngOnInit jednom nakon prvog postavljanja input-a, a ngAfterViewInit nakon što su view i child-ovi inicijalizovani. Napomena: sa signal input-ima reakciju na promjenu obično radiš preko computed(), effect() ili resource(), pa se ngOnChanges sve rjeđe koristi.\n\nKako to reći na intervjuu: "Konstruktor je za DI i inicijalizaciju polja, a ngOnInit je prvo mjesto gdje su input-i već postavljeni. Sa signal input-ima to često rješavam kroz computed ili resource."',
    },
    {
      id: 'q10',
      prompt:
        'Praviš formu za registraciju sa dinamičkim poljima (korisnik može dodavati više telefonskih brojeva), cross-field validacijom (lozinka mora biti jednaka potvrdi) i jediničnim testovima validacione logike.\n\nKoji pristup biraš i zašto?',
      options: [
        {
          id: 'a',
          text: 'Template-driven forms, jer su validatori definisani u template-u, a dinamička polja su jednostavnija za održavanje.',
        },
        {
          id: 'b',
          text: 'Reactive forms: model (FormGroup/FormArray) i validatori definišu se u TS kodu, što je eksplicitno, sinhrono i lako testabilno; FormArray rješava dinamička polja, a validator na nivou grupe cross-field provjeru.',
        },
        {
          id: 'c',
          text: 'Nema razlike, oba pristupa koriste isti NgModel i izbor je samo stvar stila.',
        },
        {
          id: 'd',
          text: 'Reactive forms ne podržavaju asinhronu validaciju, pa je za ovakve forme jedino template-driven moguć.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Template-driven forme su dobre za jednostavne slučajeve: mala forma, malo logike. Reactive forme daju eksplicitnu kontrolu: model je objekat u kodu, validacija je funkcija koju možeš testirati bez DOM-a, a FormArray i dinamičko dodavanje/uklanjanje kontrola su prirodni. Cross-field validator se stavlja na FormGroup jer ima pristup obje kontrole.\n\nKako to reći na intervjuu: "Za jednostavne forme template-driven je dovoljan. Čim imam dinamička polja, cross-field validaciju ili hoću testirati logiku, biram reactive forme jer je model u kodu, eksplicitan i testabilan."',
    },
    {
      id: 'q11',
      prompt:
        'Async validator koji provjerava da li je username zauzet šalje HTTP zahtjev na svaki pritisak tipke.\n\nŠta je najbolje rješenje?',
      options: [
        {
          id: 'a',
          text: 'Zamijeniti ga sinhronim validatorom koji blokirajuće poziva server.',
        },
        {
          id: 'b',
          text: 'Ukloniti serversku provjeru jer je frontend validacija dovoljna.',
        },
        {
          id: 'c',
          text: 'Onemogućiti kucanje dok prethodni zahtjev ne stigne, da korisnik ne šalje previše upita.',
        },
        {
          id: 'd',
          text: "Postaviti updateOn: 'blur' (validacija tek kad korisnik napusti polje) ili dodati debounce u validator (timer + switchMap); Angular otkazuje prethodnu pending async validaciju kad se vrijednost promijeni. Serverska provjera se ionako zadržava jer klijentu se ne vjeruje.",
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Async validator vraća Observable ili Promise i izvršava se tek kad sinhroni validatori prođu. Angular pretplatu na prethodnu async validaciju prekida kad se vrijednost promijeni, pa debounce (npr. timer(300).pipe(switchMap(...))) znatno smanjuje broj zahtjeva. updateOn ("change", "blur", "submit") određuje kad se validacija uopšte pokreće. Frontend validacija je UX, ne sigurnost, pa server mora sve ponovo provjeriti.\n\nKako to reći na intervjuu: "Smanjim broj zahtjeva debounce-om ili updateOn: blur, a serversku validaciju svejedno zadržavam, jer je klijentska validacija samo za korisničko iskustvo."',
    },
    {
      id: 'q12',
      prompt:
        'Admin dio aplikacije je velik i treba da ga učitavaju samo administratori.\n\nKoje je najbolje rješenje?',
      options: [
        {
          id: 'a',
          text: 'Lazy loading admin ruta (loadChildren/loadComponent) da kod ode u poseban chunk, uz canMatch guard koji provjerava ulogu, pa se chunk uopšte ne preuzme za neadmine. Serverska autorizacija je obavezna jer se klijentski kod može zaobići.',
        },
        {
          id: 'b',
          text: 'Učitati sve eagerly i sakriti admin linkove pomoću @if; time je sigurnost riješena.',
        },
        {
          id: 'c',
          text: 'Koristiti resolver koji baca grešku za neadmine, jer je resolver namijenjen autorizaciji.',
        },
        {
          id: 'd',
          text: 'Držati admin kod u index.html i sakrivati ga CSS-om (display: none) za obične korisnike.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Lazy loading dijeli aplikaciju u chunkove koji se preuzimaju po potrebi. canMatch se evaluira prije učitavanja lazy rute, pa neadmin korisnik ne preuzima ni admin bundle. canActivate se izvršava nakon što je ruta pronađena, a resolver služi za pribavljanje podataka prije aktivacije rute, ne za autorizaciju. Sakrivanje linkova je samo UX. Prava zaštita mora biti na serveru.\n\nKako to reći na intervjuu: "Admin dio lazy-loadam i zaštitim sa canMatch da se chunk ne preuzima za obične korisnike. Guard je UX i optimizacija, prava autorizacija je na backendu."',
    },
    {
      id: 'q13',
      prompt:
        'Tabela sa 10.000 redova je spora: skrolanje se trzka, a inicijalno renderovanje traje nekoliko sekundi.\n\nKoji pristup ima najviše smisla?',
      options: [
        {
          id: 'a',
          text: 'Povećati resurse servera i timeout HTTP poziva; problem je u backendu.',
        },
        {
          id: 'b',
          text: 'Prvo izmjeriti (Angular DevTools profiler, Chrome Performance), pa smanjiti broj DOM čvorova (virtualni scroll iz CDK-a ili paginacija / server-side filtriranje), uz track u @for, OnPush ili signale i izbjegavanje skupih funkcija u template-u.',
        },
        {
          id: 'c',
          text: 'Zamijeniti @for sa *ngFor, jer je stariji i zato brži.',
        },
        {
          id: 'd',
          text: 'Omotati renderovanje u setTimeout da se posao "rasporedi"; broj DOM čvorova nije bitan.',
        },
      ],
      correctOptionId: 'b',
      explanation:
        'Optimizacija počinje mjerenjem, ne nagađanjem. Glavni trošak kod velikih lista je broj DOM čvorova, pa je najveći dobitak virtualni scroll (renderuje se samo vidljivi dio) ili paginacija. Uz to: track izraz da Angular ne pravi DOM ispočetka pri promjeni liste, OnPush/signali da se komponente ne provjeravaju nepotrebno, te da se u template-u ne pozivaju skupe funkcije koje se izvršavaju pri svakom ciklusu.\n\nKako to reći na intervjuu: "Prvo profilišem da vidim šta je usko grlo. Kod velikih lista je to obično broj DOM čvorova, pa koristim virtualni scroll ili paginaciju, a onda tek sitnije optimizacije kao track i OnPush."',
    },
    {
      id: 'q14',
      prompt:
        "Uključio si SSR i hydration. U konstruktoru servisa imaš localStorage.getItem('token') i aplikacija puca na serveru s greškom 'localStorage is not defined'.\n\nŠta se dešava i šta je ispravno rješenje?",
      options: [
        {
          id: 'a',
          text: 'Hydration uvijek briše server DOM i gradi ga ispočetka; rješenje je dodati polyfill za localStorage na serveru.',
        },
        {
          id: 'b',
          text: 'Problem je u TypeScript konfiguraciji; rješenje je isključiti strict mode.',
        },
        {
          id: 'c',
          text: 'Na serveru (Node) ne postoje browser API-ji poput window, document i localStorage. Kod koji ih koristi treba izvršavati samo u browseru (isPlatformBrowser, afterNextRender ili apstrakcija nad storage-om). Hydration služi da klijent preuzme već renderovan server DOM umjesto da ga gradi ispočetka.',
        },
        {
          id: 'd',
          text: 'SSR ne podržava servise; moraju se ukloniti iz aplikacije ili prebaciti u komponente.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Kod SSR-a se prva verzija stranice renderuje na serveru, pa je brža za prikaz i bolja za SEO. Server nema browser okruženje, pa se pristup window/document/localStorage mora štititi ili apstrahovati. Hydration nakon učitavanja JS-a "oživi" postojeći DOM (veže događaje i stanje) umjesto da ga uništi i ponovo napravi, što izbjegava treperenje i ubrzava interaktivnost.\n\nKako to reći na intervjuu: "Na serveru nema browser API-ja, pa taj kod izvršavam samo u browseru ili ga sakrijem iza apstrakcije. Hydration omogućava da klijent nastavi sa server-renderovanim DOM-om bez ponovnog renderovanja."',
    },
    {
      id: 'q15',
      prompt:
        'Kako ispravno testiraš servis koji poziva HttpClient, a da test ne ide na pravu mrežu?',
      options: [
        {
          id: 'a',
          text: 'provideHttpClient() + provideHttpClientTesting(); u testu HttpTestingController: expectOne(url), provjeriš metodu i zaglavlja, flush(mockPodaci), a na kraju verify() da nema neočekivanih zahtjeva.',
        },
        {
          id: 'b',
          text: 'Testovi uvijek gađaju pravi backend, inače nisu pouzdani.',
        },
        {
          id: 'c',
          text: 'HttpClient zamijeniš običnim objektom { get: () => "data" } i smatraš da su time pokriveni URL-ovi i interceptori.',
        },
        {
          id: 'd',
          text: 'HttpClient se ne može testirati jediničnim testovima; jedina opcija su e2e testovi.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'HttpTestingController presreće zahtjeve u testu: expectOne provjerava da je poslan očekivan zahtjev, flush simulira odgovor (ili grešku), a verify() potvrđuje da nema neočekivanih poziva. Tako se testira i URL, i metoda, i zaglavlja, i obrada odgovora bez mreže. Ručno mockovanje objekta može biti u redu za izolovanje komponente, ali ne testira sam servis ni interceptore.\n\nKako to reći na intervjuu: "Koristim provideHttpClientTesting i HttpTestingController: očekujem zahtjev, flush-ujem mock odgovor i verify-jem da nema viška poziva. Tako test ne zavisi od mreže, a provjerava stvarno ponašanje servisa."',
    },
    {
      id: 'q16',
      prompt:
        "Tim od šest ljudi gradi aplikaciju srednje veličine. Jedan član predlaže NgRx za sve, drugi kaže 'samo servisi sa signalima'.\n\nKako bi argumentovao odluku?",
      options: [
        {
          id: 'a',
          text: 'NgRx uvijek, jer servisi ne mogu dijeliti stanje između komponenti.',
        },
        {
          id: 'b',
          text: 'Nikad NgRx; biblioteke za stanje su zastarjele otkako postoje signali.',
        },
        {
          id: 'c',
          text: 'Zavisi od složenosti: lokalno stanje ostaje u komponentama (signal), dijeljeno u servisima sa signalima. NgRx/SignalStore se isplati kad ima mnogo složenih tokova, potrebe za predvidljivim jednosmjernim tokom, DevTools-a i većeg tima, uz svijest o boilerplate-u.',
        },
        {
          id: 'd',
          text: 'Stanje se mora čuvati isključivo u localStorage da preživi osvježavanje stranice.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Nema jedinog tačnog odgovora, a upravo to intervjuer provjerava: možeš li argumentovati kompromis. Jednostavno stanje ne traži biblioteku. Kad stanje raste, pojavljuju se kompleksne zavisnosti, side effecti i potreba za jasnim pravilima i debugovanjem, pa struktura koju nameće NgRx pomaže, a cijena je više koda i krivulja učenja.\n\nKako to reći na intervjuu: "Krećem od najjednostavnijeg: signali u komponentama i servisima. NgRx uvodim kad složenost i veličina tima opravdaju dodatni boilerplate u zamjenu za predvidljivost i alate za debug."',
    },
    {
      id: 'q17',
      prompt:
        'U komponenti A si napisao CSS .title { color: red }. Primijetio si da ne utiče na istoimenu klasu u komponenti B, niti na elemente unutar child komponente.\n\nŠta je razlog i kako se (ispravno) stilizuje child izvana?',
      options: [
        {
          id: 'a',
          text: 'Angular uvijek koristi Shadow DOM, pa ništa ne prolazi; jedini način je isključiti Shadow DOM u konfiguraciji.',
        },
        {
          id: 'b',
          text: 'CSS u komponentama je globalan; razlog je bug u verziji Angulara.',
        },
        {
          id: 'c',
          text: 'Stilovi se primjenjuju samo u produkcijskom build-u.',
        },
        {
          id: 'd',
          text: 'Default ViewEncapsulation.Emulated dodaje jedinstvene atribute (_ngcontent-xxx) elementima i selektorima, pa su stilovi "scoped". Child se stilizuje izvana preko CSS custom properties (varijabli) ili klasa/input-a koje child izlaže, dok je ::ng-deep deprecated i treba ga izbjegavati.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Emulated enkapsulacija simulira Shadow DOM: Angular prepisuje selektore i dodaje atribute da stil važi samo za elemente te komponente. Opcije su još None (globalno) i ShadowDom (pravi Shadow DOM). Najčistiji način da roditelj utiče na izgled child komponente je CSS varijabla koju child koristi (--accent-color), jer je to ugovor koji child sam izlaže.\n\nKako to reći na intervjuu: "Emulated enkapsulacija čini stilove lokalnim za komponentu. Za prilagođavanje child-a koristim CSS varijable, a ::ng-deep izbjegavam jer je deprecated i lomi enkapsulaciju."',
    },
    {
      id: 'q18',
      prompt:
        'Na code review-u vidiš komponentu <user-card> koja sama injektuje UserService, poziva HTTP, drži stanje, renderuje UI i navigira na druge rute.\n\nKako to objasniti i popraviti?',
      options: [
        {
          id: 'a',
          text: 'To je dobra praksa; komponente trebaju sve raditi same radi jednostavnosti.',
        },
        {
          id: 'b',
          text: 'Sve prebaciti u jednu veliku root komponentu da nema prosljeđivanja podataka.',
        },
        {
          id: 'c',
          text: 'Premjestiti HTML u servis, a komponentu ostaviti praznom.',
        },
        {
          id: 'd',
          text: 'Razdvojiti odgovornosti: container (smart) komponenta radi sa servisima i stanjem i prosljeđuje podatke preko input()-a, a presentational komponenta samo prikazuje i emituje događaje preko output()-a. Dobijaš ponovnu upotrebljivost, lakše testove i jasniji tok podataka.',
        },
      ],
      correctOptionId: 'd',
      explanation:
        'Presentational komponenta je čista funkcija njenih input-a: isti ulaz daje isti izlaz, nema zavisnosti od servisa, pa se lako testira i koristi na više mjesta. Container komponenta zna "odakle podaci dolaze" i šta se radi sa događajima. Podjela odgovornosti smanjuje sprezanje i olakšava promjene.\n\nKako to reći na intervjuu: "Odvajam komponentu koja zna odakle podaci dolaze od one koja ih samo prikazuje. Presentational komponenta dobija input-e i emituje output-e, pa je ponovo iskoristiva i laka za testiranje."',
    },
    {
      id: 'q19',
      prompt:
        "Dodaješ retry(3) na sve HTTP pozive radi 'stabilnosti'.\n\nKoji je najveći problem ovog pristupa?",
      options: [
        {
          id: 'a',
          text: 'Ponavljanje ne-idempotentnih zahtjeva (npr. POST za plaćanje ili kreiranje) može duplirati efekat na serveru. Retry treba ograničiti na idempotentne metode i prolazne greške (mrežne, 5xx, ne 4xx), idealno sa exponential backoff-om.',
        },
        {
          id: 'b',
          text: 'Nema problema, retry je uvijek siguran jer server ionako odbacuje duplikate.',
        },
        {
          id: 'c',
          text: 'retry radi samo sa GET zahtjevima; za ostale metode se ignoriše bez ikakvog efekta.',
        },
        {
          id: 'd',
          text: 'retry automatski briše sve interceptore iz lanca, pa zahtjevi gube Authorization header.',
        },
      ],
      correctOptionId: 'a',
      explanation:
        'Idempotentna operacija može se ponoviti bez dodatnog efekta (GET, PUT, DELETE). POST tipično nije, pa retry može kreirati duplikate ili duplo naplatiti. Takođe nema smisla ponavljati 4xx (npr. 400, 404) jer će opet pasti. Za prolazne greške se koristi backoff (sve duže čekanje između pokušaja) da se server ne preoptereti. Kod kritičnih POST-ova koriste se idempotency ključevi.\n\nKako to reći na intervjuu: "Retry primjenjujem selektivno: samo za idempotentne zahtjeve i prolazne greške, sa backoff-om. Slijepi retry na POST-u može duplirati podatke."',
    },
    {
      id: 'q20',
      prompt:
        'Napravio si pipe filterUsers koji filtrira niz po tekstu. Radi pri prvom renderu, ali kad u postojeći niz uradiš users.push(novi), lista se ne osvježi.\n\nZašto?',
      options: [
        {
          id: 'a',
          text: 'Pipe-ovi ne mogu raditi sa nizovima, samo sa stringovima i brojevima.',
        },
        {
          id: 'b',
          text: 'Pipe se izvršava samo jednom u životnom vijeku aplikacije, bez obzira na ulaz.',
        },
        {
          id: 'c',
          text: 'Pure pipe (default) se ponovo izvršava samo kad se promijeni referenca ulaza (ili primitivna vrijednost); push mutira isti niz. Rješenje: imutabilan update (novi niz), signal/computed, a impure pipe samo uz oprez jer se izvršava pri svakom change detection ciklusu.',
        },
        {
          id: 'd',
          text: 'Potrebno je dodati async u pipe i vratiti Promise; tek tada prati promjene u nizu.',
        },
      ],
      correctOptionId: 'c',
      explanation:
        'Pure pipe je optimizacija: Angular ga ponovo poziva samo ako se ulazni argument promijenio (po referenci za objekte i nizove). Mutacija istog niza ne mijenja referencu. Impure pipe (pure: false) se poziva pri svakom ciklusu change detectiona, što je skupo za filtriranje velikih lista. Preporuka je tretirati podatke kao nepromjenjive ili izvesti filtriranu listu sa computed().\n\nKako to reći na intervjuu: "Pure pipe reaguje na promjenu reference, pa mutacija niza ne okida ponovno izvršavanje. Zato radim imutabilne izmjene ili filtriram kroz computed(), a impure pipe izbjegavam zbog cijene."',
    },
  ],
};
