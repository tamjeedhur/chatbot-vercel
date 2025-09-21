"use client";
import { useState } from "react";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openApi = process.env.OPENAPI_KEY as string;
const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_KEY as string);

const useModelRequest = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const sendRequest = async (
    selectedModel: string,
    instructions: string,
    temperature: number = 0
  ) => {
    if (!selectedModel || !instructions) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(""); // Clear previous response

    // Declare result at the function scope level
    let result = "";

    try {
      const normalizedTemp = temperature / 100;

      switch (selectedModel) {
        case "gpt35":
          console.log("gpt streaming modal");
          try {
            if (!openApi) {
              throw new Error("OpenAI API key is missing");
            }

            const response = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${openApi}`,
                },
                body: JSON.stringify({
                  model: "gpt-3.5-turbo",
                  messages: [{ role: "system", content: instructions }],
                  temperature: normalizedTemp,
                  stream: true,
                }),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                `API request failed: ${response.status} ${
                  errorData.error?.message || "Unknown error"
                }`
              );
            }

            if (!response.body) {
              throw new Error("No response body received");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk
                .split("\n")
                .filter((line) => line.trim() !== "");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const message = line.replace(/^data: /, "");
                  if (message === "[DONE]") {
                    console.log("Stream completed");
                    return;
                  }

                  try {
                    const json = JSON.parse(message);
                    const content = json.choices[0]?.delta?.content;
                    if (content) {
                      result += content;
                      setResponse((prev) => prev + content);
                    }
                  } catch (err) {
                    console.error(
                      "Error parsing JSON:",
                      err,
                      "Raw message:",
                      message
                    );
                  }
                }
              }
            }
          } catch (error) {
            console.error("Streaming error:", error);
            throw error;
          }
          break;
        case "gemini":
          console.log("gemini streaming model");
          try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            // Use only the instructions without additional formatting
            const prompt = instructions;

            // Initialize the streaming response
            const streamingResponse = await model.generateContentStream(prompt);

            // Process the stream
            for await (const chunk of streamingResponse.stream) {
              const chunkText = chunk.text();
              result += chunkText;
              setResponse((prev) => prev + chunkText);
            }

            console.log("Gemini stream completed");
          } catch (error) {
            console.error("Gemini streaming error:", error);
            throw error;
          }
          break;
        default:
          throw new Error("Unknown model selected");
      }

      if (!result) {
        setResponse("No response received");
      }
    } catch (err: any) {
      console.error("Error details:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message.includes("API key")) {
        setError("API key error. Please check your configuration.");
      } else {
        setError(err.message || "Failed to get response from the model");
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, sendRequest };
};

export default useModelRequest;
