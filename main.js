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
    brandSubtitle:"Islom sivilizatsiyasi kutubxonasi",
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
    newsTitle:"So'nggi yangiliklar va e'lonlar",
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
    project1Status:"Jarayonda", project1Title:"Qo'lyozmalarni raqamlashtirish",
    project1Text:"Suratga olish, metadata, konservatsiya qaydlari va kirish so'rovlarini bitta jarayonga yig'ish.",
    project2Status:"Pilot", project2Title:"Tadqiqotchi kabineti",
    project2Text:"Saqlangan qidiruvlar, o'qish ro'yxatlari va material so'rovlari uchun shaxsiy hudud.",
    project3Status:"Jonli arxiv", project3Title:"Ma'ruza va tadbirlar arxivi",
    project3Text:"Videolar, transkriptlar va o'quv yo'llarini fondlar bilan bog'lash.",
    project4Status:"Keyingi reliz", project4Title:"Tashrif va xona band qilish",
    project4Text:"O'qish zali o'rinlari, maxsus fond uchrashuvlari va tashrif rejasini boshqarish.",
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
    faq3A:"Kutubxona bir vaqtning o'zida 266 nafar kitobxonga xizmat ko'rsatish imkoniyatiga ega.",
    faq4Q:"Nodir qo'lyozmalarni ko'rish mumkinmi?",
    faq4A:"Ha, oldindan so'rov yuborish orqali nodir fond materiallaridan foydalanish mumkin. Raqamlashtirish bo'limiga murojaat qiling.",
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
  project1Status:"In progress", project1Title:"Manuscript digitization",
  project1Text:"Capture, metadata, conservation notes, and access requests in one workflow.",
  project2Status:"Pilot", project2Title:"Researcher cabinet",
  project2Text:"Saved searches, reading lists, and material requests in a personal space.",
  project3Status:"Live archive", project3Title:"Lecture and event archive",
  project3Text:"Connect videos, transcripts, and learning paths with collections.",
  project4Status:"Next release", project4Title:"Visit and room booking",
  project4Text:"Manage reading room seats, special collection appointments, and visit plans.",
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
};

i18n.ru = {
  ...i18n.en,
  brandSubtitle:"Библиотека исламской цивилизации",
  navHome:"Главная", navDiscover:"Фонды", navServices:"Услуги",
  navVisit:"Визит", navAbout:"О нас", navPartners:"Партнёры",
  navDirectors:"Команда",
  navKirish:"Войти", navRegister:"Регистрация",
  heroEyebrow:"Платформа цифрового наследия",
  heroTitle:"Откройте источники исламской цивилизации.",
  heroCopy:"ICCU Библиотека объединяет рукописи, книги, лекции и услуги посетителей на единой платформе.",
  heroPrimary:"Поиск ресурсов", heroSecondary:"Читать новости",
  updatesKicker:"Новости", newsTitle:"Последние новости и объявления",
  quickKicker:"Быстрые услуги", quickTitle:"Основные пути для пользователей",
  projectsKicker:"Проекты", projectsTitle:"Активные цифровые инициативы",
  partnersKicker:"Партнёры", partnersTitle:"Надёжные партнёры",
  discoverKicker:"Фонды", discoverTitle:"Фонды библиотеки",
  servicesKicker:"Услуги", servicesTitle:"Услуги библиотеки",
  visitKicker:"Визит", visitTitle:"Планируйте визит",
  aboutKicker:"О нас", aboutTitle:"О библиотеке",
  footerContacts:"Контакты", footerLinks:"Быстрые ссылки",
  footerSocials:"Социальные сети", footerRights:"ICCU — Центр исламской цивилизации",
  directorsKicker:"Команда",
  directorsTitle:"Команда библиотеки",
  directorsSubtitle:"Команда, ответственная за развитие и управление библиотекой ICCU.",
  director1Name:"Проф. д-р Абдулло Каримов",
  director1Role:"Исполнительный директор",
  director1Bio:"25 лет опыта в области исламской цивилизации и цифровых архивов. Руководит проектами совместно с ЮНЕСКО и ИСЕСКО.",
  director2Name:"Д-р Малика Юсупова",
  director2Role:"Заместитель директора по научной работе",
  director2Bio:"Специалист по рукописям и каталогизации. За 15 лет научной деятельности подготовила описания более 3 000 редких источников.",
  director3Name:"Жахонгир Мирзаев",
  director3Role:"Руководитель отдела цифровых технологий",
  director3Bio:"Ведущий специалист по цифровизации библиотечных систем и внедрению стандартов метаданных.",
  director4Name:"Дилноза Рашидова",
  director4Role:"Руководитель отдела международного сотрудничества",
  director4Bio:"Координирует отношения с международными библиотечными организациями. Активно работает с партнёрскими библиотеками в Стамбуле, Париже и Вашингтоне.",
  director5Name:"Бехзод Назаров",
  director5Role:"Руководитель отдела обслуживания пользователей",
  director5Bio:"Отвечает за услуги доступа, читальные залы и дистанционные ресурсы для исследователей и студентов.",
};

