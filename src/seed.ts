import type { Profile } from "./types";

/** Simple deterministic string hash → non-negative int. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * A stable placeholder photo for a seeded profile, generated locally as an SVG
 * data URL (gradient + initial). No network — works offline and always renders.
 */
function pic(seed: string): string {
  const hue = hash(seed) % 360;
  const letter = seed.charAt(0).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='hsl(${hue},75%,62%)'/>
      <stop offset='1' stop-color='hsl(${(hue + 50) % 360},70%,48%)'/>
    </linearGradient></defs>
    <rect width='600' height='800' fill='url(#g)'/>
    <text x='300' y='440' font-family='Poppins,sans-serif' font-size='300'
      font-weight='700' fill='rgba(255,255,255,0.92)' text-anchor='middle'>${letter}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * ~12 demo Bangalore flatmate profiles with varied areas / budgets / ages so the
 * swipe deck is populated out of the box. Photos use a placeholder image service.
 */
export const SEED_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Ananya",
    age: 24,
    gender: "Female",
    photos: [pic("ananya1"), pic("ananya2")],
    areas: ["Koramangala", "HSR Layout"],
    budgetMin: 15000,
    budgetMax: 25000,
    roommates: 1,
    social: 70,
    traits: ["Clean & tidy", "Foodie", "Works from home", "Pet-friendly"],
    bio: "Product designer. Love weekend brunches and a tidy kitchen.",
  },
  {
    id: "p2",
    name: "Rohit",
    age: 27,
    gender: "Male",
    photos: [pic("rohit1"), pic("rohit2")],
    areas: ["Indiranagar", "Koramangala"],
    budgetMin: 20000,
    budgetMax: 35000,
    roommates: 1,
    social: 55,
    traits: ["Fitness freak", "Early riser", "Non-smoker", "Loves cooking"],
    bio: "Backend engineer, gym at 6am, home-cooked dinners.",
  },
  {
    id: "p3",
    name: "Meera",
    age: 23,
    gender: "Female",
    photos: [pic("meera1"), pic("meera2")],
    areas: ["HSR Layout", "BTM Layout"],
    budgetMin: 12000,
    budgetMax: 18000,
    roommates: 2,
    social: 40,
    traits: ["Quiet & private", "Veg only", "Music lover", "Non-smoker"],
    bio: "CA student. Quiet evenings and good filter coffee.",
  },
  {
    id: "p4",
    name: "Karthik",
    age: 29,
    gender: "Male",
    photos: [pic("karthik1"), pic("karthik2")],
    areas: ["Whitefield", "Marathahalli"],
    budgetMin: 18000,
    budgetMax: 28000,
    roommates: 1,
    social: 85,
    traits: ["Social butterfly", "Gamer", "Foodie", "Travel junkie"],
    bio: "Sales lead. Always up for a trip or a FIFA night.",
  },
  {
    id: "p5",
    name: "Sana",
    age: 26,
    gender: "Female",
    photos: [pic("sana1"), pic("sana2")],
    areas: ["Indiranagar", "Jayanagar"],
    budgetMin: 25000,
    budgetMax: 40000,
    roommates: 1,
    social: 60,
    traits: ["Clean & tidy", "Fitness freak", "Travel junkie", "Pet-friendly"],
    bio: "Doctor. Cat parent. Looking for a calm, clean home.",
  },
  {
    id: "p6",
    name: "Dev",
    age: 25,
    gender: "Male",
    photos: [pic("dev1"), pic("dev2")],
    areas: ["BTM Layout", "JP Nagar"],
    budgetMin: 10000,
    budgetMax: 16000,
    roommates: 2,
    social: 75,
    traits: ["Gamer", "Night owl", "Foodie", "Music lover"],
    bio: "Game dev. Night owl who orders too much biryani.",
  },
  {
    id: "p7",
    name: "Priya",
    age: 28,
    gender: "Female",
    photos: [pic("priya1"), pic("priya2")],
    areas: ["Bellandur", "Sarjapur Road"],
    budgetMin: 22000,
    budgetMax: 32000,
    roommates: 1,
    social: 50,
    traits: ["Works from home", "Clean & tidy", "Loves cooking", "Non-smoker"],
    bio: "Remote PM. WFH most days, love a quiet workspace.",
  },
  {
    id: "p8",
    name: "Aditya",
    age: 31,
    gender: "Male",
    photos: [pic("aditya1"), pic("aditya2")],
    areas: ["Whitefield", "Bellandur"],
    budgetMin: 30000,
    budgetMax: 50000,
    roommates: 1,
    social: 45,
    traits: ["Fitness freak", "Early riser", "Non-smoker", "Travel junkie"],
    bio: "Architect. Minimalist, early to bed, weekend treks.",
  },
  {
    id: "p9",
    name: "Nisha",
    age: 22,
    gender: "Female",
    photos: [pic("nisha1"), pic("nisha2")],
    areas: ["Koramangala", "BTM Layout"],
    budgetMin: 13000,
    budgetMax: 20000,
    roommates: 2,
    social: 80,
    traits: ["Social butterfly", "Foodie", "Music lover", "Pet-friendly"],
    bio: "Marketing intern. New to the city, love meeting people!",
  },
  {
    id: "p10",
    name: "Varun",
    age: 30,
    gender: "Male",
    photos: [pic("varun1"), pic("varun2")],
    areas: ["Electronic City", "JP Nagar"],
    budgetMin: 14000,
    budgetMax: 22000,
    roommates: 1,
    social: 35,
    traits: ["Quiet & private", "Veg only", "Works from home", "Non-smoker"],
    bio: "Data scientist. Introvert, like a calm home and plants.",
  },
  {
    id: "p11",
    name: "Tara",
    age: 27,
    gender: "Female",
    photos: [pic("tara1"), pic("tara2")],
    areas: ["Hebbal", "Yelahanka"],
    budgetMin: 16000,
    budgetMax: 24000,
    roommates: 1,
    social: 65,
    traits: ["Loves cooking", "Fitness freak", "Pet-friendly", "Early riser"],
    bio: "UX researcher. Dog mom. Sunday meal-prep enthusiast.",
  },
  {
    id: "p12",
    name: "Imran",
    age: 26,
    gender: "Male",
    photos: [pic("imran1"), pic("imran2")],
    areas: ["Indiranagar", "HSR Layout"],
    budgetMin: 24000,
    budgetMax: 38000,
    roommates: 1,
    social: 70,
    traits: ["Foodie", "Social butterfly", "Travel junkie", "Music lover"],
    bio: "Chef. Will absolutely cook for the house on weekends.",
  },
];
