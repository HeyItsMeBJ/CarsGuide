import { z } from "zod";
import { llm } from "../llm";
import { GraphState } from "../state";

const ResponseSchema = z.object({
  response: z
    .string()
    .describe(
      "Your friendly, highly conversational response introducing the recommendations. Explicitly highlight key benefits like safety, boot space, or fuel choice matching the user's situation.",
    ),
  recommendedCars: z
    .array(
      z.object({
        id: z
          .number()
          .describe("The exact database ID of the car being recommended."),
        reason: z
          .string()
          .describe(
            "A concise, punchy 1-2 sentence explanation of why this specific car fits the user's unique constraints (e.g., 'Perfect for your 12 Lakh budget with a massive 400L boot space for family trips').",
          ),
      }),
    )
    .describe(
      "A refined list of cars picked from the retrieved results that perfectly match the user's goals.",
    ),
  followUpQuestion: z
    .string()
    .describe(
      "A natural question to progress the discussion. Ask about monthly usage, seating needs, transmission preferences, or interest in flexible EMI options.",
    ),
});

export const generateResponse = async (state: typeof GraphState.State) => {
  const structuredLlm = llm.withStructuredOutput(ResponseSchema, {
    name: "generate_agent_response",
  });

  const sysPrompt = `
    You are an expert conversational car consultant helping a buyer find their ideal 4-wheeler.
    Your target users are often confused and have minimal technical automotive knowledge. Frame your guidance clearly and empathetically.

    DATA TO WORK WITH:
    - Current Extracted Filters: ${JSON.stringify(state.filters)}
    - Database Matches (Retrieved Cars): ${JSON.stringify(state.recommendedCarList)}

    YOUR INSTRUCTIONS:
    1. In the 'response' field, dynamically explain what choices you have highlighted and why. Connect their lifestyle goals (e.g., safety, value-for-money, low running costs) directly to the specifications of the cars.
    2. If no matching vehicles were found in the Database Matches, politely explain that in your response, provide no car items in the list, and ask a follow-up question to adjust their search criteria (like budget or body style).
    3. For every car you decide to feature in 'recommendedCars', populate its exact database 'id' and formulate a tailored, custom reason explaining why that model suits them.

    CRITICAL INSTRUCTION: YOU MUST USE THE PROVIDED TOOL/FUNCTION TO OUTPUT YOUR RESPONSE. 
    NEVER OUTPUT PLAIN TEXT. ALWAYS FORMAT AS THE REQUESTED STRUCTURE.
  `;

  try {
    const result = await structuredLlm.invoke([
      { role: "system", content: sysPrompt },
      ...state.messages,
    ]);

    const enrichedRecommendations = result.recommendedCars.map((aiRec) => {
      const dbCarDetails = state.recommendedCarList.find(
        (dbCar: { id: number }) => dbCar.id === aiRec.id,
      );

      return {
        id: aiRec.id,
        reason: aiRec.reason,
        carDetails: dbCarDetails || null, 
      };
    });

    return {
      response: result.response,
      recommendedCarList: enrichedRecommendations, // This maps straight into your GraphState
      followUpQuestion: result.followUpQuestion,
    };
  } catch (error) {
    console.error("Failed to generate structured response:", error);

    // Fallback safety payload matching the state layout
    return {
      response:
        "I found a few great vehicles matching your description. Let's take a closer look!",
      recommendedCarList: state.recommendedCarList
        .slice(0, 2)
        .map((car: { id: number }) => ({
          reason:
            "Highly rated selection matching your active budget search criteria.",
            ...car,
        })),
      followUpQuestion:
        "Would you prefer to explore automatic gearboxes or manual configurations?",
    };
  }
};
