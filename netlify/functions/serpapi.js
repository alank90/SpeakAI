import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export const handler = async (event) => {
  // ---------- Vars declarations -------------------------------- //
  const openAIKey = event.queryStringParameters.openaikey;
  const serpKey = event.queryStringParameters.serpkey;
  const llmOptions = JSON.parse(event.queryStringParameters.llmOptions);
  const prefix = event.queryStringParameters.prefix;
  const userInput = event.queryStringParameters.userinput;
  console.log("User Input", userInput);
  const tools = [
    new SerpAPI(serpKey, {
      hl: "en",
      gl: "us",
      description:
        "a search engine. useful for when you need to answer questions about current events. input should be a search query.",
    }),
  ];
  let result = "";

  // Create a new AbortController instance
  let controller = new AbortController();
  let signal = controller.signal;

  const chat = new ChatOpenAI(llmOptions);

  const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "openai-functions",
    verbose: true,
    agentArgs: {
      prefix,
    },
  });

  await executor.call({
    input: userInput,
    signal: signal,
    callbacks: [
      {
        handleLLMNewToken(token) {
          result += token;
        },
      },
    ],
  });

  //const result = await executor.run(userInput);
  console.log("LLM Answer: ", result);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};
