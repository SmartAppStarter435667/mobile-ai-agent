package com.example.aiapp

import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class ApiClient {

    private val client = OkHttpClient()

    private val BASE_URL = "https://your-worker.your-subdomain.workers.dev"

    fun sendPrompt(
        prompt: String,
        provider: String,
        callback: (String) -> Unit
    ) {
        val json = JSONObject().apply {
            put("prompt", prompt)
            put("provider", provider)
        }

        val body = RequestBody.create(
            "application/json".toMediaTypeOrNull(),
            json.toString()
        )

        val request = Request.Builder()
            .url(BASE_URL)
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback("Error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                val resBody = response.body?.string()
                callback(resBody ?: "No response")
            }
        })
    }
}
