import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export const handler = async (event) => {
  console.log(event.queryStringParameters.serpkey);
  //const tools = [new Calculator(), new SerpAPI()];

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: event.queryStringParameters,
    }),
  };
};
