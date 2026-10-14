export type Range = { min: number; max: number };

export interface DayWeather {
  date: string;              // ISO "2026-10-11"
  rainMm: number;
  maxTempC: number;
  minTempC: number;
  humidity: Range;           // from "৫০.০-৮৭.০"
  windSpeedKmh: number | Range;
  windDirection: string;     // keep Bengali text
  cloud: number | string;    // octa as number, or text like "পরিষ্কার" (clear)
}

export interface AdviceSection {
  title: string;             // e.g. "ধান আমন", "সবজি", "উদ্যান ফসল", "গবাদি পশু", "হাঁসমুরগী", "মৎস্য", "আলু"
  stage?: string;            // e.g. "দানা জমাট বাঁধা" if the line starts with "পর্যায়:"
  items: string[];           // original Bengali sentences, untouched
}

export interface Bulletin {
  districtId: number;
  districtNameBn: string;
  bulletinNo: number;
  bulletinDate: string;
  periodFrom: string;
  periodTo: string;
  pastWeather: DayWeather[];       // "গত ৪ দিনের আবহাওয়া পরিস্থিতি"
  forecast: DayWeather[];          // "আগামী ৫ দিনের আবহাওয়ার পূর্বাভাস"
  advice: AdviceSection[];
  sourceUrl: string;
  fetchedAt: string;
  stale?: boolean;
}
