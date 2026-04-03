package com.example.aiapp

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var api: ApiClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        api = ApiClient()

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }

        val input = EditText(this)
        val spinner = Spinner(this)
        val button = Button(this)
        val output = TextView(this)

        val providers = arrayOf(
            "qwen",
            "llama",
            "mistral",
            "gemma",
            "gemini"
        )

        spinner.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_dropdown_item,
            providers
        )

        button.text = "Send"

        button.setOnClickListener {
            val prompt = input.text.toString()
            val provider = spinner.selectedItem.toString()

            api.sendPrompt(prompt, provider) {
                runOnUiThread {
                    output.text = it
                }
            }
        }

        layout.addView(input)
        layout.addView(spinner)
        layout.addView(button)
        layout.addView(output)

        setContentView(layout)
    }
}
