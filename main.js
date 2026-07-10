/* ─────────────────────────────────────────────
   SUPABASE CONFIG
───────────────────────────────────────────── */
const SB_URL = "https://ipdkimklpaegfrkpvsai.supabase.co";
const SB_KEY = "sb_publishable_PeKKoi1I-5Vn1YGA5Xznfg_oa3eH4Ei";

async function sbGet(path) {
  const res = await fetch(`${SB_URL}/rest/v1${path}`, {
    headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* Live news cache */
let liveNews = [];

/* Carousel state */
let carouselPage = 0;
const CARDS_PER_PAGE = 3; // desktop; adjusted per breakpoint in newsCarousel()

/* ─────────────────────────────────────────────
   i18n
───────────────────────────────────────────── */
const i18n = {
  uz: {
    brandSubtitle:"O'zbekistondagi islom sivilizatsiyasi markazi kutubxonasi",
    navHome:"Bosh sahifa", navDiscover:"Fondlar", navServices:"Xizmatlar",
    navVisit:"Tashrif", navAbout:"Haqida", navPartners:"Hamkorlar",
    navDirectors:"Kutubxona jamoasi",
    navKirish:"Kirish", navRegister:"Ro'yxatdan o'tish",
    heroEyebrow:"Raqamli meros platformasi",
    heroTitle:"Islom sivilizatsiyasi manbalarini zamonaviy formatda kashf eting.",
    heroCopy:"ICCU kutubxonasi qo'lyozmalar, kitoblar, ma'ruzalar, tadbirlar va tashrif xizmatlarini yagona qulay platformada birlashtiradi.",
    heroPrimary:"Resurslardan qidirish", heroSecondary:"Yangiliklarni ko'rish",
    statBooks:"Kitoblar", statManuscripts:"Qo'lyozmalar",
    statJournals:"Jurnallar", statAccess:"Onlayn kirish",
    updatesKicker:"Yangiliklar",
    newsTitle:"So'nggi yangiliklar",
    newsSubtitle:"Platformadagi muhim yangilanishlar, tadbirlar va hamkorliklar.",
    newsTag1:"E'lon", newsHeadline1:"Usmoniylar davriga oid 3 000 qo'lyozma raqamli arxivga joylandi",
    newsText1:"Yangi fond tadqiqotchilar uchun metadata va kirish so'rovlari bilan taqdim etildi.",
    newsBody1:"Raqamli arxiv fondi qo'lyozmalarni topish, tavsiflash va o'qish jarayonini tezlashtirish uchun ishlab chiqildi. Har bir yozuvda mavzu, davr, til, saqlanish holati va foydalanish tartibi ko'rsatiladi.",
    newsExtra1:"Keyingi bosqichda fondlar tadqiqotchi kabineti va maxsus so'rov moduli bilan bog'lanadi.",
    newsTag2:"Tadbir", newsHeadline2:"Islom sivilizatsiyasi tadqiqotlari konferensiyasiga ro'yxat ochildi",
    newsText2:"Ma'ruzalar, seminarlar va fondlar bo'yicha maxsus sessiyalar rejalashtirilgan.",
    newsBody2:"Konferensiya kutubxona fondlari, manbashunoslik, raqamli arxivlar va ta'lim dasturlarini birlashtiradi.",
    newsExtra2:"Dastur yakunida barcha video yozuvlar multimedia arxiviga joylanadi.",
    newsTag3:"Hamkorlik", newsHeadline3:"ICCU Istanbul universiteti kutubxonasi bilan hamkorlikni boshladi",
    newsText3:"Hamkorlik qo'shma kataloglash, almashinuv va raqamlashtirish yo'nalishlarini qamrab oladi.",
    newsBody3:"Kelishuv xalqaro fondlar bilan ishlash, qo'shma metadata standartlari va ilmiy almashinuv uchun amaliy yo'l ochadi.",
    newsExtra3:"Hamkorlik natijalari platformaning Manbalar va Allomalar bo'limlariga ham bog'lanadi.",
    quickKicker:"Tezkor xizmatlar", quickTitle:"Foydalanuvchi uchun asosiy yo'nalishlar",
    quickSubtitle:"Katalog, qo'lyozmalar, tashrif va kutubxonachi yordami qisqa yo'l bilan.",
    viewAll:"Hammasini ko'rish",
    qs1Title:"Raqamli qo'lyozmalar", qs1Text:"Nodir manbalar uchun ko'rish va ruxsat so'rovi jarayoni.",
    qs2Title:"Kutubxonachi yordami", qs2Text:"Tadqiqot mavzusi, manba topish va bibliografiya bo'yicha yordam.",
    qs3Title:"Tashrifni rejalash", qs3Text:"Ish vaqti, o'qish zali va maxsus fondlardan foydalanish tartibi.",
    projectsKicker:"Platforma loyihalari", projectsTitle:"Faol raqamli kutubxona tashabbuslari",
    projectsSubtitle:"Kutubxonani kundalik tadqiqot platformasiga aylantiradigan amaliy yo'nalishlar.",
    project1Status:"Faol", project1Title:"Hamkorlik",
    project1Text:"Universitetlar, kutubxonalar va ilmiy markazlar bilan qo'shma loyihalar va shartnomalar.",
    project1Progress:"Faol hamkorlik", project1Count:"10+ hamkor",
    project2Status:"24/7", project2Title:"Masofaviy kirish",
    project2Text:"Raqamli katalog va elektron bazalarga uydan 24/7 kirish imkoniyati.",
    project2Progress:"Doimo ochiq", project2Count:"E-kutubxona",
    project3Status:"Jonli arxiv", project3Title:"Ma'ruza va tadbirlar arxivi",
    project3Text:"Videolar, transkriptlar va o'quv yo'llarini fondlar bilan bog'lash.",
    project3Progress:"Faol ishlaydi", project3Count:"50+ video",
    project4Status:"Faol", project4Title:"Guruh va ekskursiya",
    project4Text:"Talabalar guruhlari, maktablar va tashkilotlar uchun kutubxona ekskursiyasi.",
    project4Progress:"Ariza qabul qilinadi", project4Count:"Bog'lanish →",
    partnersKicker:"Hamkorlar", partnersTitle:"Ishonchli hamkorlar",
    partnersSubtitle:"Birgalikda ilmiy va raqamli meros sohasidagi ishlarni rivojlantirmoqdamiz.",
    newsDetailKicker:"Yangilik", backNews:"Yangiliklarga qaytish",
    detailSideTitle:"Aloqador yo'nalishlar",
    detailSideText:"Bu yangilik fondlar, tadqiqotchi kabineti va raqamlashtirish jarayonlari bilan bog'liq.",
    discoverKicker:"Fondlar", discoverTitle:"Kutubxona fondlari",
    discoverSubtitle:"Katalog, qo'lyozmalar, mualliflar, raqamli ko'rgazmalar va tavsiya ro'yxatlari.",
    d1Title:"Onlayn katalog", d1Text:"Kitoblar, mualliflar, mavzular va identifikatorlar.",
    d2Title:"Qo'lyozmalar", d2Text:"Nodir manbalar va raqamli kirish qaydlari.",
    d3Title:"Allomalar", d3Text:"Allomalar.uz bilan bog'langan ma'lumot yo'nalishi.",
    d4Title:"Manbalar", d4Text:"Manbalar.uz resurslari uchun tezkor yo'nalish.",
    servicesKicker:"Xizmatlar", servicesTitle:"Kutubxona xizmatlari",
    servicesSubtitle:"Tadqiqot, tashrif, raqamli fondlar va hamkorlik jarayonlari uchun xizmatlar.",
    svc1Title:"Kutubxonachidan yordam", svc1Text:"Manba tanlash, bibliografiya va tadqiqot yo'nalishi bo'yicha maslahat.",
    svc2Title:"Maxsus fond so'rovi", svc2Text:"Qo'lyozma yoki nodir materialni ko'rish uchun oldindan so'rov.",
    svc3Title:"Hamkorlik", svc3Text:"Universitetlar, kutubxonalar va ilmiy markazlar bilan qo'shma loyihalar.",
    visitKicker:"Tashrif", visitTitle:"Tashrifingizni rejalang",
    visitSubtitle:"Ish vaqti, manzil va o'qish zali qoidalari.",
    hoursTitle:"Ish vaqti", weekday:"Dushanba – juma: 09:00 – 18:00",
    weekend:"Shanba – yakshanba: 10:00 – 16:00", holidays:"Bayram kunlari: yopiq",
    contactTitle:"Aloqa va manzil", address:"Manzil: Toshkent, O'zbekiston",
    email:"Email: library@iccu.example", phone:"Telefon: +998 00 000 00 00",
    rulesTitle:"Kutubxona qoidalari",
    rule1:"O'qish zallarida tinchlikni saqlang.",
    rule2:"Oziq-ovqat va ichimliklar fond hududiga olib kirilmaydi.",
    rule3:"Qo'lyozmalarni suratga olish uchun ruxsat kerak.",
    beforeTitle:"Kelishdan oldin",
    beforeText:"Shaxsni tasdiqlovchi hujjat olib keling va nodir materiallarni oldindan band qiling.",
    mapText:"Interaktiv xarita maydoni",
    aboutKicker:"Haqida", aboutTitle:"Kutubxona haqida",
    aboutSubtitle:"ICCU kutubxonasi islom sivilizatsiyasi merosini saqlash, o'rganish va keng jamoatchilikka yetkazishga xizmat qiladi.",
    mission1Title:"Saqlash", mission1Text:"Nodir qo'lyozmalar va kitoblarni raqamlashtirish hamda konservatsiya qilish.",
    mission2Title:"Kirish", mission2Text:"Talabalar, tadqiqotchilar va keng jamoatchilik uchun ochiq bilim yo'llarini yaratish.",
    faq1Q:"O'quvchi kartasini qanday olaman?",
    faq1A:"Ro'yxatdan o'tish bo'limiga shaxsni tasdiqlovchi hujjat bilan murojaat qiling.",
    faq2Q:"Raqamli resurslarga uydan kira olamanmi?",
    faq2A:"Ko'plab raqamli resurslar onlayn mavjud, ayrim bazalar akkaunt talab qiladi.",
    footerText:"Raqamli fondlar, tashrif xizmatlari, hamkorlik va ilmiy resurslar uchun yagona platforma.",
    footerContacts:"Aloqa", footerLinks:"Tezkor havolalar",
    footerSocials:"Ijtimoiy tarmoqlar", footerRights:"ICCU — Islom sivilizatsiyasi markazi",
    svc1f1:"Mavzuga mos manba va adabiyotlarni tanlash",
    svc1f2:"Bibliografiya va iqtibos formatlash (APA, MLA, Chicago)",
    svc1f3:"Onlayn va jismoniy fondlar bo'yicha yo'naltirish",
    svc1Cta:"So'rov yuborish →",
    svc2f1:"Nodir qo'lyozmalar va arxiv materiallariga ruxsat",
    svc2f2:"Tashrif oldidan onlayn band qilish imkoniyati",
    svc2f3:"Raqamli nusxa olish va ko'chirish xizmati",
    svc2Cta:"So'rov yuborish →",
    svc4Title:"Masofaviy kirish",
    svc4Text:"Raqamli katalog va elektron bazalarga uydan 24/7 kirish imkoniyati.",
    svc5Title:"Guruh va ekskursiya",
    svc5Text:"Talabalar guruhlari, maktablar va tashkilotlar uchun kutubxona ekskursiyasi.",
    svcContact:"Bog'lanish →",
    svcOpen:"Ochish →",
    d1f1:"120 000+ kitob va nashrlar bazasi",
    d1f2:"Muallif, mavzu, yil va til bo'yicha kengaytirilgan qidiruv",
    d1f3:"ISBN, ISSN va boshqa identifikatorlar orqali izlash",
    d1Cta:"Katalogga kirish →",
    d2f1:"15 000+ nodir qo'lyozma raqamli arxivda",
    d2f2:"Usmoniylar, Temuriylar va boshqa davrlar fondi",
    d2f3:"Metadata, davr, til va saqlanish holati bo'yicha filter",
    d2Cta:"Arxivga kirish →",
    d3Link:"Allomalar.uz ↗",
    d4Link:"Manbalar.uz ↗",
    d5Title:"Elektron kutubxona",
    d5Text:"E-library.cisc.uz orqali raqamli resurslar va jurnallarga to'liq kirish.",
    d5Link:"E-library ↗",
    abStat1:"Jami adabiyot", abStat2:"Elektron nusxa",
    abStat3:"Qo'lyozma", abStat4:"Kutubxona maydoni",
    abStat5:"O'rin sig'imi", abStat6:"Raqamlashtirилган nodir asar",
    aboutFondKicker:"Fond haqida", aboutFondTitle:"2025-yil natijalari",
    abH1:"Yangi qabul qilingan adabiyot", abH1sub:"3 879 tasi hadya, 910 tasi xarid",
    abH2:"Yagona bazadagi yozma manba",  abH2sub:"Qo'lyozma va toshbosma asarlar",
    abH3:"Yozma manba reystri",          abH3sub:"Pasport tayyorlangan manbalar",
    abH4:"Brayl yozuvidagi adabiyot",    abH4sub:"Imkoniyati cheklangan shaxslar uchun",
    mission3Title:"Rivojlantirish",
    mission3Text:"Zamonaviy axborot-kutubxona xizmatlarini kengaytirish, yozma merosni asrash va ilm-fan rivojiga xizmat qiluvchi loyihalar.",
    faq3Q:"Kutubxonada nechta o'rin bor?",
    faq3A:"Kutubxona bir vaqtning o'zida 310 nafar kitobxonga xizmat ko'rsatish imkoniyatiga ega.",
    faq4Q:"Nodir qo'lyozmalarni ko'rish mumkinmi?",
    faq4A:"Ha, oldindan so'rov yuborish orqali nodir fond materiallaridan foydalanish mumkin. Raqamlashtirish bo'limiga murojaat qiling.",
    qs1Link:"Arxivga o'tish →",
    qs2Link:"Murojaat qilish →",
    qs3Link:"Batafsil →",
    project1Progress:"72% bajarildi", project1Count:"700+ asar",
    project2Progress:"45% bajarildi", project2Count:"Beta sinov",
    project3Progress:"Faol ishlaydi", project3Count:"50+ video",
    project4Progress:"Ishlab chiqilmoqda", project4Count:"2026 Q3",
    floorPlanBtn:"Kutubxona ichki xaritasini ko'rish",
    floorPlanKicker:"Kutubxona xaritasi",
    floorPlanTitle:"Ichki tuzilma xaritasi",
    floorPlanHint:"Sichqoncha g'ildiragi bilan zoom · Bosib suring",
    /* Directors page */
    directorsKicker:"Jamoa",
    directorsTitle:"Kutubxona jamoasi",
    directorsSubtitle:"ICCU kutubxonasini rivojlantirish va boshqarishga mas'ul mutaxassislar jamoasi.",
    director1Name:"Prof. Dr. Abdulloh Karimov",
    director1Role:"Bosh direktor",
    director1Bio:"Islom sivilizatsiyasi va raqamli arxivlar sohasida 25 yillik tajribaga ega. UNESCO va ISESCO bilan hamkorlikdagi loyihalarga rahbarlik qiladi.",
    director2Name:"Dr. Malika Yusupova",
    director2Role:"Ilmiy ishllar bo'yicha direktor o'rinbosari",
    director2Bio:"Qo'lyozmashunoslik va kataloglash bo'yicha mutaxassis. 15 yillik ilmiy faoliyat davomida 3 000 dan ortiq nodir manba tavsifini tayyorlagan.",
    director3Name:"Jahongir Mirzayev",
    director3Role:"Raqamli texnologiyalar bo'limi boshlig'i",
    director3Bio:"Kutubxona tizimlarini raqamlashtirish va metadata standartlarini joriy etish bo'yicha rahbar mutaxassis.",
    director4Name:"Dilnoza Rashidova",
    director4Role:"Xalqaro hamkorlik bo'limi boshlig'i",
    director4Bio:"Xalqaro kutubxona tashkilotlari bilan munosabatlarni muvofiqlashtiradi. Istanbul, Paris va Vashington sherik kutubxonalari bilan faol ishlaydi.",
    director5Name:"Behzod Nazarov",
    director5Role:"Foydalanuvchi xizmatlari bo'limi boshlig'i",
    director5Bio:"Tadqiqotchilar va talabalar uchun kirish xizmatlari, o'qish zallari va masofaviy resurslar bo'yicha mas'ul.",
    navAnnouncements:"E'lonlar",
    kioskLabel:"Yangi e'lon",
    kioskDefaultTitle:"E'lonlar yuklanmoqda...",
    kioskViewAll:"Ko'rish →",
    announcementsKicker:"E'lonlar",
    announcementsTitle:"Joriy e'lonlar",
    announcementsSubtitle:"Kutubxona va platforma bo'yicha muhim xabarlar va e'lonlar.",
    announcementsEmpty:"Hozircha faol e'lonlar yo'q.",
    annPriority:"E'lon", annPriorityHigh:"Muhim",
  }
};

/* English */
i18n.en = {
  ...i18n.uz,
  brandSubtitle:"Islamic Civilization Library",
  navHome:"Home", navDiscover:"Collections", navServices:"Services",
  navVisit:"Visit", navAbout:"About", navPartners:"Partners",
  navDirectors:"Our Team",
  navKirish:"Login", navRegister:"Register",
  heroEyebrow:"Digital heritage platform",
  heroTitle:"Explore Islamic civilization sources in a modern format.",
  heroCopy:"ICCU Library brings manuscripts, books, lectures, events, and visitor services into one clear platform.",
  heroPrimary:"Search resources", heroSecondary:"View news",
  statBooks:"Books", statManuscripts:"Manuscripts", statJournals:"Journals", statAccess:"Online access",
  updatesKicker:"News", newsTitle:"Latest news and announcements",
  newsSubtitle:"Important platform updates, events, and partnerships.",
  newsTag1:"Announcement", newsHeadline1:"3,000 Ottoman-era manuscripts added to digital archive",
  newsText1:"The new collection is available with metadata and access request flows.",
  newsBody1:"The digital archive was designed to make manuscript discovery and reading requests faster.",
  newsExtra1:"The next stage connects these records with the researcher cabinet.",
  newsTag2:"Event", newsHeadline2:"Registration opened for the Islamic Civilization Studies conference",
  newsText2:"Lectures, workshops, and special collection sessions are planned.",
  newsBody2:"The conference connects library collections, source studies, and digital archives.",
  newsExtra2:"All recordings will be added to the multimedia archive after the event.",
  newsTag3:"Partnership", newsHeadline3:"ICCU begins cooperation with Istanbul University Library",
  newsText3:"The partnership covers shared cataloguing, exchange, and digitization.",
  newsBody3:"The agreement opens a practical path for international collections and metadata standards.",
  newsExtra3:"Results will connect to the Sources and Allomalar sections.",
  quickKicker:"Quick services", quickTitle:"Core paths for users",
  quickSubtitle:"Shortcuts for manuscripts, visits, and librarian support.",
  viewAll:"View all",
  qs1Title:"Digital manuscripts", qs1Text:"Viewing and permission requests for rare sources.",
  qs2Title:"Librarian support", qs2Text:"Help with research topics, source discovery, and bibliography.",
  qs3Title:"Plan a visit", qs3Text:"Hours, reading rooms, and special collection access rules.",
  projectsKicker:"Platform projects", projectsTitle:"Active digital library initiatives",
  projectsSubtitle:"Practical workstreams turning the library into a daily research platform.",
  project1Status:"Active", project1Title:"Partnerships",
  project1Text:"Joint projects and agreements with universities, libraries, and research centers.",
  project1Progress:"Active cooperation", project1Count:"10+ partners",
  project2Status:"24/7", project2Title:"Remote access",
  project2Text:"24/7 access to the digital catalogue and e-databases from home.",
  project2Progress:"Always open", project2Count:"E-library",
  project3Status:"Live archive", project3Title:"Lecture and event archive",
  project3Text:"Connect videos, transcripts, and learning paths with collections.",
  project3Progress:"Live", project3Count:"50+ videos",
  project4Status:"Active", project4Title:"Group visits & tours",
  project4Text:"Library excursions for student groups, schools, and organisations.",
  project4Progress:"Applications open", project4Count:"Contact →",
  partnersKicker:"Partners", partnersTitle:"Trusted partners",
  partnersSubtitle:"Together we advance digital heritage and scholarly work.",
  newsDetailKicker:"News", backNews:"Back to news",
  detailSideTitle:"Related areas", detailSideText:"This story connects with collections and digitization workflows.",
  discoverKicker:"Collections", discoverTitle:"Library collections",
  discoverSubtitle:"Catalogue, manuscripts, scholars, exhibits, and reading lists.",
  d1Title:"Online catalogue", d1Text:"Books, authors, subjects, and identifiers.",
  d2Title:"Manuscripts", d2Text:"Rare sources with digital access notes.",
  d3Title:"Allomalar", d3Text:"Reference path connected with allomalar.uz.",
  d4Title:"Sources", d4Text:"Quick path for manbalar.uz resources.",
  servicesKicker:"Services", servicesTitle:"Library services",
  servicesSubtitle:"Support for research, visits, digital collections, and partnerships.",
  svc1Title:"Ask a librarian", svc1Text:"Guidance on sources, bibliography, and research direction.",
  svc2Title:"Special collection request", svc2Text:"Request access to a manuscript in advance.",
  svc3Title:"Partnerships", svc3Text:"Joint projects with universities and research centers.",
  visitKicker:"Visit", visitTitle:"Plan your visit",
  visitSubtitle:"Hours, location, and reading room rules.",
  hoursTitle:"Opening hours", weekday:"Monday – Friday: 09:00 – 18:00",
  weekend:"Saturday – Sunday: 10:00 – 16:00", holidays:"Public holidays: closed",
  contactTitle:"Contact and address", address:"Address: Tashkent, Uzbekistan",
  email:"Email: library@iccu.example", phone:"Phone: +998 00 000 00 00",
  rulesTitle:"Library rules",
  rule1:"Keep reading rooms quiet.",
  rule2:"Food and drinks stay outside collection areas.",
  rule3:"Manuscript photography requires permission.",
  beforeTitle:"Before you arrive",
  beforeText:"Bring identification and reserve rare materials in advance.",
  mapText:"Interactive map area",
  aboutKicker:"About", aboutTitle:"About the library",
  aboutSubtitle:"ICCU Library preserves, studies, and shares Islamic civilization heritage.",
  mission1Title:"Preservation", mission1Text:"Digitization and conservation of rare manuscripts.",
  mission2Title:"Access", mission2Text:"Open pathways to knowledge for researchers and the public.",
  faq1Q:"How do I get a reader card?", faq1A:"Visit the registration desk with valid identification.",
  faq2Q:"Can I access digital resources from home?",
  faq2A:"Many resources are online; some databases require an account.",
  footerText:"One platform for digital collections, visitor services, and research resources.",
  footerContacts:"Contacts", footerLinks:"Quick links",
  footerSocials:"Social accounts", footerRights:"ICCU — Islamic Civilization Center",
  directorsKicker:"Team",
  directorsTitle:"Library team",
  directorsSubtitle:"The team responsible for developing and managing the ICCU Library.",
  director1Name:"Prof. Dr. Abdulloh Karimov",
  director1Role:"Executive Director",
  director1Bio:"25 years of experience in Islamic civilization studies and digital archives. Leads projects in cooperation with UNESCO and ISESCO.",
  director2Name:"Dr. Malika Yusupova",
  director2Role:"Deputy Director for Research",
  director2Bio:"Specialist in manuscript studies and cataloguing. Has prepared descriptions for over 3,000 rare sources over 15 years of scholarly work.",
  director3Name:"Jahongir Mirzayev",
  director3Role:"Head of Digital Technologies",
  director3Bio:"Lead specialist in library system digitization and implementation of metadata standards.",
  director4Name:"Dilnoza Rashidova",
  director4Role:"Head of International Cooperation",
  director4Bio:"Coordinates relations with international library organizations. Actively works with partner libraries in Istanbul, Paris, and Washington.",
  director5Name:"Behzod Nazarov",
  director5Role:"Head of User Services",
  director5Bio:"Responsible for access services, reading rooms, and remote resources for researchers and students.",
  navAnnouncements:"Announcements",
  kioskLabel:"New announcement",
  kioskDefaultTitle:"Loading announcements...",
  kioskViewAll:"View all →",
  announcementsKicker:"Announcements",
  announcementsTitle:"Current announcements",
  announcementsSubtitle:"Important news and announcements about the library and platform.",
  announcementsEmpty:"No active announcements at this time.",
  annPriority:"Announcement", annPriorityHigh:"Important",
};

i18n.ru = {
  ...i18n.en,
  brandSubtitle:"Библиотека Центра исламской цивилизации",
  navHome:"Главная", navDiscover:"Фонды", navServices:"Услуги",
  navVisit:"Визит", navAbout:"О нас", navPartners:"Партнёры",
  navDirectors:"Команда", navAnnouncements:"Объявления",
  navKirish:"Войти", navRegister:"Регистрация",
  heroEyebrow:"Платформа цифрового наследия",
  heroTitle:"Откройте источники исламской цивилизации в современном формате.",
  heroCopy:"Библиотека ICCU объединяет рукописи, книги, лекции, мероприятия и посетительские услуги на единой удобной платформе.",
  heroPrimary:"Найти ресурсы", heroSecondary:"Читать новости",
  statBooks:"Книги", statManuscripts:"Рукописи", statJournals:"Журналы", statAccess:"Онлайн-доступ",
  updatesKicker:"Новости", newsTitle:"Последние новости и объявления",
  newsSubtitle:"Важные обновления платформы, мероприятия и партнёрства.",
  quickKicker:"Быстрые услуги", quickTitle:"Основные направления для пользователей",
  quickSubtitle:"Каталог, рукописи, посещение и помощь библиотекаря — кратким путём.",
  viewAll:"Смотреть все",
  qs1Title:"Цифровые рукописи", qs1Text:"Просмотр и запрос доступа к редким источникам.",
  qs1Link:"Перейти в архив →",
  qs2Title:"Помощь библиотекаря", qs2Text:"Помощь в исследованиях, поиске источников и библиографии.",
  qs2Link:"Обратиться →",
  qs3Title:"Планировать визит", qs3Text:"Часы работы, читальные залы и правила доступа к спецфонду.",
  qs3Link:"Подробнее →",
  projectsKicker:"Проекты платформы", projectsTitle:"Активные цифровые инициативы библиотеки",
  projectsSubtitle:"Практические направления, превращающие библиотеку в ежедневную исследовательскую платформу.",
  project1Status:"Активно", project1Title:"Партнёрства",
  project1Text:"Совместные проекты и соглашения с университетами, библиотеками и научными центрами.",
  project1Progress:"Активное сотрудничество", project1Count:"10+ партнёров",
  project2Status:"24/7", project2Title:"Удалённый доступ",
  project2Text:"Круглосуточный доступ к цифровому каталогу и электронным базам данных из дома.",
  project2Progress:"Всегда доступно", project2Count:"Э-библиотека",
  project3Status:"Живой архив", project3Title:"Архив лекций и событий",
  project3Text:"Видео, транскрипты и учебные маршруты в связке с фондами.",
  project3Progress:"Работает", project3Count:"50+ видео",
  project4Status:"Активно", project4Title:"Групповые визиты и экскурсии",
  project4Text:"Экскурсии по библиотеке для студенческих групп, школ и организаций.",
  project4Progress:"Приём заявок открыт", project4Count:"Связаться →",
  partnersKicker:"Партнёры", partnersTitle:"Надёжные партнёры",
  partnersSubtitle:"Вместе развиваем науку и сохраняем цифровое наследие.",
  newsDetailKicker:"Новость", backNews:"Назад к новостям",
  detailSideTitle:"Связанные направления",
  detailSideText:"Эта новость связана с фондами, кабинетом исследователя и процессами оцифровки.",
  discoverKicker:"Фонды", discoverTitle:"Фонды библиотеки",
  discoverSubtitle:"Каталог, рукописи, учёные, выставки и списки рекомендаций.",
  d1Title:"Онлайн-каталог", d1Text:"Книги, авторы, темы и идентификаторы.",
  d1f1:"120 000+ книг и изданий",
  d1f2:"Расширенный поиск по автору, теме, году и языку",
  d1f3:"Поиск по ISBN, ISSN и другим идентификаторам",
  d1Cta:"Открыть каталог →",
  d2Title:"Рукописи", d2Text:"Редкие источники с записями цифрового доступа.",
  d2f1:"15 000+ редких рукописей в цифровом архиве",
  d2f2:"Фонды Османской, Тимуридской и других эпох",
  d2f3:"Фильтрация по метаданным, эпохе, языку и состоянию",
  d2Cta:"Открыть архив →",
  d3Title:"Аллоmalар", d3Text:"Информационный путь, связанный с allomalar.uz.",
  d3Link:"Allomalar.uz ↗",
  d4Title:"Источники", d4Text:"Быстрый путь к ресурсам manbalar.uz.",
  d4Link:"Manbalar.uz ↗",
  d5Title:"Электронная библиотека",
  d5Text:"Полный доступ к цифровым ресурсам и журналам через e-library.cisc.uz.",
  d5Link:"E-library ↗",
  servicesKicker:"Услуги", servicesTitle:"Услуги библиотеки",
  servicesSubtitle:"Услуги для исследований, посещений, цифровых фондов и партнёрства.",
  svc1Title:"Помощь библиотекаря", svc1Text:"Консультации по выбору источников, библиографии и направлению исследований.",
  svc1f1:"Подбор источников и литературы по теме",
  svc1f2:"Оформление библиографии (APA, MLA, Chicago)",
  svc1f3:"Навигация по онлайн- и физическим фондам",
  svc1Cta:"Отправить запрос →",
  svc2Title:"Запрос к спецфонду", svc2Text:"Предварительный запрос на просмотр рукописи или редкого материала.",
  svc2f1:"Доступ к редким рукописям и архивным материалам",
  svc2f2:"Онлайн-бронирование до визита",
  svc2f3:"Услуга цифрового копирования",
  svc2Cta:"Отправить запрос →",
  svc3Title:"Партнёрства", svc3Text:"Совместные проекты с университетами и научными центрами.",
  svc4Title:"Удалённый доступ", svc4Text:"Круглосуточный доступ к цифровому каталогу из дома.",
  svc5Title:"Групповые визиты и экскурсии", svc5Text:"Экскурсии для студенческих групп, школ и организаций.",
  svcContact:"Связаться →", svcOpen:"Открыть →",
  visitKicker:"Визит", visitTitle:"Планируйте свой визит",
  visitSubtitle:"Часы работы, адрес и правила читального зала.",
  hoursTitle:"Часы работы",
  weekday:"Понедельник – пятница: 09:00 – 18:00",
  out:"Суббота: 10:00 – 16:00",
  holidays:"Воскресенье: закрыто",
  contactTitle:"Контакты и адрес", address:"Адрес: Ташкент, Узбекистан",
  email:"Email: library@iccu.example", phone:"Телефон: +998 00 000 00 00",
  rulesTitle:"Правила библиотеки",
  rule1:"Соблюдайте тишину в читальных залах.",
  rule2:"Еда и напитки запрещены в зоне фондов.",
  rule3:"Для фотосъёмки рукописей требуется разрешение.",
  beforeTitle:"Перед визитом",
  beforeText:"Возьмите удостоверение личности и забронируйте редкие материалы заранее.",
  mapText:"Интерактивная карта",
  floorPlanBtn:"Посмотреть внутреннюю карту библиотеки",
  floorPlanKicker:"Карта библиотеки",
  floorPlanTitle:"Внутренняя карта",
  floorPlanHint:"Колесо мыши для масштабирования · Перетаскивание",
  aboutKicker:"О нас", aboutTitle:"О библиотеке",
  aboutSubtitle:"Библиотека ICCU сохраняет, изучает и распространяет наследие исламской цивилизации.",
  abStat1:"Всего литературы", abStat2:"Электронных копий",
  abStat3:"Рукописей", abStat4:"Площадь библиотеки",
  abStat5:"Мест для читателей", abStat6:"Оцифрованных редких произведений",
  aboutFondKicker:"О фонде", aboutFondTitle:"Итоги 2025 года",
  abH1:"Новые поступления", abH1sub:"3 879 подарено, 910 приобретено",
  abH2:"Письменных источников в базе", abH2sub:"Рукописи и литографии",
  abH3:"Реестр письменных источников", abH3sub:"Источники с паспортом",
  abH4:"Литература по Брайлю", abH4sub:"Для людей с ограниченными возможностями",
  mission1Title:"Сохранение", mission1Text:"Оцифровка и консервация редких рукописей и книг. На 30 000+ изданий установлены RFID-метки.",
  mission2Title:"Доступ", mission2Text:"Открытые пути к знаниям для студентов, исследователей и широкой публики.",
  mission3Title:"Развитие", mission3Text:"Расширение современных информационно-библиотечных услуг и проекты в пользу науки.",
  faq1Q:"Как получить читательский билет?", faq1A:"Обратитесь на стойку регистрации с документом, удостоверяющим личность.",
  faq2Q:"Можно ли получить доступ к цифровым ресурсам дома?",
  faq2A:"Многие ресурсы доступны онлайн; для некоторых баз требуется аккаунт.",
  faq3Q:"Сколько мест в библиотеке?", faq3A:"Библиотека может обслуживать 310 читателей одновременно.",
  faq4Q:"Можно ли посмотреть редкие рукописи?",
  faq4A:"Да, после предварительного запроса. Обратитесь в отдел оцифровки.",
  footerText:"Единая платформа для цифровых фондов, посетительских услуг и научных ресурсов.",
  footerContacts:"Контакты", footerLinks:"Быстрые ссылки",
  footerSocials:"Социальные сети", footerRights:"ICCU — Центр исламской цивилизации",
  kioskLabel:"Новое объявление",
  kioskDefaultTitle:"Загрузка объявлений...",
  kioskViewAll:"Смотреть →",
  announcementsKicker:"Объявления",
  announcementsTitle:"Текущие объявления",
  announcementsSubtitle:"Важные новости и объявления о библиотеке и платформе.",
  announcementsEmpty:"Активных объявлений пока нет.",
  annPriority:"Объявление", annPriorityHigh:"Важно",
  directorsKicker:"Команда",
  directorsTitle:"Команда библиотеки",
  directorsSubtitle:"Команда, ответственная за развитие и управление библиотекой ICCU.",
  director1Name:"Проф. д-р Абдулло Каримов",
  director1Role:"Исполнительный директор",
  director1Bio:"25 лет опыта в области исламской цивилизации и цифровых архивов. Руководит проектами совместно с ЮНЕСКО и ИСЕСКО.",
  director2Name:"Д-р Малика Юсупова",
  director2Role:"Заместитель директора по научной работе",
  director2Bio:"Специалист по рукописям и каталогизации. За 15 лет подготовила описания более 3 000 редких источников.",
  director3Name:"Жахонгир Мирзаев",
  director3Role:"Руководитель отдела цифровых технологий",
  director3Bio:"Ведущий специалист по цифровизации библиотечных систем и внедрению стандартов метаданных.",
  director4Name:"Дилноза Рашидова",
  director4Role:"Руководитель отдела международного сотрудничества",
  director4Bio:"Координирует отношения с международными библиотечными организациями. Активно работает с партнёрами в Стамбуле, Париже и Вашингтоне.",
  director5Name:"Бехзод Назаров",
  director5Role:"Руководитель отдела обслуживания пользователей",
  director5Bio:"Отвечает за услуги доступа, читальные залы и дистанционные ресурсы для исследователей и студентов.",
};

i18n.tr = {
  ...i18n.en,
  brandSubtitle:"İslam Medeniyeti Merkezi Kütüphanesi",
  navHome:"Ana sayfa", navDiscover:"Koleksiyonlar", navServices:"Hizmetler",
  navVisit:"Ziyaret", navAbout:"Hakkında", navPartners:"Ortaklar",
  navDirectors:"Ekibimiz", navAnnouncements:"Duyurular",
  navKirish:"Giriş", navRegister:"Kaydol",
  heroEyebrow:"Dijital miras platformu",
  heroTitle:"İslam medeniyeti kaynaklarını modern formatta keşfedin.",
  heroCopy:"ICCU Kütüphanesi el yazmaları, kitaplar, dersler, etkinlikler ve ziyaretçi hizmetlerini tek ve kullanıcı dostu bir platformda bir araya getirir.",
  heroPrimary:"Kaynak ara", heroSecondary:"Haberleri görüntüle",
  statBooks:"Kitaplar", statManuscripts:"El Yazmaları", statJournals:"Dergiler", statAccess:"Çevrimiçi erişim",
  updatesKicker:"Haberler", newsTitle:"Son haberler ve duyurular",
  newsSubtitle:"Önemli platform güncellemeleri, etkinlikler ve ortaklıklar.",
  quickKicker:"Hızlı hizmetler", quickTitle:"Kullanıcılar için temel yollar",
  quickSubtitle:"Katalog, el yazmaları, ziyaret ve kütüphaneci yardımı için kısayollar.",
  viewAll:"Tümünü görüntüle",
  qs1Title:"Dijital el yazmaları", qs1Text:"Nadir kaynaklar için görüntüleme ve erişim talepleri.",
  qs1Link:"Arşive git →",
  qs2Title:"Kütüphaneci yardımı", qs2Text:"Araştırma konuları, kaynak bulma ve bibliyografya konusunda destek.",
  qs2Link:"Başvuru yap →",
  qs3Title:"Ziyaret planla", qs3Text:"Çalışma saatleri, okuma salonları ve özel koleksiyon erişim kuralları.",
  qs3Link:"Ayrıntılar →",
  projectsKicker:"Platform projeleri", projectsTitle:"Aktif dijital kütüphane girişimleri",
  projectsSubtitle:"Kütüphaneyi günlük araştırma platformuna dönüştüren pratik çalışma alanları.",
  project1Status:"Aktif", project1Title:"Ortaklıklar",
  project1Text:"Üniversiteler, kütüphaneler ve araştırma merkezleriyle ortak projeler ve anlaşmalar.",
  project1Progress:"Aktif işbirliği", project1Count:"10+ ortak",
  project2Status:"7/24", project2Title:"Uzaktan erişim",
  project2Text:"Dijital katalog ve e-veritabanlarına evden 7/24 erişim imkânı.",
  project2Progress:"Her zaman açık", project2Count:"E-kütüphane",
  project3Status:"Canlı arşiv", project3Title:"Ders ve etkinlik arşivi",
  project3Text:"Videolar, transkriptler ve öğrenme yollarını koleksiyonlarla ilişkilendirme.",
  project3Progress:"Aktif", project3Count:"50+ video",
  project4Status:"Aktif", project4Title:"Grup ziyaretleri ve turlar",
  project4Text:"Öğrenci grupları, okullar ve kuruluşlar için kütüphane gezisi.",
  project4Progress:"Başvuru alınıyor", project4Count:"İletişim →",
  partnersKicker:"Ortaklar", partnersTitle:"Güvenilir ortaklar",
  partnersSubtitle:"Birlikte bilimsel ve dijital miras alanında çalışmaları ilerletiyoruz.",
  newsDetailKicker:"Haber", backNews:"Haberlere dön",
  detailSideTitle:"İlgili alanlar", detailSideText:"Bu haber, koleksiyonlar ve dijitalleştirme süreçleriyle bağlantılıdır.",
  discoverKicker:"Koleksiyonlar", discoverTitle:"Kütüphane koleksiyonları",
  discoverSubtitle:"Katalog, el yazmaları, akademisyenler, sergiler ve okuma listeleri.",
  d1Title:"Çevrimiçi katalog", d1Text:"Kitaplar, yazarlar, konular ve tanımlayıcılar.",
  d1f1:"120.000+ kitap ve yayın",
  d1f2:"Yazar, konu, yıl ve dile göre gelişmiş arama",
  d1f3:"ISBN, ISSN ve diğer tanımlayıcılarla arama",
  d1Cta:"Kataloğa gir →",
  d2Title:"El yazmaları", d2Text:"Dijital erişim notlarıyla nadir kaynaklar.",
  d2f1:"15.000+ nadir el yazması dijital arşivde",
  d2f2:"Osmanlı, Timuri ve diğer dönem koleksiyonları",
  d2f3:"Meta veri, dönem, dil ve durum bazlı filtreleme",
  d2Cta:"Arşive gir →",
  d3Title:"Allomalar", d3Text:"allomalar.uz ile bağlantılı bilgi yolu.",
  d3Link:"Allomalar.uz ↗",
  d4Title:"Kaynaklar", d4Text:"manbalar.uz kaynakları için hızlı yol.",
  d4Link:"Manbalar.uz ↗",
  d5Title:"Elektronik kütüphane", d5Text:"e-library.cisc.uz üzerinden dijital kaynak ve dergilere tam erişim.",
  d5Link:"E-library ↗",
  servicesKicker:"Hizmetler", servicesTitle:"Kütüphane hizmetleri",
  servicesSubtitle:"Araştırma, ziyaret, dijital koleksiyonlar ve ortaklık süreçleri için hizmetler.",
  svc1Title:"Kütüphaneciye sor", svc1Text:"Kaynak seçimi, bibliyografya ve araştırma yönlendirmesi konusunda rehberlik.",
  svc1f1:"Konuya uygun kaynak ve literatür seçimi",
  svc1f2:"Bibliyografya ve atıf biçimlendirme (APA, MLA, Chicago)",
  svc1f3:"Çevrimiçi ve fiziksel koleksiyonlara yönlendirme",
  svc1Cta:"İstek gönder →",
  svc2Title:"Özel koleksiyon talebi", svc2Text:"El yazması veya nadir materyal için önceden talep.",
  svc2f1:"Nadir el yazmalarına ve arşiv materyallerine erişim",
  svc2f2:"Ziyaretten önce çevrimiçi rezervasyon imkânı",
  svc2f3:"Dijital kopyalama hizmeti",
  svc2Cta:"İstek gönder →",
  svc3Title:"Ortaklıklar", svc3Text:"Üniversiteler ve araştırma merkezleriyle ortak projeler.",
  svc4Title:"Uzaktan erişim", svc4Text:"Dijital katalog ve e-veritabanlarına evden 7/24 erişim.",
  svc5Title:"Grup ziyaretleri ve turlar", svc5Text:"Öğrenci grupları, okullar ve kuruluşlar için kütüphane gezisi.",
  svcContact:"İletişim →", svcOpen:"Aç →",
  visitKicker:"Ziyaret", visitTitle:"Ziyaretinizi planlayın",
  visitSubtitle:"Çalışma saatleri, adres ve okuma salonu kuralları.",
  hoursTitle:"Çalışma saatleri",
  weekday:"Pazartesi – Cuma: 09:00 – 18:00",
  out:"Cumartesi: 10:00 – 16:00",
  holidays:"Pazar: Kapalı",
  contactTitle:"İletişim ve adres", address:"Adres: Taşkent, Özbekistan",
  email:"E-posta: library@iccu.example", phone:"Telefon: +998 00 000 00 00",
  rulesTitle:"Kütüphane kuralları",
  rule1:"Okuma salonlarında sessizliği koruyun.",
  rule2:"Yiyecek ve içecek koleksiyon alanına alınamaz.",
  rule3:"El yazmalarının fotoğraflanması için izin gereklidir.",
  beforeTitle:"Gelmeden önce",
  beforeText:"Kimlik belgesi getirin ve nadir materyalleri önceden rezerve edin.",
  mapText:"Etkileşimli harita alanı",
  floorPlanBtn:"Kütüphanenin iç haritasını görüntüle",
  floorPlanKicker:"Kütüphane haritası",
  floorPlanTitle:"İç yapı haritası",
  floorPlanHint:"Yakınlaştırmak için fare tekerleği · Sürükle",
  aboutKicker:"Hakkında", aboutTitle:"Kütüphane hakkında",
  aboutSubtitle:"ICCU Kütüphanesi, İslam medeniyeti mirasını korumak, incelemek ve geniş kitlelere ulaştırmak için hizmet vermektedir.",
  abStat1:"Toplam literatür", abStat2:"Elektronik kopya",
  abStat3:"El yazması", abStat4:"Kütüphane alanı",
  abStat5:"Koltuk kapasitesi", abStat6:"Dijitalleştirilmiş nadir eser",
  aboutFondKicker:"Fon hakkında", aboutFondTitle:"2025 yılı sonuçları",
  abH1:"Yeni kabul edilen literatür", abH1sub:"3.879 bağış, 910 satın alma",
  abH2:"Veritabanındaki yazılı kaynak", abH2sub:"El yazmaları ve taş baskılar",
  abH3:"Yazılı kaynak sicili", abH3sub:"Pasaportu hazırlanan kaynaklar",
  abH4:"Braille literatürü", abH4sub:"Engelli bireyler için",
  mission1Title:"Koruma", mission1Text:"Nadir el yazmaları ve kitapların dijitalleştirilmesi ve konservasyonu.",
  mission2Title:"Erişim", mission2Text:"Öğrenciler, araştırmacılar ve kamuoyu için açık bilgi yolları.",
  mission3Title:"Geliştirme", mission3Text:"Modern bilgi-kütüphane hizmetlerinin genişletilmesi ve bilime hizmet eden projeler.",
  faq1Q:"Okuyucu kartını nasıl alabilirim?", faq1A:"Kimlik belgesiyle kayıt masasına başvurun.",
  faq2Q:"Dijital kaynaklara evden erişebilir miyim?",
  faq2A:"Birçok kaynak çevrimiçi mevcuttur; bazı veritabanları hesap gerektirir.",
  faq3Q:"Kütüphanede kaç koltuk var?", faq3A:"Kütüphane aynı anda 310 okuyucuya hizmet verebilmektedir.",
  faq4Q:"Nadir el yazmalarını görebilir miyim?",
  faq4A:"Evet, önceden talep göndererek nadir koleksiyon materyallerine erişebilirsiniz.",
  footerText:"Dijital koleksiyonlar, ziyaretçi hizmetleri ve araştırma kaynakları için tek platform.",
  footerContacts:"İletişim", footerLinks:"Hızlı bağlantılar",
  footerSocials:"Sosyal hesaplar", footerRights:"ICCU — İslam Medeniyeti Merkezi",
  kioskLabel:"Yeni duyuru",
  kioskDefaultTitle:"Duyurular yükleniyor...",
  kioskViewAll:"Görüntüle →",
  announcementsKicker:"Duyurular",
  announcementsTitle:"Güncel duyurular",
  announcementsSubtitle:"Kütüphane ve platform hakkında önemli haberler ve duyurular.",
  announcementsEmpty:"Şu an aktif duyuru bulunmamaktadır.",
  annPriority:"Duyuru", annPriorityHigh:"Önemli",
  directorsKicker:"Ekip",
  directorsTitle:"Kütüphane ekibi",
  directorsSubtitle:"ICCU Kütüphanesini geliştirmekten ve yönetmekten sorumlu ekip.",
  director1Name:"Prof. Dr. Abdulloh Karimov",
  director1Role:"Genel Müdür",
  director1Bio:"İslam medeniyeti çalışmaları ve dijital arşivlerde 25 yıllık deneyim. UNESCO ve ISESCO ile işbirliği projelerine liderlik eder.",
  director2Name:"Dr. Malika Yusupova",
  director2Role:"Araştırma Genel Müdür Yardımcısı",
  director2Bio:"El yazmaları ve kataloglama uzmanı. 15 yıllık çalışmada 3.000+ nadir kaynak tanımı hazırladı.",
  director3Name:"Jahongir Mirzayev",
  director3Role:"Dijital Teknolojiler Bölüm Başkanı",
  director3Bio:"Kütüphane sistemlerinin dijitalleştirilmesi ve meta veri standartlarının uygulanması konusunda baş uzman.",
  director4Name:"Dilnoza Rashidova",
  director4Role:"Uluslararası İşbirliği Bölüm Başkanı",
  director4Bio:"Uluslararası kütüphane kuruluşlarıyla ilişkileri koordine eder. İstanbul, Paris ve Washington'daki ortaklarla aktif çalışır.",
  director5Name:"Behzod Nazarov",
  director5Role:"Kullanıcı Hizmetleri Bölüm Başkanı",
  director5Bio:"Araştırmacılar ve öğrenciler için erişim hizmetleri, okuma odaları ve uzaktan kaynaklardan sorumludur.",
};

/* ─────────────────────────────────────────────
   Lang management
───────────────────────────────────────────── */
let currentLang = "uz";

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update flag image in trigger
  const flagMap = { uz:"uz", en:"gb", ru:"ru", tr:"tr" };
  const flagImg = document.getElementById("current-flag");
  if (flagImg) flagImg.src = `https://flagcdn.com/w20/${flagMap[lang]}.png`;

  // Update active state on lang options
  document.querySelectorAll(".lang-option").forEach(btn => {
    const btnLang = btn.getAttribute("onclick").match(/setLang\('(\w+)'\)/)?.[1];
    btn.classList.toggle("active", btnLang === lang);
  });

  closeLangMenu();
  applyTexts();
}

function applyTexts() {
  const dict = i18n[currentLang] || i18n.uz;
  document.querySelectorAll("[data-t]").forEach(el => {
    const key = el.getAttribute("data-t");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  // News grid til almashganda qayta chiziladi
  if (liveNews.length) renderNewsGrid();
  // Kiosk & announcements page re-render on lang change
  if (liveAnnouncements && liveAnnouncements.length) {
    renderKiosk();
    renderAnnouncementsPage();
  } else {
    // Update demo kiosk text
    const demoTitles = {
      uz: "Kutubxonaga xush kelibsiz! Yangi xizmatlar va tadbirlar haqida kuzatib boring.",
      en: "Welcome to the Library! Stay tuned for new services and events.",
      ru: "Добро пожаловать в библиотеку! Следите за новыми услугами и мероприятиями.",
      tr: "Kütüphaneye hoş geldiniz! Yeni hizmetler ve etkinlikler için takipte kalın.",
    };
    const demoEl = document.getElementById("kiosk-title");
    if (demoEl && demoEl.dataset.t === "kioskDefaultTitle") {
      demoEl.textContent = demoTitles[currentLang] || demoTitles.uz;
    }
  }
}

function toggleLangMenu() {
  const menu    = document.getElementById("lang-menu");
  const trigger = document.getElementById("lang-trigger");
  const isOpen  = menu.classList.toggle("open");
  trigger.setAttribute("aria-expanded", isOpen);
  trigger.classList.toggle("open", isOpen);
}

function closeLangMenu() {
  const menu    = document.getElementById("lang-menu");
  const trigger = document.getElementById("lang-trigger");
  menu.classList.remove("open");
  trigger.classList.remove("open");
  trigger.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", e => {
  if (!e.target.closest(".lang-wrap")) closeLangMenu();
});

/* ─────────────────────────────────────────────
   Page navigation
───────────────────────────────────────────── */
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  const page = document.getElementById(`page-${name}`);
  const nav  = document.getElementById(`nav-${name}`);
  if (page) page.classList.add("active");
  if (nav)  nav.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Re-render announcements page when navigating to it
  if (name === "announcements" && liveAnnouncements.length > 0) renderAnnouncementsPage();
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────
   News — load from Supabase
───────────────────────────────────────────── */
async function loadNews() {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  try {
    liveNews = await sbGet(
      "/news?is_published=eq.true&order=published_at.desc&limit=9&select=*"
    );
    renderNewsGrid();
  } catch (e) {
    console.error("News yuklanmadi:", e);
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:32px 0">Yangiliklar yuklanmadi.</p>`;
  }
}

function getCardsPerPage() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 980) return 2;
  return 3;
}

function renderNewsGrid() {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  if (!liveNews.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:32px 0">Hozircha yangiliklar yo'q.</p>`;
    renderCarouselDots(0);
    return;
  }

  const cpp   = getCardsPerPage();
  const total = Math.ceil(liveNews.length / cpp);
  // clamp page
  if (carouselPage >= total) carouselPage = total - 1;
  if (carouselPage < 0)      carouselPage = 0;

  const start = carouselPage * cpp;
  const slice = liveNews.slice(start, start + cpp);
  const lang  = currentLang;

  grid.innerHTML = slice.map(n => {
    const tag      = n[`tag_${lang}`]      || n.tag_uz      || n.tag_en || "";
    const headline = n[`headline_${lang}`] || n.headline_uz || n.headline_en || "";
    const excerpt  = n[`excerpt_${lang}`]  || n.excerpt_uz  || n.excerpt_en  || "";
    const body     = n[`body_${lang}`]     || n.body_uz     || n.body_en     || "";
    const preview  = excerpt || body.slice(0, 120) + (body.length > 120 ? "\u2026" : "");
    const date     = formatDate(n.published_at, lang);
    const artStyle = n.image_url
      ? `background-image:url('${n.image_url}');background-size:cover;background-position:center;`
      : `--art-color:${n.art_color || '#1a5e43'}`;
    const moreLabel = { uz:"Batafsil", en:"Read more", ru:"Подробнее", tr:"Devamı" }[lang] || "Batafsil";

    return `<article class="news-card" tabindex="0" role="button"
      onkeydown="cardKey(event,()=>openNews(${n.id}))">
      <div class="news-art" style="${artStyle}"></div>
      <div class="news-body">
        <span class="news-tag">${tag}</span>
        <h3>${headline}</h3>
        <p>${preview}</p>
        <button class="news-more-btn" onclick="openNews(${n.id})">${moreLabel} →</button>
        <div class="date">${date}</div>
      </div>
    </article>`;
  }).join("");

  renderCarouselDots(total);
  updateCarouselArrows(total);
}

function renderCarouselDots(total) {
  const dotsEl = document.getElementById("carousel-dots");
  if (!dotsEl) return;
  dotsEl.innerHTML = Array.from({length: total}, (_,i) =>
    `<button class="carousel-dot-item ${i===carouselPage?"active":""}"
      onclick="goCarouselPage(${i})" aria-label="${i+1}-sahifa"></button>`
  ).join("");
}

function updateCarouselArrows(total) {
  const prev = document.querySelector(".carousel-arrow--prev");
  const next = document.querySelector(".carousel-arrow--next");
  if (prev) prev.disabled = carouselPage === 0;
  if (next) next.disabled = carouselPage >= total - 1;
}

function newsCarousel(dir) {
  const cpp   = getCardsPerPage();
  const total = Math.ceil(liveNews.length / cpp);
  carouselPage = Math.max(0, Math.min(total - 1, carouselPage + dir));
  renderNewsGrid();
}

function goCarouselPage(idx) {
  carouselPage = idx;
  renderNewsGrid();
}

window.addEventListener("resize", () => {
  carouselPage = 0;
  renderNewsGrid();
});

function formatDate(iso, lang) {
  const d = new Date(iso);
  const localeMap = { uz:"uz-UZ", en:"en-GB", ru:"ru-RU", tr:"tr-TR" };
  return d.toLocaleDateString(localeMap[lang] || "en-GB", { day:"numeric", month:"long", year:"numeric" });
}

/* ─────────────────────────────────────────────
   News detail
───────────────────────────────────────────── */
function openNews(id) {
  const n = liveNews.find(x => x.id === id);
  if (!n) return;

  const lang     = currentLang;
  const tag      = n[`tag_${lang}`]      || n.tag_uz      || n.tag_en || "";
  const headline = n[`headline_${lang}`] || n.headline_uz || n.headline_en || "";
  const body     = n[`body_${lang}`]     || n.body_uz     || n.body_en || "";
  const date     = formatDate(n.published_at, lang);

  document.getElementById("detail-tag").textContent     = tag;
  document.getElementById("detail-title").textContent   = headline;
  document.getElementById("detail-heading").textContent = headline;
  document.getElementById("detail-body").textContent    = body;
  document.getElementById("detail-extra").textContent   = "";
  document.getElementById("detail-date").textContent    = date;

  // Image in detail view
  let imgEl = document.getElementById("detail-img");
  if (!imgEl) {
    imgEl = document.createElement("img");
    imgEl.id = "detail-img";
    imgEl.style.cssText = "width:100%;max-height:280px;object-fit:cover;border-radius:8px;margin-bottom:16px;display:block;";
    const panel = document.querySelector(".article-panel");
    if (panel) panel.insertBefore(imgEl, panel.querySelector("span"));
  }
  if (n.image_url) {
    imgEl.src   = n.image_url;
    imgEl.style.display = "block";
  } else {
    imgEl.style.display = "none";
  }

  showPage("news-detail");
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
function toggleFaq(id, button) {
  const answer    = document.getElementById(id);
  const indicator = button.querySelector("span:last-child");
  const isOpen    = answer.classList.contains("open");
  document.querySelectorAll(".faq-answer").forEach(a => a.classList.remove("open"));
  document.querySelectorAll(".faq-question span:last-child").forEach(s => s.textContent = "+");
  if (!isOpen) { answer.classList.add("open"); indicator.textContent = "−"; }
}

/* ─────────────────────────────────────────────
   Keyboard helpers
───────────────────────────────────────────── */
function cardKey(e, fn) {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
}

/* ── FLOOR PLAN ── */
let fpScale = 1, fpX = 0, fpY = 0, fpDragging = false, fpStart = {};

function openFloorPlan() {
  document.getElementById("fp-modal").classList.add("open");
  document.body.classList.add("modal-open");
  fpReset();
  initFPDrag();
}
function closeFloorPlan() {
  document.getElementById("fp-modal").classList.remove("open");
  document.body.classList.remove("modal-open");
}
function closeFPifOutside(e) {
  if (e.target.id === "fp-modal") closeFloorPlan();
}

function fpZoom(delta) {
  fpScale = Math.min(4, Math.max(0.3, fpScale + delta));
  applyFPTransform();
}
function fpReset() {
  fpScale = 1; fpX = 0; fpY = 0;
  applyFPTransform();
}
function applyFPTransform() {
  const c = document.getElementById("fp-canvas");
  if (c) c.style.transform =
    `translate(calc(-50% + ${fpX}px), calc(-50% + ${fpY}px)) scale(${fpScale})`;
}

function initFPDrag() {
  const vp = document.getElementById("fp-viewport");
  if (!vp || vp._fpInit) return;
  vp._fpInit = true;

  // Mouse
  vp.addEventListener("mousedown", e => {
    fpDragging = true;
    fpStart = { x: e.clientX - fpX, y: e.clientY - fpY };
    e.preventDefault();
  });
  window.addEventListener("mousemove", e => {
    if (!fpDragging) return;
    fpX = e.clientX - fpStart.x;
    fpY = e.clientY - fpStart.y;
    applyFPTransform();
  });
  window.addEventListener("mouseup", () => { fpDragging = false; });

  // Wheel zoom
  vp.addEventListener("wheel", e => {
    e.preventDefault();
    fpZoom(e.deltaY < 0 ? 0.15 : -0.15);
  }, { passive: false });

  // Touch
  let lastDist = 0;
  vp.addEventListener("touchstart", e => {
    if (e.touches.length === 1) {
      fpDragging = true;
      fpStart = { x: e.touches[0].clientX - fpX, y: e.touches[0].clientY - fpY };
    } else if (e.touches.length === 2) {
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });
  vp.addEventListener("touchmove", e => {
    if (e.touches.length === 1 && fpDragging) {
      fpX = e.touches[0].clientX - fpStart.x;
      fpY = e.touches[0].clientY - fpStart.y;
      applyFPTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      fpZoom((dist - lastDist) * 0.008);
      lastDist = dist;
    }
  }, { passive: true });
  vp.addEventListener("touchend", () => { fpDragging = false; });
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeFloorPlan();
});

/* ─────────────────────────────────────────────
   Hero carousel
───────────────────────────────────────────── */
let heroSlideIndex = 0;
const HERO_INTERVAL = 6000;

function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  function goTo(idx) {
    slides[heroSlideIndex].classList.remove("active");
    dots[heroSlideIndex].classList.remove("active");
    heroSlideIndex = (idx + slides.length) % slides.length;
    slides[heroSlideIndex].classList.add("active");
    dots[heroSlideIndex].classList.add("active");
  }

  // Dots click
  dots.forEach((dot, i) => dot.addEventListener("click", () => {
    clearInterval(heroTimer);
    goTo(i);
    heroTimer = setInterval(() => goTo(heroSlideIndex + 1), HERO_INTERVAL);
  }));

  // Auto play
  goTo(0);
  let heroTimer = setInterval(() => goTo(heroSlideIndex + 1), HERO_INTERVAL);
}

/* ─────────────────────────────────────────────
   Boot
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  applyTexts();
  initHeroCarousel();
  loadNews();
  loadAnnouncements();
});

/* ─────────────────────────────────────────────
   Announcements
───────────────────────────────────────────── */
let liveAnnouncements = [];

async function loadAnnouncements() {
  // Dismiss check
  if (sessionStorage.getItem("kiosk_dismissed")) {
    const wrap = document.getElementById("kiosk-wrap");
    if (wrap) wrap.classList.add("dismissed");
    return;
  }

  try {
    liveAnnouncements = await sbGet(
      "/announcements?is_active=eq.true&order=starts_at.desc&limit=20&select=*"
    );
  } catch (e) {
    // Table may not exist yet — use a demo item so kiosk still shows
    console.warn("Announcements table not found or error:", e.message);
    liveAnnouncements = [];
  }

  // Show demo kiosk item if no real data
  if (!liveAnnouncements.length) {
    const lang = currentLang;
    const dict = i18n[lang] || i18n.uz;
    const demoTitles = {
      uz: "Kutubxonaga xush kelibsiz! Yangi xizmatlar va tadbirlar haqida kuzatib boring.",
      en: "Welcome to the Library! Stay tuned for new services and events.",
      ru: "Добро пожаловать в библиотеку! Следите за новыми услугами и мероприятиями.",
      tr: "Kütüphaneye hoş geldiniz! Yeni hizmetler ve etkinlikler için takipte kalın.",
    };
    const demoEl = document.getElementById("kiosk-title");
    if (demoEl) demoEl.textContent = demoTitles[lang] || demoTitles.uz;
    const excerptEl = document.getElementById("kiosk-excerpt");
    if (excerptEl) excerptEl.textContent = "";
    return;
  }

  renderKiosk();
  renderAnnouncementsPage();

  // Show badge on nav
  const dot = document.getElementById("ann-nav-dot");
  if (dot) dot.style.display = "";
}

function renderKiosk() {
  const ann   = liveAnnouncements[0];
  if (!ann) return;

  const lang    = currentLang;
  const title   = ann[`title_${lang}`] || ann.title_uz || ann.title_en || "";
  const body    = ann[`body_${lang}`]  || ann.body_uz  || ann.body_en  || "";

  const titleEl   = document.getElementById("kiosk-title");
  const excerptEl = document.getElementById("kiosk-excerpt");

  if (titleEl)   titleEl.textContent   = title;
  if (excerptEl) excerptEl.textContent = body.slice(0, 120) + (body.length > 120 ? "\u2026" : "");

  // Set accent color
  const inner = document.getElementById("kiosk-inner");
  if (inner && ann.art_color) {
    inner.style.setProperty("--ann-accent", ann.art_color);
  }
}

function renderAnnouncementsPage() {
  const grid = document.getElementById("ann-page-grid");
  if (!grid) return;

  const lang = currentLang;
  const dict = i18n[lang] || i18n.uz;

  if (!liveAnnouncements.length) {
    grid.innerHTML = `<div class="ann-empty"><div class="ann-empty-ico">📢</div><p>${dict.announcementsEmpty || "Hozircha faol e'lonlar yo'q."}</p></div>`;
    return;
  }

  grid.innerHTML = liveAnnouncements.map(ann => {
    const title    = ann[`title_${lang}`] || ann.title_uz || ann.title_en || "";
    const body     = ann[`body_${lang}`]  || ann.body_uz  || ann.body_en  || "";
    const isHigh   = ann.priority === "high";
    const accent   = ann.art_color || (isHigh ? "#e05c5c" : "#c8a45d");
    const badgeLabel = isHigh ? (dict.annPriorityHigh || "Muhim") : (dict.annPriority || "E'lon");
    const date     = ann.starts_at ? formatDate(ann.starts_at, lang) : "";

    return `<div class="ann-card ${isHigh ? "ann-priority-high" : ""}" style="--ann-accent:${accent}">
      <div class="ann-card-top">
        <span class="ann-badge"><span class="ann-badge-dot"></span>${badgeLabel}</span>
        <span class="ann-date">${date}</span>
      </div>
      <div class="ann-title">${title}</div>
      <div class="ann-body">${body}</div>
    </div>`;
  }).join("");
}

function kioskClick(e) {
  if (e.target.closest(".kiosk-dismiss") || e.target.closest(".kiosk-cta")) return;
  showPage("announcements");
}

function dismissKiosk() {
  sessionStorage.setItem("kiosk_dismissed", "1");
  const wrap = document.getElementById("kiosk-wrap");
  if (wrap) wrap.classList.add("dismissed");
}