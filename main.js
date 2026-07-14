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
    saturday:"Shanba: 10:00 – 16:00", sunday:"Yakshanba: yopiq",

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
    floorPlanTitle:"Kutubxona o'quv zali xaritasi",
    floorPlanHint:"Sichqoncha g'ildiragi bilan zoom · Bosib suring",
    /* Directors page */
    directorsKicker:"Jamoa",
    directorsTitle:"Kutubxona jamoasi",
    directorsSubtitle:"ICCU kutubxonasini rivojlantirish va boshqarishga mas'ul mutaxassislar jamoasi.",
    director1Name:"Qodirov Ravshan Lazizovich",
    director1Role:"Bo'lim boshlig'i",
    director1Bio:"Islom sivilizatsiyasi markazi kutubxonasining umumiy faoliyatiga rahbarlik qiladi. Ilmiy-tadqiqot va raqamlashtirish loyihalarini muvofiqlashtiradi.",
    director2Name:"Islomova Muqaddas Shogulyamovna",
    director2Role:"Yetakchi mutaxassis",
    director2Bio:"Nodir qo'lyozmalar va toshbosma asarlarni tizimlashtirish, tavsiflash va ilmiy-tadqiq qilish faoliyati bilan shug'ullanadi.",
    director3Name:"Nigmatova Sevara Irgashevna",
    director3Role:"Kutubxona bosh mutaxassisi",
    director3Bio:"Axborot-kutubxona resurslarini jamlash va raqamli ma'lumotlar bazasini shakllantirish jarayonlarini boshqaradi.",
    director4Name:"Sagdiyeva Xiromon Xolxo'jayevna",
    director4Role:"Kutubxona bosh mutaxassisi",
    director4Bio:"Xalqaro hamkorlik aloqalarini o'rnatish, chet el kutubxonalari bilan tajriba almashish va birgalikdagi loyihalarni amalga oshirishga mas'ul.",
    director5Name:"Karimova Mavluda Anvarovna",
    director5Role:"Kutubxona bosh mutaxassisi",
    director5Bio:"Foydalanuvchilarga xizmat ko'rsatish, o'qish zallari va masofaviy axborot-kutubxona xizmatlarini tashkil etish ishlarini olib boradi.",
    navAnnouncements:"E'lonlar",
    kioskLabel:"Yangi e'lon",
    kioskDefaultTitle:"E'lonlar yuklanmoqda...",
    kioskViewAll:"Ko'rish →",
    announcementsKicker:"E'lonlar",
    announcementsTitle:"Joriy e'lonlar",
    announcementsSubtitle:"Kutubxona va platforma bo'yicha muhim xabarlar va e'lonlar.",
    announcementsEmpty:"Hozircha faol e'lonlar yo'q.",
    annPriority:"E'lon", annPriorityHigh:"Muhim",
    navMap:"Xarita",
    nav3D:"3D Sayohat",
    close:"Yopish",
    zoomIn:"Kattalashtirish",
    zoomOut:"Kichiklashtirish",
    resetSize:"Asl o'lcham",
    ariaHome:"Bosh sahifaga o'tish",
    ariaMenu:"Menyuni ochish",
    regTitle:"Ro'yxatdan o'tish",
    regSubtitle:"Kutubxona tizimidan to'liq foydalanish uchun profil yarating.",
    regNameLabel:"Ism va familiyangiz",
    regNamePlaceholder:"Ali Valiyev",
    regEmailLabel:"Elektron pochta",
    regEmailPlaceholder:"example@mail.com",
    regPasswordLabel:"Parol",
    regPasswordPlaceholder:"••••••••",
    regSubmit:"Tasdiqlash",
    regSuccess:"Muvaffaqiyatli ro'yxatdan o'tdingiz!",
    partnerBnf:"Bibliothèque nationale de France",
    partnerLoc:"Kongress kutubxonasi",
    partnerIstanbul:"Istanbul Universiteti",
    partnerOzmu:"O'zMU",
    partnerTurkiston:"Turkiston Kutubxonasi",
    floorPlanFallback:"floor-plan.svg fayli<br>images/ papkasiga qo'ying",
    footerAddress:"Toshkent, O'zbekiston",
    directorBadge:"Bosh direktor",
    tour3dKicker: "Virtual Tashrif",
    tour3dTitle: "Kutubxona 3D Virtual Sayohati",
    tour3dSubtitle: "Kutubxona binolari va zallarini 3D model orqali masofadan o'rganing. Zallarni ko'rish uchun belgilarni bosing.",
    tdAutoRotate: "Avtomatik aylantirish",
    tdReset: "Kamerani qaytarish",
    tdFullscreen: "To'liq ekran",
    tdHint: "Sichqoncha bilan aylantirish · Zoom · Belgilarni bosing",
    tdHallReadingTitle: "Asosiy o'quv zali",
    tdHallReadingDesc: "Zamonaviy jihozlangan, 200 dan ortiq o'ringa ega yorug' o'quv zali. Bu yerda asosiy fond darsliklari va elektron resurslardan foydalanish mumkin.",
    tdHallManuscriptsTitle: "Qo'lyozmalar fondi",
    tdHallManuscriptsDesc: "Islom sivilizatsiyasiga oid 15 000 dan ortiq nodir qo'lyozma va toshbosma asarlar saqlanadigan bo'lim. Harorat va namlik doimiy nazorat qilinadi.",
    tdHallDigiTitle: "Raqamlashtirish laboratoriyasi",
    tdHallDigiDesc: "Nodir manbalarni yuqori aniqlikda skanerlash va raqamli formatga o'tkazish markazi. Bu yerda asarlar kelajak avlodlar uchun saqlanadi.",
    tdHallGalleryTitle: "Ko'rgazmalar galereyasi",
    tdHallGalleryDesc: "Kutubxonadagi eng qadimiy manbalar va tarixiy yozuvlar ko'rgazmasi joylashgan hudud. Tashrif buyuruvchilar uchun ochiq eksponatlar mavjud.",
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
  saturday:"Saturday: 10:00 – 16:00", sunday:"Sunday: closed",

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
  director1Name:"Qodirov Ravshan Lazizovich",
  director1Role:"Director General",
  director1Bio:"Leads the overall operations of the Islamic Civilization Center Library. Coordinates scientific research and digitization initiatives.",
  director2Name:"Islomova Muqaddas Shogulyamovna",
  director2Role:"Library Leading Specialist",
  director2Bio:"Specializes in cataloging, describing, and conducting scholarly research on rare manuscripts and lithographed books.",
  director3Name:"Nigmatova Sevara Irgashevna",
  director3Role:"Library Chief Specialist",
  director3Bio:"Manages the acquisition of library resources and the development of digital information databases.",
  director4Name:"Sagdiyeva Xiromon Xolxo'jayevna",
  director4Role:"Library Chief Specialist",
  director4Bio:"Responsible for establishing international partnerships, executing cooperative library projects, and sharing best practices worldwide.",
  director5Name:"Karimova Mavluda Anvarovna",
  director5Role:"Library Chief Specialist",
  director5Bio:"Oversees user services, reading rooms coordination, and the delivery of remote library and information services.",
  navAnnouncements:"Announcements",
  kioskLabel:"New announcement",
  kioskDefaultTitle:"Loading announcements...",
  kioskViewAll:"View all →",
  announcementsKicker:"Announcements",
  announcementsTitle:"Current announcements",
  announcementsSubtitle:"Important news and announcements about the library and platform.",
  announcementsEmpty:"No active announcements at this time.",
  annPriority:"Announcement", annPriorityHigh:"Important",
  svc1f1:"Selecting sources and literature for the topic",
  svc1f2:"Formatting bibliography and citations (APA, MLA, Chicago)",
  svc1f3:"Guidance on online and physical collections",
  svc1Cta:"Submit request →",
  svc2f1:"Access to rare manuscripts and archival materials",
  svc2f2:"Online booking prior to visit",
  svc2f3:"Digital reproduction and copying service",
  svc2Cta:"Submit request →",
  svc4Title:"Remote access",
  svc4Text:"24/7 access to the digital catalog and databases from home.",
  svc5Title:"Group visits & tours",
  svc5Text:"Library tours for student groups, schools, and organizations.",
  svcContact:"Contact →",
  svcOpen:"Open →",
  d1f1:"Database of 120,000+ books and publications",
  d1f2:"Advanced search by author, subject, year, and language",
  d1f3:"Search via ISBN, ISSN, and other identifiers",
  d1Cta:"Access catalog →",
  d2f1:"15,000+ rare manuscripts in digital archive",
  d2f2:"Ottoman, Timurid, and other historical collections",
  d2f3:"Filter by metadata, period, language, and condition",
  d2Cta:"Access archive →",
  d3Link:"Allomalar.uz ↗",
  d4Link:"Manbalar.uz ↗",
  d5Title:"Electronic library",
  d5Text:"Full access to digital resources and journals via e-library.cisc.uz.",
  d5Link:"E-library ↗",
  abStat1:"Total books",
  abStat2:"Digital copies",
  abStat3:"Manuscripts",
  abStat4:"Library area",
  abStat5:"Seating capacity",
  abStat6:"Digitized rare books",
  aboutFondKicker:"About collections",
  aboutFondTitle:"2025 results",
  abH1:"Newly received books",
  abH1sub:"3,879 donated, 910 purchased",
  abH2:"Written sources in database",
  abH2sub:"Manuscripts and lithographs",
  abH3:"Written source register",
  abH3sub:"Sources with passport ready",
  abH4:"Braille literature",
  abH4sub:"For visually impaired people",
  mission3Title:"Development",
  mission3Text:"Expanding modern information and library services, preserving written heritage, and supporting research projects.",
  faq3Q:"How many seats are in the library?",
  faq3A:"The library can serve up to 310 readers simultaneously.",
  faq4Q:"Can I view rare manuscripts?",
  faq4A:"Yes, rare collection materials can be accessed upon prior request. Please contact the digitization department.",
  qs1Link:"Go to archive →",
  qs2Link:"Contact →",
  qs3Link:"More info →",
  floorPlanBtn:"View library floor plan",
  floorPlanKicker:"Library map",
  floorPlanTitle:"Library Reading Hall Map",
  floorPlanHint:"Mouse wheel to zoom · Drag to pan",
  navMap:"Map",
  nav3D:"3D Tour",
  close:"Close",
  zoomIn:"Zoom In",
  zoomOut:"Zoom Out",
  resetSize:"Reset Size",
  ariaHome:"Go to homepage",
  ariaMenu:"Open menu",
  regTitle:"Register",
  regSubtitle:"Create a profile to fully access the library system.",
  regNameLabel:"Full Name",
  regNamePlaceholder:"John Doe",
  regEmailLabel:"Email Address",
  regEmailPlaceholder:"example@mail.com",
  regPasswordLabel:"Password",
  regPasswordPlaceholder:"••••••••",
  regSubmit:"Submit",
  regSuccess:"Successfully registered!",
  partnerBnf:"Bibliothèque nationale de France",
  partnerLoc:"Library of Congress",
  partnerIstanbul:"Istanbul University",
  partnerOzmu:"National University of Uzbekistan",
  partnerTurkiston:"Turkestan Library",
  floorPlanFallback:"floor-plan.svg file<br>place in images/ folder",
  footerAddress:"Tashkent, Uzbekistan",
  directorBadge:"Director General",
  tour3dKicker: "Virtual Tour",
  tour3dTitle: "3D Virtual Tour",
  tour3dSubtitle: "Explore the library building and halls via 3D model remotely. Click hotspots to explore sections.",
  tdAutoRotate: "Auto-rotate",
  tdReset: "Reset Camera",
  tdFullscreen: "Fullscreen",
  tdHint: "Drag to rotate · Scroll to zoom · Click hotspots",
  tdHallReadingTitle: "Main Reading Hall",
  tdHallReadingDesc: "A modern, bright reading hall with over 200 seats. Here you can access textbooks, research journals, and digital workstations.",
  tdHallManuscriptsTitle: "Manuscripts Archive",
  tdHallManuscriptsDesc: "Home to over 15,000 rare manuscripts and lithographs on Islamic civilization, stored in climate-controlled preservation vaults.",
  tdHallDigiTitle: "Digitization Lab",
  tdHallDigiDesc: "The high-tech scanning hub where historic documents are digitized at high-resolution to be preserved for future generations.",
  tdHallGalleryTitle: "Exhibition Gallery",
  tdHallGalleryDesc: "A museum-like gallery space highlighting the oldest books, historical scripts, and cultural exhibits open for visitors.",
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
  saturday:"Суббота: 10:00 – 16:00",
  sunday:"Воскресенье: закрыто",

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
  floorPlanTitle:"Карта читального зала библиотеки",
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
  director1Name:"Кодиров Равшан Лазизович",
  director1Role:"Генеральный директор",
  director1Bio:"Руководит общей деятельностью библиотеки Центра исламской цивилизации. Координирует научно-исследовательские проекты и инициативы по оцифровке.",
  director2Name:"Исломова Мукаддас Шогулямовна",
  director2Role:"Ведущий специалист библиотеки",
  director2Bio:"Специализируется на систематизации, каталогизации и научном исследовании редких рукописей и литографированных изданий.",
  director3Name:"Нигматова Севара Иргашевна",
  director3Role:"Главный специалист библиотеки",
  director3Bio:"Руководит комплектованием библиотечных ресурсов и формированием баз данных цифровой информации.",
  director4Name:"Сагдиева Хиромон Холхужаевна",
  director4Role:"Главный специалист библиотеки",
  director4Bio:"Отвечает за установление международного сотрудничества, реализацию совместных проектов и обмен опытом с зарубежными библиотеками.",
  director5Name:"Каримова Мавлюда Анваровна",
  director5Role:"Главный специалист библиотеки",
  director5Bio:"Курирует обслуживание пользователей, работу читальных залов и организацию дистанционных информационно-библиотечных услуг.",
  navMap:"Карта",
  nav3D:"3D Тур",
  close:"Закрыть",
  zoomIn:"Увеличить",
  zoomOut:"Уменьшить",
  resetSize:"Сбросить размер",
  ariaHome:"Перейти на главную",
  ariaMenu:"Открыть меню",
  regTitle:"Регистрация",
  regSubtitle:"Создайте профиль, чтобы получить полный доступ к системе библиотеки.",
  regNameLabel:"Имя и фамилия",
  regNamePlaceholder:"Иван Иванов",
  regEmailLabel:"Электронная почта",
  regEmailPlaceholder:"example@mail.com",
  regPasswordLabel:"Пароль",
  regPasswordPlaceholder:"••••••••",
  regSubmit:"Подтвердить",
  regSuccess:"Успешная регистрация!",
  partnerBnf:"Национальная библиотека Франции",
  partnerLoc:"Библиотека Конгресса",
  partnerIstanbul:"Стамбульский университет",
  partnerOzmu:"Национальный университет Узбекистана",
  partnerTurkiston:"Туркестанская библиотека",
  floorPlanFallback:"файл floor-plan.svg<br>поместите в папку images/",
  footerAddress:"Ташкент, Узбекистан",
  directorBadge:"Генеральный директор",
  tour3dKicker: "Виртуальный Визит",
  tour3dTitle: "3D Виртуальный Тур по Библиотеке",
  tour3dSubtitle: "Изучите здание и залы библиотеки с помощью интерактивной 3D-модели. Нажимайте на метки для подробностей.",
  tdAutoRotate: "Авто-вращение",
  tdReset: "Сбросить камеру",
  tdFullscreen: "Во весь экран",
  tdHint: "Вращение мышью · Масштаб · Клик на метки",
  tdHallReadingTitle: "Главный читальный зал",
  tdHallReadingDesc: "Современный просторный зал на более чем 200 мест с доступом к учебным материалам и компьютерам электронной библиотеки.",
  tdHallManuscriptsTitle: "Фонд редких рукописей",
  tdHallManuscriptsDesc: "Здесь хранятся более 15 000 исламских рукописей и литографий в специальных условиях температурного и влажностного контроля.",
  tdHallDigiTitle: "Лаборатория оцифровки",
  tdHallDigiDesc: "Высокотехнологичный центр сканирования и конвертации редких рукописных книг в цифровой формат для сохранения наследия.",
  tdHallGalleryTitle: "Выставочная галерея",
  tdHallGalleryDesc: "Галерейное пространство, где выставлены старейшие оригиналы книг, образцы каллиграфии и исторические артефакты.",
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
  saturday:"Cumartesi: 10:00 – 16:00",
  sunday:"Pazar: Kapalı",

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
  floorPlanTitle:"Kütüphane Okuma Salonu Haritası",
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
  director1Name:"Qodirov Ravshan Lazizovich",
  director1Role:"Genel Müdür",
  director1Bio:"İslam Medeniyeti Merkezi Kütüphanesi'nin genel faaliyetlerini yönetir. Bilimsel araştırma ve dijitalleştirme projelerini koordine eder.",
  director2Name:"Islomova Muqaddas Shogulyamovna",
  director2Role:"Kütüphane Lider Uzmanı",
  director2Bio:"Nadir el yazmaları ve taş baskı eserlerin kataloglanması, tasnifi ve bilimsel araştırması üzerine çalışmaktadır.",
  director3Name:"Nigmatova Sevara Irgashevna",
  director3Role:"Kütüphane Başuzmanı",
  director3Bio:"Kütüphane kaynaklarının edinimini ve dijital bilgi veri tabanlarının geliştirilmesini yönetir.",
  director4Name:"Sagdiyeva Xiromon Xolxo'jayevna",
  director4Role:"Kütüphane Başuzmanı",
  director4Bio:"Uluslararası ortaklıklar kurmak, ortak kütüphane projeleri yürütmek ve dünya çapında en iyi uygulamaları paylaşmaktan sorumludur.",
  director5Name:"Karimova Mavluda Anvarovna",
  director5Role:"Kütüphane Başuzmanı",
  director5Bio:"Kullanıcı hizmetlerini, okuma salonlarının koordinasyonunu ve uzaktan kütüphane ve bilgi hizmetlerinin sunulmasını yönetir.",
  navMap:"Harita",
  nav3D:"3D Tur",
  close:"Kapat",
  zoomIn:"Yakınlaştır",
  zoomOut:"Uzaklaştır",
  resetSize:"Sıfırla",
  ariaHome:"Ana sayfaya git",
  ariaMenu:"Menüyü aç",
  regTitle:"Kaydol",
  regSubtitle:"Kütüphane sistemine tam erişim sağlamak için bir profil oluşturun.",
  regNameLabel:"Adınız ve soyadınız",
  regNamePlaceholder:"Ahmet Yılmaz",
  regEmailLabel:"E-posta adresi",
  regEmailPlaceholder:"example@mail.com",
  regPasswordLabel:"Şifre",
  regPasswordPlaceholder:"••••••••",
  regSubmit:"Onayla",
  regSuccess:"Başarıyla kayıt oldunuz!",
  partnerBnf:"Fransa Ulusal Kütüphanesi",
  partnerLoc:"Kongre Kütüphanesi",
  partnerIstanbul:"İstanbul Üniversitesi",
  partnerOzmu:"Özbekistan Milliy Üniversitesi",
  partnerTurkiston:"Türkistan Kütüphanesi",
  floorPlanFallback:"floor-plan.svg dosyası<br>images/ klasörüne yerleştirin",
  footerAddress:"Taşkent, Özbekistan",
  directorBadge:"Genel Müdür",
  tour3dKicker: "Sanal Ziyaret",
  tour3dTitle: "Kütüphane 3D Sanal Turu",
  tour3dSubtitle: "Kütüphane binasını ve salonlarını 3D model üzerinden uzaktan keşfedin. Detaylar için işaretçilere tıklayın.",
  tdAutoRotate: "Otomatik döndür",
  tdReset: "Kamerayı sıfırla",
  tdFullscreen: "Tam ekran",
  tdHint: "Döndürmek için sürükleyin · Yakınlaştırın · İşaretçilere tıklayın",
  tdHallReadingTitle: "Ana Okuma Salonu",
  tdHallReadingDesc: "200'den fazla okuma kapasitesine sahip, modern ve aydınlık okuma salonu. Ders kitapları ve dijital kaynaklara buradan erişilir.",
  tdHallManuscriptsTitle: "El Yazmaları Arşivi",
  tdHallManuscriptsDesc: "İslam medeniyetine ait 15.000'den fazla nadir el yazması ve taş baskı eserin iklim kontrollü odalarda korunduğu bölüm.",
  tdHallDigiTitle: "Dijitalleştirme Laboratuvarı",
  tdHallDigiDesc: "Tarihi kaynakların yüksek çözünürlükte taranarak gelecek nesiller için dijital ortama aktarıldığı teknolojik merkez.",
  tdHallGalleryTitle: "Sergi Galerisi",
  tdHallGalleryDesc: "Kütüphanedeki en eski eserlerin, kaligrafi örneklerinin ve tarihi objelerin sergilendiği, ziyaretçilere açık galeri alanı.",
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
    if (dict[key] !== undefined) {
      if (key === "floorPlanFallback") {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Support translating attributes: title, placeholder, aria-label
  document.querySelectorAll("[data-t-title]").forEach(el => {
    const key = el.getAttribute("data-t-title");
    if (dict[key] !== undefined) el.setAttribute("title", dict[key]);
  });
  document.querySelectorAll("[data-t-placeholder]").forEach(el => {
    const key = el.getAttribute("data-t-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });
  document.querySelectorAll("[data-t-aria]").forEach(el => {
    const key = el.getAttribute("data-t-aria");
    if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
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

  // Update 3D details card language if a hotspot is currently focused
  if (typeof tdFocusedHotspot === "string" && tdFocusedHotspot && typeof focusHotspot === "function") {
    focusHotspot(tdFocusedHotspot);
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const dict = i18n[currentLang] || i18n.uz;
  alert(dict.regSuccess || "Muvaffaqiyatli ro'yxatdan o'tdingiz!");
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
function toggleHamburger() {
  const nav    = document.getElementById('nav-links');
  const btn    = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when open
  document.body.classList.toggle('nav-open', isOpen);
}

function closeHamburger() {
  const nav = document.getElementById('nav-links');
  const btn = document.getElementById('hamburger');
  if (nav) nav.classList.remove('open');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  document.body.classList.remove('nav-open');
}

function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  const page = document.getElementById(`page-${name}`);
  const nav  = document.getElementById(`nav-${name}`);
  if (page) page.classList.add("active");
  if (nav)  nav.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeHamburger();
  // Re-render announcements page when navigating to it
  if (name === "announcements" && liveAnnouncements.length > 0) renderAnnouncementsPage();
  
  // Resize 3D canvas when showing the Visit page
  if (name === "visit" && typeof on3DWindowResize === "function") {
    setTimeout(on3DWindowResize, 150);
  }
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
  init3DExplorer();
});

/* ─────────────────────────────────────────────
   Announcements
───────────────────────────────────────────── */
let liveAnnouncements = [];

async function loadAnnouncements() {
  // Minimize check
  if (sessionStorage.getItem("kiosk_minimized")) {
    const wrap = document.getElementById("kiosk-wrap");
    if (wrap) wrap.classList.add("minimized");
  }

  try {
    liveAnnouncements = await sbGet(
      "/announcements?is_active=eq.true&order=created_at.desc&limit=20&select=*"
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

  let data;
  try {
    data = JSON.parse(ann.content);
  } catch (e) {
    data = { title_uz: "E'lon", body_uz: ann.content || "", priority: "normal", art_color: "#c8a45d" };
  }

  const lang    = currentLang;
  const title   = data[`title_${lang}`] || data.title_uz || data.title_en || "";
  const body    = data[`body_${lang}`]  || data.body_uz  || data.body_en  || "";

  const titleEl   = document.getElementById("kiosk-title");
  const excerptEl = document.getElementById("kiosk-excerpt");

  if (titleEl)   titleEl.textContent   = title;
  if (excerptEl) excerptEl.textContent = body.slice(0, 120) + (body.length > 120 ? "\u2026" : "");

  // Set accent color
  const inner = document.getElementById("kiosk-inner");
  if (inner && data.art_color) {
    inner.style.setProperty("--ann-accent", data.art_color);
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
    let data;
    try {
      data = JSON.parse(ann.content);
    } catch(e) {
      data = { title_uz: "E'lon", body_uz: ann.content || "", priority: "normal", art_color: "#c8a45d" };
    }
    const title    = data[`title_${lang}`] || data.title_uz || data.title_en || "";
    const body     = data[`body_${lang}`]  || data.body_uz  || data.body_en  || "";
    const isHigh   = data.priority === "high";
    const accent   = data.art_color || (isHigh ? "#e05c5c" : "#c8a45d");
    const badgeLabel = isHigh ? (dict.annPriorityHigh || "Muhim") : (dict.annPriority || "E'lon");
    const date     = data.starts_at ? formatDate(data.starts_at, lang) : ann.created_at ? formatDate(ann.created_at, lang) : "";

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
  const wrap = document.getElementById("kiosk-wrap");
  if (wrap && wrap.classList.contains("minimized")) {
    e.preventDefault();
    e.stopPropagation();
    expandKiosk();
    return;
  }
  if (e.target.closest(".kiosk-dismiss") || e.target.closest(".kiosk-cta")) return;
  showPage("announcements");
}

function dismissKiosk() {
  sessionStorage.setItem("kiosk_minimized", "1");
  const wrap = document.getElementById("kiosk-wrap");
  if (wrap) wrap.classList.add("minimized");
}

function expandKiosk() {
  sessionStorage.removeItem("kiosk_minimized");
  const wrap = document.getElementById("kiosk-wrap");
  if (wrap) wrap.classList.remove("minimized");
}

/* ─────────────────────────────────────────────
   3D LIBRARY EXPLORER (THREE.JS)
   ───────────────────────────────────────────── */
let tdScene, tdCamera, tdRenderer, tdControls;
let tdLibraryGroup; // Group containing the library model
let tdHotspots = []; // List of hotspot objects
let tdAutoRotate = true;
let tdFocusedHotspot = null;
let tdRaycaster = new THREE.Raycaster();
let tdMouse = new THREE.Vector2();

// Camera target interpolation state
let tdTargetPos = new THREE.Vector3(14, 11, 16);
let tdTargetLookAt = new THREE.Vector3(0, 0, 0);
let tdCurrentLookAt = new THREE.Vector3(0, 0, 0);

// Hotspot coordinates and translation keys
const HOTSPOT_DATA = [
  {
    id: "reading",
    pos: new THREE.Vector3(-6.5, 1.8, 0),
    tagKey: "discoverKicker",
    titleKey: "tdHallReadingTitle",
    descKey: "tdHallReadingDesc"
  },
  {
    id: "manuscripts",
    pos: new THREE.Vector3(6.5, 1.8, 0),
    tagKey: "navDiscover",
    titleKey: "tdHallManuscriptsTitle",
    descKey: "tdHallManuscriptsDesc"
  },
  {
    id: "digitization",
    pos: new THREE.Vector3(0, 1.8, -6),
    tagKey: "servicesKicker",
    titleKey: "tdHallDigiTitle",
    descKey: "tdHallDigiDesc"
  },
  {
    id: "gallery",
    pos: new THREE.Vector3(0, 2.2, 5.5),
    tagKey: "updatesKicker",
    titleKey: "tdHallGalleryTitle",
    descKey: "tdHallGalleryDesc"
  }
];

function init3DExplorer() {
  const container = document.getElementById("td-viewport");
  if (!container) return;

  // 1. Create Scene
  tdScene = new THREE.Scene();
  tdScene.fog = new THREE.FogExp2(0x071c16, 0.025);

  // 2. Create Camera
  tdCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  tdCamera.position.copy(tdTargetPos);

  // 3. Create Renderer
  tdRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  tdRenderer.setSize(container.clientWidth, container.clientHeight);
  tdRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  tdRenderer.shadowMap.enabled = true;
  tdRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(tdRenderer.domElement);

  // 4. Create OrbitControls
  tdControls = new THREE.OrbitControls(tdCamera, tdRenderer.domElement);
  tdControls.enableDamping = true;
  tdControls.dampingFactor = 0.05;
  tdControls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
  tdControls.minDistance = 6;
  tdControls.maxDistance = 35;
  tdControls.target.copy(tdTargetLookAt);

  // 5. Ambient & Directional Lighting
  const ambientLight = new THREE.AmbientLight(0x1a4536, 1.2);
  tdScene.add(ambientLight);

  // Main directional light (Sun-like warm highlight)
  const dirLight = new THREE.DirectionalLight(0xfffaf0, 1.5);
  dirLight.position.set(15, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.bias = -0.001;
  tdScene.add(dirLight);

  // Glowing point lights for accents
  const goldLight = new THREE.PointLight(0xc8a45d, 2.5, 12);
  goldLight.position.set(0, 4, 0);
  tdScene.add(goldLight);

  const tealLight = new THREE.PointLight(0xead29a, 2, 10);
  tealLight.position.set(-6, 2, 0);
  tdScene.add(tealLight);

  // 6. Build the Library Model
  tdLibraryGroup = new THREE.Group();
  buildLibraryModel();
  tdScene.add(tdLibraryGroup);

  // 7. Add Hotspots
  create3DHotspots();

  // 8. Event Listeners
  window.addEventListener("resize", on3DWindowResize);
  tdRenderer.domElement.addEventListener("click", on3DViewportClick);
  tdRenderer.domElement.addEventListener("mousemove", on3DViewportMouseMove);

  // 9. Start Loop
  animate3D();
}

function buildLibraryModel() {
  // Common Materials
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x092b1e,
    roughness: 0.8,
    metalness: 0.2
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x0e3a2b,
    roughness: 0.6,
    metalness: 0.1
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xc8a45d,
    roughness: 0.3,
    metalness: 0.9,
    emissive: 0x6e5223,
    emissiveIntensity: 0.15
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xa8dfc9,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0.9
  });

  const shelfMat = new THREE.MeshStandardMaterial({
    color: 0x051a13,
    roughness: 0.9
  });

  const booksMat = new THREE.MeshStandardMaterial({
    color: 0xead29a,
    emissive: 0xc8a45d,
    emissiveIntensity: 0.4
  });

  // A. Main Foundation Base
  const baseGeo = new THREE.CylinderGeometry(11, 11.5, 0.6, 8);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.3;
  baseMesh.receiveShadow = true;
  tdLibraryGroup.add(baseMesh);

  // B. Grand Central Rotunda (Drum)
  const rotundaGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.2, 8, 1, false);
  const rotundaMesh = new THREE.Mesh(rotundaGeo, wallMat);
  rotundaMesh.position.y = 1.6;
  rotundaMesh.castShadow = true;
  rotundaMesh.receiveShadow = true;
  tdLibraryGroup.add(rotundaMesh);

  // Decorative gold arches on Rotunda
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const archGeo = new THREE.BoxGeometry(0.8, 1.8, 0.1);
    const archMesh = new THREE.Mesh(archGeo, goldMat);
    archMesh.position.set(Math.cos(angle) * 4.55, 1.2, Math.sin(angle) * 4.55);
    archMesh.rotation.y = -angle + Math.PI / 2;
    tdLibraryGroup.add(archMesh);
  }

  // C. Central Golden Dome
  const domeGeo = new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeo, goldMat);
  domeMesh.position.y = 3.2;
  domeMesh.castShadow = true;
  tdLibraryGroup.add(domeMesh);

  // Dome Finial spire
  const finialGeo = new THREE.CylinderGeometry(0.05, 0.15, 1.2, 8);
  const finialMesh = new THREE.Mesh(finialGeo, goldMat);
  finialMesh.position.y = 8.1;
  tdLibraryGroup.add(finialMesh);

  const sphereFinial = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), goldMat);
  sphereFinial.position.y = 8.8;
  tdLibraryGroup.add(sphereFinial);

  // D. Left Wing - Main Reading Hall
  const leftWingGeo = new THREE.BoxGeometry(4.5, 2.2, 3.5);
  const leftWing = new THREE.Mesh(leftWingGeo, wallMat);
  leftWing.position.set(-6.5, 1.1, 0);
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  tdLibraryGroup.add(leftWing);

  // Glassmorphic arched roof for Reading Hall
  const leftRoofGeo = new THREE.CylinderGeometry(1.85, 1.85, 4.5, 16, 1, false, 0, Math.PI);
  const leftRoof = new THREE.Mesh(leftRoofGeo, glassMat);
  leftRoof.position.set(-6.5, 2.2, 0);
  leftRoof.rotation.z = Math.PI / 2;
  leftRoof.rotation.x = Math.PI;
  leftRoof.castShadow = true;
  tdLibraryGroup.add(leftRoof);

  // Left Wing Facade Colonnade
  for (let i = -1; i <= 1; i++) {
    const colGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 8);
    const col = new THREE.Mesh(colGeo, goldMat);
    col.position.set(-6.5 + i * 1.5, 1.0, 1.8);
    col.castShadow = true;
    tdLibraryGroup.add(col);
  }

  // E. Right Wing - Manuscripts Archive
  const rightWingGeo = new THREE.BoxGeometry(4.5, 2.5, 3.5);
  const rightWing = new THREE.Mesh(rightWingGeo, wallMat);
  rightWing.position.set(6.5, 1.25, 0);
  rightWing.castShadow = true;
  rightWing.receiveShadow = true;
  tdLibraryGroup.add(rightWing);

  // Traditional flat roof with crenellations
  const rightRoofGeo = new THREE.BoxGeometry(4.7, 0.25, 3.7);
  const rightRoof = new THREE.Mesh(rightRoofGeo, goldMat);
  rightRoof.position.set(6.5, 2.6, 0);
  rightRoof.castShadow = true;
  tdLibraryGroup.add(rightRoof);

  // F. Rear Wing - Digitization Lab
  const rearWingGeo = new THREE.BoxGeometry(3.5, 2.4, 4.0);
  const rearWing = new THREE.Mesh(rearWingGeo, wallMat);
  rearWing.position.set(0, 1.2, -6.5);
  rearWing.castShadow = true;
  rearWing.receiveShadow = true;
  tdLibraryGroup.add(rearWing);

  // Glass pyramid skylight
  const rearRoofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
  const rearRoof = new THREE.Mesh(rearRoofGeo, glassMat);
  rearRoof.position.set(0, 3.0, -6.5);
  rearRoof.rotation.y = Math.PI / 4;
  rearRoof.castShadow = true;
  tdLibraryGroup.add(rearRoof);

  // G. Front Court - Exhibition Gallery (Entrance)
  const frontWingGeo = new THREE.BoxGeometry(4.8, 1.5, 3.0);
  const frontWing = new THREE.Mesh(frontWingGeo, wallMat);
  frontWing.position.set(0, 0.75, 5.5);
  frontWing.castShadow = true;
  frontWing.receiveShadow = true;
  tdLibraryGroup.add(frontWing);

  // Grand Entrance Arch (Iwan style portal)
  const iwanGeo = new THREE.BoxGeometry(2.4, 2.2, 1.2);
  const iwan = new THREE.Mesh(iwanGeo, wallMat);
  iwan.position.set(0, 1.1, 6.4);
  iwan.castShadow = true;
  tdLibraryGroup.add(iwan);

  const iwanArchInner = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.3), baseMat);
  iwanArchInner.position.set(0, 0.8, 6.45);
  tdLibraryGroup.add(iwanArchInner);

  const iwanGoldFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 1.3), goldMat);
  iwanGoldFrame.position.set(0, 2.2, 6.45);
  tdLibraryGroup.add(iwanGoldFrame);

  // H. Interior Details (Bookshelves visible through transparent parts)
  for (let i = -1; i <= 1; i += 2) {
    const rackGeo = new THREE.BoxGeometry(0.3, 1.2, 1.4);
    const rack = new THREE.Mesh(rackGeo, shelfMat);
    rack.position.set(-6.5 + i * 1.0, 0.6, -0.4);
    tdLibraryGroup.add(rack);

    const books = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.15, 1.2), booksMat);
    books.position.set(-6.5 + i * 1.0, 0.7, -0.4);
    tdLibraryGroup.add(books);
  }
}

