import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  messages: Annotation<{ role: string; content: string }[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),
  filters: Annotation<Record<string, any>>({
    reducer: (curr, next) => ({ ...curr, ...next }),
    default: () => ({}),
  }),
  response: Annotation<string>({
    reducer: (curr, next) => next,
    default: () => "",
  }),
  recommendedCarList: Annotation<any[]>({
    reducer: (curr, next) => next,
    default: () => [],
  }),
  followUpQuestion: Annotation<string>({
    reducer: (curr, next) => next,
    default: () => "",
  }),
});