i18n.tr = {
  ...i18n.en,
  brandSubtitle:"İslam Medeniyeti Kütüphanesi",
  navHome:"Ana sayfa", navDiscover:"Koleksiyonlar", navServices:"Hizmetler",
  navVisit:"Ziyaret", navAbout:"Hakkında", navPartners:"Ortaklar",
  navDirectors:"Ekibimiz",
  navKirish:"Giriş", navRegister:"Kaydol",
  heroEyebrow:"Dijital miras platformu",
  heroTitle:"İslam medeniyeti kaynaklarını modern formatta keşfedin.",
  heroCopy:"ICCU Kütüphanesi el yazmaları, kitaplar, dersler ve ziyaretçi hizmetlerini tek platformda bir araya getirir.",
  heroPrimary:"Kaynak ara", heroSecondary:"Haberleri görüntüle",
  updatesKicker:"Haberler", newsTitle:"Son haberler ve duyurular",
  quickKicker:"Hızlı hizmetler", quickTitle:"Kullanıcılar için temel yollar",
  projectsKicker:"Projeler", projectsTitle:"Aktif dijital kütüphane girişimleri",
  partnersKicker:"Ortaklar", partnersTitle:"Güvenilir ortaklar",
  discoverKicker:"Koleksiyonlar", discoverTitle:"Kütüphane koleksiyonları",
  servicesKicker:"Hizmetler", servicesTitle:"Kütüphane hizmetleri",
  visitKicker:"Ziyaret", visitTitle:"Ziyaretinizi planlayın",
  aboutKicker:"Hakkında", aboutTitle:"Kütüphane hakkında",
  footerContacts:"İletişim", footerLinks:"Hızlı bağlantılar",
  footerSocials:"Sosyal hesaplar", footerRights:"ICCU — İslam Medeniyeti Merkezi",
  directorsKicker:"Ekip",
  directorsTitle:"Kütüphane ekibi",
  directorsSubtitle:"ICCU Kütüphanesini geliştirmekten ve yönetmekten sorumlu ekip.",
  director1Name:"Prof. Dr. Abdulloh Karimov",
  director1Role:"Genel Müdür",
  director1Bio:"İslam medeniyeti çalışmaları ve dijital arşivlerde 25 yıllık deneyim. UNESCO ve ISESCO ile işbirliği projelerine liderlik eder.",
  director2Name:"Dr. Malika Yusupova",
  director2Role:"Araştırma Genel Müdür Yardımcısı",
  director2Bio:"El yazmaları ve kataloglama uzmanı. 15 yıllık bilimsel çalışmada 3.000'den fazla nadir kaynak tanımı hazırladı.",
  director3Name:"Jahongir Mirzayev",
  director3Role:"Dijital Teknolojiler Bölüm Başkanı",
  director3Bio:"Kütüphane sistemlerinin dijitalleştirilmesi ve meta veri standartlarının uygulanması konusunda baş uzman.",
  director4Name:"Dilnoza Rashidova",
  director4Role:"Uluslararası İşbirliği Bölüm Başkanı",
  director4Bio:"Uluslararası kütüphane kuruluşlarıyla ilişkileri koordine eder. İstanbul, Paris ve Washington'daki ortak kütüphanelerle aktif olarak çalışır.",
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
});