function create3DHotspots() {
  HOTSPOT_DATA.forEach(data => {
    // Hotspot Container
    const hotspotGroup = new THREE.Group();
    hotspotGroup.position.copy(data.pos);
    hotspotGroup.userData = { id: data.id };

    // Outer Ring (glowing torus)
    const ringGeo = new THREE.TorusGeometry(0.42, 0.05, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc8a45d,
      transparent: true,
      opacity: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    hotspotGroup.add(ringMesh);

    // Inner Core (glowing pulsing sphere)
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfffaf0
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    hotspotGroup.add(coreMesh);

    tdScene.add(hotspotGroup);
    tdHotspots.push(hotspotGroup);
  });
}

function animate3D() {
  requestAnimationFrame(animate3D);

  const time = Date.now() * 0.001;

  // 1. Scene auto-rotation
  if (tdAutoRotate && !tdFocusedHotspot) {
    tdLibraryGroup.rotation.y = time * 0.08;
    // Rotate hotspots along with the library group
    tdHotspots.forEach((hs, idx) => {
      const origData = HOTSPOT_DATA[idx];
      const angle = (time * 0.08);
      hs.position.x = origData.pos.x * Math.cos(angle) - origData.pos.z * Math.sin(angle);
      hs.position.z = origData.pos.x * Math.sin(angle) + origData.pos.z * Math.cos(angle);
    });
  }

  // 2. Animate Hotspot objects (bouncing and rotating)
  tdHotspots.forEach(hs => {
    const torus = hs.children[0];
    if (torus) torus.rotation.z = time * 1.5;

    const core = hs.children[1];
    if (core) {
      const scale = 1.0 + Math.sin(time * 6) * 0.15;
      core.scale.set(scale, scale, scale);
    }
    
    if (hs.userData.baseY !== undefined) {
      hs.position.y = hs.userData.baseY + Math.sin(time * 4) * 0.12;
    }
  });

  // Store original Y coordinate on first run
  tdHotspots.forEach(hs => {
    if (hs.userData.baseY === undefined) {
      hs.userData.baseY = hs.position.y;
    }
  });

  // 3. Smooth Camera focus interpolation
  if (tdFocusedHotspot) {
    tdCurrentLookAt.lerp(tdTargetLookAt, 0.08);
    tdCamera.position.lerp(tdTargetPos, 0.08);
    tdControls.target.copy(tdCurrentLookAt);
  } else {
    tdCurrentLookAt.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    tdControls.target.copy(tdCurrentLookAt);
  }

  tdControls.update();
  tdRenderer.render(tdScene, tdCamera);
}

function on3DWindowResize() {
  const container = document.getElementById("td-viewport");
  if (!container || !tdRenderer) return;

  tdCamera.aspect = container.clientWidth / container.clientHeight;
  tdCamera.updateProjectionMatrix();
  tdRenderer.setSize(container.clientWidth, container.clientHeight);
}

function on3DViewportClick(e) {
  const container = document.getElementById("td-viewport");
  if (!container) return;

  const rect = tdRenderer.domElement.getBoundingClientRect();
  tdMouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
  tdMouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

  tdRaycaster.setFromCamera(tdMouse, tdCamera);
  const intersects = tdRaycaster.intersectObjects(tdScene.children, true);

  let clickedHS = null;
  for (let hit of intersects) {
    let parent = hit.object.parent;
    while (parent && parent !== tdScene) {
      if (parent.userData && parent.userData.id) {
        clickedHS = parent;
        break;
      }
      parent = parent.parent;
    }
    if (clickedHS) break;
  }

  if (clickedHS) {
    focusHotspot(clickedHS.userData.id);
  }
}

function on3DViewportMouseMove(e) {
  const container = document.getElementById("td-viewport");
  if (!container) return;

  const rect = tdRenderer.domElement.getBoundingClientRect();
  tdMouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
  tdMouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

  tdRaycaster.setFromCamera(tdMouse, tdCamera);
  const intersects = tdRaycaster.intersectObjects(tdScene.children, true);

  let hover = false;
  for (let hit of intersects) {
    let parent = hit.object.parent;
    while (parent && parent !== tdScene) {
      if (parent.userData && parent.userData.id) {
        hover = true;
        break;
      }
      parent = parent.parent;
    }
    if (hover) break;
  }

  document.body.style.cursor = hover ? "pointer" : "";
}

function focusHotspot(id) {
  const hsInfo = HOTSPOT_DATA.find(x => x.id === id);
  const hsObject = tdHotspots.find(x => x.userData.id === id);
  if (!hsInfo || !hsObject) return;

  tdFocusedHotspot = id;
  tdAutoRotate = false;

  const rotateBtn = document.getElementById("td-autorotate-btn");
  if (rotateBtn) rotateBtn.classList.remove("active");

  tdTargetLookAt.copy(hsObject.position);

  const offset = new THREE.Vector3().copy(hsObject.position).normalize().multiplyScalar(4);
  offset.y = 3.5;
  tdTargetPos.copy(hsObject.position).add(offset);

  const dict = i18n[currentLang] || i18n.uz;
  
  document.getElementById("td-details-tag").textContent = dict[hsInfo.tagKey] || "";
  document.getElementById("td-details-title").textContent = dict[hsInfo.titleKey] || "";
  document.getElementById("td-details-text").textContent = dict[hsInfo.descKey] || "";

  document.getElementById("td-details-card").classList.add("open");
}

function close3DDetails() {
  document.getElementById("td-details-card").classList.remove("open");
  tdFocusedHotspot = null;
}

function reset3DCamera() {
  close3DDetails();
  tdFocusedHotspot = null;
  tdTargetLookAt.set(0, 0, 0);
  tdTargetPos.set(14, 11, 16);
}

function toggle3DAutoRotate() {
  tdAutoRotate = !tdAutoRotate;
  const btn = document.getElementById("td-autorotate-btn");
  if (btn) {
    btn.classList.toggle("active", tdAutoRotate);
  }
  if (tdAutoRotate) {
    close3DDetails();
  }
}

function toggle3DFullscreen() {
  const container = document.querySelector(".td-viewport-container");
  if (!container) return;

  const isFull = container.classList.toggle("fullscreen");
  
  setTimeout(on3DWindowResize, 100);
  document.body.classList.toggle("modal-open", isFull);
}
