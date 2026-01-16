import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FortuneResponse, UserInput, CalendarResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Ensure process.env.API_KEY is available.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Sub-schema for a Pillar
const pillarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stem: { type: Type.STRING, description: "Thai name of Heavenly Stem (e.g. ไม้เจี่ย)" },
    branch: { type: Type.STRING, description: "Thai name of Earthly Branch (e.g. ชวด)" },
    element: { type: Type.STRING, description: "Element (Din, Nam, Fai, Mai, Thong)" },
    stem_char: { type: Type.STRING, description: "Chinese Character for Stem" },
    branch_char: { type: Type.STRING, description: "Chinese Character for Branch" },
  },
  required: ["stem", "branch", "element", "stem_char", "branch_char"],
};

const fortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    user_profile: {
      type: Type.OBJECT,
      properties: {
        thai_zodiac: { type: Type.STRING },
        chinese_zodiac: { type: Type.STRING },
        element: { type: Type.STRING },
      },
      required: ["thai_zodiac", "chinese_zodiac", "element"],
    },
    bazi_chart: {
      type: Type.OBJECT,
      description: "Detailed Four Pillars of Destiny Chart",
      properties: {
        year: pillarSchema,
        month: pillarSchema,
        day: pillarSchema,
        hour: pillarSchema,
        day_master: { type: Type.STRING, description: "The Day Master element and nature (e.g. Yin Fire)" },
        element_balance: {
          type: Type.OBJECT,
          properties: {
            wood: { type: Type.INTEGER },
            fire: { type: Type.INTEGER },
            earth: { type: Type.INTEGER },
            metal: { type: Type.INTEGER },
            water: { type: Type.INTEGER },
          },
          required: ["wood", "fire", "earth", "metal", "water"],
        }
      },
      required: ["year", "month", "day", "hour", "day_master", "element_balance"],
    },
    hero_prediction: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        mood_tone: { type: Type.STRING },
      },
      required: ["headline", "mood_tone"],
    },
    deep_dive: {
      type: Type.OBJECT,
      properties: {
        personality_strength: { type: Type.STRING },
        current_challenge: { type: Type.STRING },
        guidance: { type: Type.STRING },
      },
      required: ["personality_strength", "current_challenge", "guidance"],
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        luck_score: { type: Type.INTEGER },
        wealth_score: { type: Type.INTEGER },
        love_score: { type: Type.INTEGER },
      },
      required: ["luck_score", "wealth_score", "love_score"],
    },
    actionable_ritual: {
      type: Type.OBJECT,
      properties: {
        lucky_color: { type: Type.STRING },
        lucky_direction: { type: Type.STRING },
        suggested_activity: { type: Type.STRING },
      },
      required: ["lucky_color", "lucky_direction", "suggested_activity"],
    },
    compatibility: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        score: { type: Type.INTEGER },
        insight: { type: Type.STRING },
        challenge: { type: Type.STRING },
      },
      required: ["score", "insight", "challenge"],
    },
  },
  required: ["user_profile", "hero_prediction", "deep_dive", "stats", "actionable_ritual", "bazi_chart"],
};

export const generateFortune = async (input: UserInput): Promise<FortuneResponse> => {
  try {
    const isCouple = !!input.partner_dob;
    
    let promptContext = `
      Analyze this user: DOB: ${input.dob}, Time: ${input.time || "Not provided"}, Gender: ${input.gender}.
    `;

    if (isCouple) {
      promptContext += `
        AND analyze the PARTNER: DOB: ${input.partner_dob}, Time: ${input.partner_time || "Not provided"}, Gender: ${input.partner_gender}.
        Perform a 'Love Compatibility' reading.
      `;
    }

    const prompt = `
      Act as the "Grandmaster Astrologer".
      ${promptContext}
      
      Task:
      1. Calculate the **Ba Zi (Four Pillars)**: Year, Month, Day, Hour pillars based on the provided DOB/Time.
      2. Identify the **Day Master** (Day Stem).
      3. Estimate the **5 Element Balance** (approximate percentages).
      4. Provide a spiritual prediction.
      
      Output Language: Thai (except for Chinese chars in Ba Zi).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
        systemInstruction: "You are an expert in Chinese Metaphysics (Ba Zi) and Thai Astrology.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as FortuneResponse;
  } catch (error) {
    console.error("Oracle Error:", error);
    throw error;
  }
};

// --- Calendar Service ---

const calendarSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    month_insight: { type: Type.STRING, description: "Overview of the luck for these days." },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "YYYY-MM-DD" },
          lunar_date: { type: Type.STRING, description: "e.g. 15th of 8th Lunar Month" },
          daily_pillar: { type: Type.STRING, description: "The Day Pillar (60 Jia Zi) in Thai, e.g. 'ไม้กุน' or 'ทองระกา'" },
          auspicious_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          inauspicious_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          daily_energy: { type: Type.STRING, description: "The 12 Day Officer or General Tone, e.g. 'รุ่งเรือง' or 'แตกหัก'" },
          lucky_hours: { type: Type.STRING, description: "e.g. 09:00-11:00" },
          zodiac_compatibility: {
            type: Type.OBJECT,
            properties: {
              best: { type: Type.STRING, description: "The Zodiac sign that has 6 Harmonies (Hexagon) with the day." },
              ok: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The Zodiac signs that have 3 Harmonies (Triangle) with the day." },
              clash: { type: Type.STRING, description: "The Zodiac sign that Clashes (Chong) with the day." },
            },
            required: ["best", "ok", "clash"],
          },
        },
        required: ["date", "lunar_date", "daily_pillar", "auspicious_activities", "inauspicious_activities", "daily_energy", "lucky_hours", "zodiac_compatibility"],
      },
    },
  },
  required: ["month_insight", "days"],
};

export const generateCalendar = async (startDate: string, days: number): Promise<CalendarResponse> => {
   try {
    const prompt = `
      Generate a detailed "Chinese Almanac" (Tong Shu) for the next ${days} days starting from ${startDate}.
      
      For each day, calculate:
      1. The **Day Pillar** (60 Jia Zi).
      2. **Zodiac Compatibility**: 
         - 'Best': The sign that forms a Hexagonal harmony (Liu He).
         - 'Ok': The signs that form a Triangular harmony (San He).
         - 'Clash': The sign that clashes (Chong) with the day branch.
      3. **12 Day Officers** Energy (e.g., Establish, Remove, Full, Balance, etc. translated to Thai).
      4. Auspicious/Inauspicious activities based on the Day Officer and stars.
      
      Language: Thai.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: calendarSchema,
        systemInstruction: "You are a Feng Shui Master and Tong Shu expert.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as CalendarResponse;
   } catch (error) {
     console.error("Calendar Error:", error);
     throw error;
   }
}