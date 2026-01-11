import { Property } from './types';

export const DISTRICTS = [
  "Minor",
  "Shayxontohur",
  "Bodomzor"
];

// Simplified mock data with multi-language support structures
// In a real app, this would come from a database with localized fields
export const RAW_PROPERTIES = [
  {
    id: '1',
    price: 85000,
    currency: "USD",
    location: "Toshkent sh.",
    district: "Yunusobod",
    rooms: 3,
    area: 98,
    floor: 4,
    totalFloors: 9,
    renovation: "Euro",
    images: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3"
    ],
    type: "Kvartira",
    buildingType: "Novostroyka",
    createdAt: "2024-05-20",
    translations: {
      uz: {
        title: "Yunusobodda shinam 3 xonali kvartira",
        description: "Yunusobod markazida, metroga yaqin joylashgan. Hamma jihozlari bilan sotiladi. Remonti yangi, hech kim yashamagan."
      },
      ru: {
        title: "Уютная 3-комнатная квартира на Юнусабаде",
        description: "Расположена в центре Юнусабада, недалеко от метро. Продается со всей мебелью. Ремонт новый, никто не жил."
      },
      en: {
        title: "Cozy 3-room apartment in Yunusabad",
        description: "Located in the center of Yunusabad, close to the metro. Sold with all furniture. New renovation, nobody lived."
      },
      'uz-cy': {
        title: "Юнусободда шинам 3 хонали квартира",
        description: "Юнусобод марказида, метрога яқин жойлашган. Ҳамма жиҳозлари билан сотилади. Ремонти янги, ҳеч ким яшамаган."
      }
    }
  },
  {
    id: '2',
    price: 52000,
    currency: "USD",
    location: "Toshkent sh.",
    district: "Chilonzor",
    rooms: 2,
    area: 64,
    floor: 2,
    totalFloors: 5,
    renovation: "Hi-Tech",
    images: [
      "https://picsum.photos/800/600?random=4",
      "https://picsum.photos/800/600?random=5"
    ],
    type: "Kvartira",
    buildingType: "Ikkilamchi",
    createdAt: "2024-05-22",
    translations: {
      uz: {
        title: "Chilonzor 7-kvartal, 2 xonali uy",
        description: "Tinch mahalla, bog'cha va maktab yonida. Ipotekaga ham beriladi."
      },
      ru: {
        title: "Чиланзар 7-квартал, 2-комнатная квартира",
        description: "Тихий район, рядом с детским садом и школой. Возможна ипотека."
      },
      en: {
        title: "Chilonzor 7th quarter, 2-room house",
        description: "Quiet neighborhood, next to kindergarten and school. Mortgage available."
      },
      'uz-cy': {
        title: "Чилонзор 7-квартал, 2 хонали уй",
        description: "Тинч маҳалла, боғча ва мактаб ёнида. Ипотекага ҳам берилади."
      }
    }
  },
  {
    id: '3',
    price: 250000,
    currency: "USD",
    location: "Toshkent sh.",
    district: "Mirobod",
    rooms: 5,
    area: 210,
    floor: 12,
    totalFloors: 12,
    renovation: "Neo-classic",
    images: [
      "https://picsum.photos/800/600?random=6",
      "https://picsum.photos/800/600?random=7",
      "https://picsum.photos/800/600?random=8"
    ],
    type: "Kvartira",
    buildingType: "Novostroyka",
    createdAt: "2024-05-25",
    translations: {
      uz: {
        title: "Mirobodda elita klassdagi pentxaus",
        description: "Shahar markazida joylashgan premium klassdagi uy. Katta terrasa va panoramali derazalar."
      },
      ru: {
        title: "Пентхаус элитного класса на Мирабаде",
        description: "Дом премиум-класса в центре города. Большая терраса и панорамные окна."
      },
      en: {
        title: "Elite class penthouse in Mirobod",
        description: "Premium class house located in the city center. Large terrace and panoramic windows."
      },
      'uz-cy': {
        title: "Мирободда элита классдаги пентхаус",
        description: "Шаҳар марказида жойлашган премиум классдаги уй. Катта терраса ва панорамали деразалар."
      }
    }
  },
  {
    id: '4',
    price: 38000,
    currency: "USD",
    location: "Toshkent sh.",
    district: "Sergeli",
    rooms: 1,
    area: 42,
    floor: 3,
    totalFloors: 7,
    renovation: "O'rtacha",
    images: [
      "https://picsum.photos/800/600?random=9",
      "https://picsum.photos/800/600?random=10"
    ],
    type: "Kvartira",
    buildingType: "Novostroyka",
    createdAt: "2024-05-18",
    translations: {
      uz: {
        title: "Sergelida arzon 1 xonali",
        description: "Metroning 3-bekatiga yaqin. Yosh oila uchun ideal variant."
      },
      ru: {
        title: "Дешевая 1-комнатная на Сергели",
        description: "Рядом с 3-й станцией метро. Идеальный вариант для молодой семьи."
      },
      en: {
        title: "Cheap 1-room apartment in Sergeli",
        description: "Close to metro station 3. Ideal option for a young family."
      },
      'uz-cy': {
        title: "Сергелида арзон 1 хонали",
        description: "Метронинг 3-бекатига яқин. Ёш оила учун идеал вариант."
      }
    }
  },
  {
    id: '5',
    price: 150000,
    currency: "USD",
    location: "Toshkent vil.",
    district: "Qibray",
    rooms: 6,
    area: 400,
    floor: 2,
    totalFloors: 2,
    renovation: "Qora suvoq",
    images: [
      "https://picsum.photos/800/600?random=11",
      "https://picsum.photos/800/600?random=12"
    ],
    type: "Hovli",
    buildingType: "Ikkilamchi",
    createdAt: "2024-05-28",
    translations: {
      uz: {
        title: "Qibrayda katta hovli",
        description: "6 sotixli hovli, 2 qavatli bitmagan uy. Gaz, svet, suv muammosiz."
      },
      ru: {
        title: "Большой участок в Кибрае",
        description: "6 соток, 2-этажный недостроенный дом. Газ, свет, вода без проблем."
      },
      en: {
        title: "Big house with yard in Qibray",
        description: "6 acres yard, 2-story unfinished house. Gas, electricity, water available."
      },
      'uz-cy': {
        title: "Қибрайда катта ҳовли",
        description: "6 сотихли ҳовли, 2 қаватли битмаган уй. Газ, свет, сув муаммосиз."
      }
    }
  }
];

export const MOCK_PROPERTIES: Property[] = RAW_PROPERTIES.map(p => ({
  ...p,
  title: p.translations.uz.title,
  description: p.translations.uz.description,
  renovation: p.renovation,
  type: p.type,
  buildingType: p.buildingType,
  mainImage: p.images[0] || null,
  phone: '+998 97 085 06 04',
  rieltor: 'Maskan Lux',
  layout: undefined,
  balcony: undefined,
  parking: undefined
}));
export const CONTACT_PHONE = "+998 97 085 06 04";
export const APP_NAME = "Maskan Lux";