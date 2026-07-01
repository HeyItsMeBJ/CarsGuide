import { z } from "zod";
import { llm } from "../llm";
import { GraphState } from "../state";

const IntentSchema = z.object({
  // Price / Budget Filters
  maxPrice: z
    .number()
    .optional()
    .describe(
      "Maximum budget in INR. (e.g., 1000000 for a 10 Lakh budget, 1500000 for 15L)",
    ),
  minPrice: z
    .number()
    .optional()
    .describe("Minimum price in INR user is willing to consider."),

  // Basic Specifications
  make: z
    .string()
    .optional()
    .describe(
      "The brand or manufacturer name, e.g., Maruti, Tata, Hyundai, Mahindra",
    ),
  bodyType: z
    .string()
    .optional()
    .describe(
      "Type of car body. Map strictly to: SUV, Sedan, Hatchback, MUV, Luxury",
    ),
  fuelType: z
    .string()
    .optional()
    .describe("Type of fuel. Map to: Petrol, Diesel, CNG, Electric"),
  isElectric: z
    .boolean()
    .optional()
    .describe(
      "Set to true if the user mentions EV, electric, battery vehicle, or zero emissions.",
    ),
  transmissionType: z
    .string()
    .optional()
    .describe(
      "Transmission system. Map strictly to: Manual, Automatic, AMT, CVT, DCT",
    ),

  // Practical & Performance Thresholds
  minMileageKpl: z
    .number()
    .optional()
    .describe(
      "Minimum mileage (fuel efficiency) in km/l if the user values high fuel economy or cheap running costs.",
    ),
  minElectricRangeKm: z
    .number()
    .optional()
    .describe(
      "Minimum driving range in km for electric vehicles if the user expresses range anxiety or long commutes.",
    ),
  minTrunkSpaceLiters: z
    .number()
    .optional()
    .describe(
      "Minimum boot/trunk space in liters. Set higher (e.g., 350+) if user mentions 'family trips', 'luggage', or 'big boot'.",
    ),

  // Ratings & Quality
  minUserRating: z
    .number()
    .optional()
    .describe(
      "Minimum user rating out of 5.0. Extract if user asks for 'highly rated', 'best reviewed', or 'popular' cars.",
    ),
  minSafetyRating: z
    .number()
    .optional()
    .describe(
      "Minimum global/NCAP safety rating stars (1 to 5). Set to 4 or 5 if user mentions 'safety', 'family security', or 'safe cars'.",
    ),
});

export const intentExtraction = async (state: typeof GraphState.State) => {
  const structuredLlm = llm.withStructuredOutput(IntentSchema, {
    name: "extract_car_filters",
  });

  try {
    const extractedFilters = await structuredLlm.invoke([
      {
        role: "system",
        content: `You are a STRICT backend data extraction processor. You are NOT a conversational assistant.
        Your ONLY job is to analyze the conversation history and extract search parameters into the provided JSON schema.
        
        INSTRUCTIONS:
        1. If a user expresses a vague need, intelligently translate it into numerical thresholds (e.g., 'family car with lots of luggage space' -> minTrunkSpaceLiters: 400).
        2. IF THE USER IS JUST GREETING, MAKING SMALL TALK, OR IF NO FILTERS CAN BE EXTRACTED, YOU MUST RETURN AN EMPTY JSON OBJECT {}.
        3. DO NOT ask the user questions. DO NOT generate conversational text.
        4. CRITICAL: YOU MUST USE THE PROVIDED TOOL TO OUTPUT YOUR RESPONSE. NEVER OUTPUT PLAIN TEXT.`,
      },
      ...state.messages,
    ]);

    return {
      filters: {
        ...state.filters,
        ...extractedFilters,
      },
    };
  } catch (error) {
    console.error("Failed to extract intent:", error);
    return { filters: state.filters };
  }
};
