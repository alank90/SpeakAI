# SpeakAi

&nbsp;&nbsp;This app is a spinoff of the playground
page on the OpenAI site. It also incorporates a _/dalle_ page to generate pictures from prompts. We use Vue 3 with Vue router to implement an SPA.

_Note_ - For a good writeup on how we streamed the completions from OpenAI /completions endpoint see the article [Stream OpenAI Chat Completions in JavaScript](https://www.builder.io/blog/stream-ai-javascript).

## Requirements

- [idb](https://www.npmjs.com/package/idb) - This is a tiny (~1.06kB brotli'd) library that mostly mirrors the IndexedDB API, but with small improvements that make a big difference to usability.

- [floating-vue](https://floating-vue.starpad.dev/) - A tooltips and dropdowns library.

- [An OpenAI API Key](https://platform.openai.com/login?launch) - API key for OpenAI

- [SERP API Key](https://serpapi.com/)- A SERP API key to use the SERP agent(optional).

## Notes

This app utilizes a Netlify Serverless function to proxy the request to the Google SERP API because,of course,Google doesn't support CORS.

### Deploying to Netlify

- **_npm run build_**

- **_netlify init_** (Follow the prompts to add a project to netlify.)

- **_netlify env:import .env_** (If necessary. You must then rebuild the project to add the environment
  variables to your project.)

- **Important** - The Node.js version must be set to at least _18.x_. This can be set under _Site Configuation -> Dependency management_.
