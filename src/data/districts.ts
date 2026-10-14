export interface District {
  id: number;
  bengali: string;
  english: string;
}

/**
 * 64 Districts of Bangladesh verified against the official live BAMIS portal.
 * Note: IDs 11 and 17 do not exist in the BAMIS database.
 */
export const DISTRICTS: District[] = [
  { id: 1, bengali: 'সিরাজগঞ্জ', english: 'Sirajganj' },
  { id: 2, bengali: 'পাবনা', english: 'Pabna' },
  { id: 3, bengali: 'বগুড়া', english: 'Bogura' },
  { id: 4, bengali: 'জয়পুরহাট', english: 'Joypurhat' },
  { id: 5, bengali: 'রাজশাহী', english: 'Rajshahi' },
  { id: 6, bengali: 'নাটোর', english: 'Natore' },
  { id: 7, bengali: 'চাঁপাইনবাবগঞ্জ', english: 'Chapai Nawabganj' },
  { id: 8, bengali: 'নওগাঁ', english: 'Naogaon' },
  { id: 9, bengali: 'সাতক্ষীরা', english: 'Satkhira' },
  { id: 10, bengali: 'নড়াইল', english: 'Narail' },
  { id: 12, bengali: 'বাগেরহাট', english: 'Bagerhat' },
  { id: 13, bengali: 'যশোর', english: 'Jashore' },
  { id: 14, bengali: 'মেহেরপুর', english: 'Meherpur' },
  { id: 15, bengali: 'চুয়াডাঙ্গা', english: 'Chuadanga' },
  { id: 16, bengali: 'কুষ্টিয়া', english: 'Kushtia' },
  { id: 18, bengali: 'ঝিনাইদহ', english: 'Jhenaidah' },
  { id: 19, bengali: 'ঝালকাঠি', english: 'Jhalokati' },
  { id: 20, bengali: 'পটুয়াখালী', english: 'Patuakhali' },
  { id: 21, bengali: 'পিরোজপুর', english: 'Pirojpur' },
  { id: 22, bengali: 'বরিশাল', english: 'Barishal' },
  { id: 23, bengali: 'ভোলা', english: 'Bhola' },
  { id: 24, bengali: 'বরগুনা', english: 'Barguna' },
  { id: 25, bengali: 'পঞ্চগড়', english: 'Panchagarh' },
  { id: 26, bengali: 'দিনাজপুর', english: 'Dinajpur' },
  { id: 27, bengali: 'ঠাকুরগাঁও', english: 'Thakurgaon' },
  { id: 28, bengali: 'লালমনিরহাট', english: 'Lalmonirhat' },
  { id: 29, bengali: 'নীলফামারী', english: 'Nilphamari' },
  { id: 30, bengali: 'গাইবান্ধা', english: 'Gaibandha' },
  { id: 31, bengali: 'রংপুর', english: 'Rangpur' },
  { id: 32, bengali: 'কুড়িগ্রাম', english: 'Kurigram' },
  { id: 33, bengali: 'জামালপুর', english: 'Jamalpur' },
  { id: 34, bengali: 'ময়মনসিংহ', english: 'Mymensingh' },
  { id: 35, bengali: 'নেত্রকোনা', english: 'Netrokona' },
  { id: 36, bengali: 'শেরপুর', english: 'Sherpur' },
  { id: 37, bengali: 'ঢাকা', english: 'Dhaka' },
  { id: 38, bengali: 'নারায়ণগঞ্জ', english: 'Narayanganj' },
  { id: 39, bengali: 'গাজীপুর', english: 'Gazipur' },
  { id: 40, bengali: 'নরসিংদী', english: 'Narsingdi' },
  { id: 41, bengali: 'মুন্সিগঞ্জ', english: 'Munshiganj' },
  { id: 42, bengali: 'মানিকগঞ্জ', english: 'Manikganj' },
  { id: 43, bengali: 'টাঙ্গাইল', english: 'Tangail' },
  { id: 44, bengali: 'কিশোরগঞ্জ', english: 'Kishoreganj' },
  { id: 45, bengali: 'শরীয়তপুর', english: 'Shariatpur' },
  { id: 46, bengali: 'রাজবাড়ী', english: 'Rajbari' },
  { id: 47, bengali: 'মাদারীপুর', english: 'Madaripur' },
  { id: 48, bengali: 'গোপালগঞ্জ', english: 'Gopalganj' },
  { id: 49, bengali: 'ফরিদপুর', english: 'Faridpur' },
  { id: 50, bengali: 'সিলেট', english: 'Sylhet' },
  { id: 51, bengali: 'মৌলভীবাজার', english: 'Moulvibazar' },
  { id: 52, bengali: 'হবিগঞ্জ', english: 'Habiganj' },
  { id: 53, bengali: 'সুনামগঞ্জ', english: 'Sunamganj' },
  { id: 54, bengali: 'কুমিল্লা', english: 'Cumilla' },
  { id: 55, bengali: 'ব্রাহ্মণবাড়িয়া', english: 'Brahmanbaria' },
  { id: 56, bengali: 'চাঁদপুর', english: 'Chandpur' },
  { id: 57, bengali: 'চট্টগ্রাম', english: 'Chattogram' },
  { id: 58, bengali: 'নোয়াখালী', english: 'Noakhali' },
  { id: 59, bengali: 'ফেনী', english: 'Feni' },
  { id: 60, bengali: 'লক্ষ্মীপুর', english: 'Lakshmipur' },
  { id: 61, bengali: 'কক্সবাজার', english: 'Cox\'s Bazar' },
  { id: 62, bengali: 'রাঙ্গামাটি', english: 'Rangamati' },
  { id: 63, bengali: 'খাগড়াছড়ি', english: 'Khagrachari' },
  { id: 64, bengali: 'বান্দরবান', english: 'Bandarban' },
  { id: 65, bengali: 'খুলনা', english: 'Khulna' },
  { id: 66, bengali: 'মাগুরা', english: 'Magura' }
];

export const DISTRICT_MAP = new Map<number, District>(
  DISTRICTS.map((d) => [d.id, d])
);

export function isValidDistrictId(id: number): boolean {
  return DISTRICT_MAP.has(id);
}
