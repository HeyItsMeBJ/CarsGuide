import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphState } from "./state";
import { intentExtraction } from "./nodes/intent";
import { retrieveData } from "./nodes/retrival";
import { generateResponse } from "./nodes/generation";

const workflow = new StateGraph(GraphState)
  .addNode("intent_extraction", intentExtraction)
  .addNode("retrieve_data", retrieveData)
  .addNode("generate_response", generateResponse)
  .addEdge(START, "intent_extraction")
  .addEdge("intent_extraction", "retrieve_data")
  .addEdge("retrieve_data", "generate_response")
  .addEdge("generate_response", END);

export const carAgent = workflow.compile();
