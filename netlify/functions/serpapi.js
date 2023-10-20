import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";

export const handler = async (event) => {
  // ---------- Vars declarations -------------------------------- //
  const serpKey = event.queryStringParameters.serpkey;
  const llmOptions = JSON.parse(event.queryStringParameters.llmOptions);
  const prefix = event.queryStringParameters.prefix;
  const userInput = event.queryStringParameters.userinput;
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

  return {
    headers: {
      // This is the mimetype for server-sent events
      "content-type": "text/event-stream",
    },
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};
