import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const serpKey = process.env.serp_api_key;
const openAIKey = process.env.openai_api_key;
console.log(serpKey);

const tools = [new Calculator(), new SerpAPI()];

exports.handler = async function (event) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: serpKey }),
  };
};
