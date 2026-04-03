export interface Env {
  AI: any
  GEMINI_API_KEY: string
}

type Provider =
  | "qwen"
  | "llama"
  | "mistral"
  | "gemma"
  | "gemini"

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 })
    }

    try {
      const body = await req.json()
      const { prompt, provider } = body as {
        prompt: string
        provider: Provider
      }

      let result: any

      switch (provider) {
        case "qwen":
          result = await runWorkersAI(env, "@cf/qwen/qwen3-30b-a3b-fp8", prompt)
          break

        case "llama":
          result = await runWorkersAI(env, "@cf/meta/llama-3.3-70b-instruct-fp8-fast", prompt)
          break

        case "mistral":
          result = await runWorkersAI(env, "@cf/mistralai/mistral-7b-instruct-v0.2", prompt)
          break

        case "gemma":
          result = await runWorkersAI(env, "@cf/google/gemma-3-12b-it", prompt)
          break

        case "gemini":
          result = await runGemini(env, prompt)
          break

        default:
          return new Response("Invalid provider", { status: 400 })
      }

      return Response.json({
        success: true,
        provider,
        output: result
      })

    } catch (e: any) {
      return Response.json({
        success: false,
        error: e.message
      }, { status: 500 })
    }
  }
}

async function runWorkersAI(env: Env, model: string, prompt: string) {
  const response = await env.AI.run(model, {
    messages: [
      { role: "system", content: "You are a precise AI assistant." },
      { role: "user", content: prompt }
    ]
  })

  return response?.response || response
}

async function runGemini(env: Env, prompt: string) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  )

  const json = await res.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
              }
