import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY environment variable')
  throw new Error('Missing Gemini API key. Please add GEMINI_API_KEY to your .env.local file')
}

export const genAI = new GoogleGenerativeAI(apiKey)

// Helper function to get available models (for debugging)
export async function listAvailableModels() {
  try {
    // Use REST API directly to list models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error listing models:', error)
    return null
  }
}

export async function summarizeFile(fileContent: string, fileName: string, mimeType: string): Promise<string> {
  // Use models that support generateContent - discovered via listModels API
  // Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, etc.
  const modelNames = [
    'models/gemini-2.0-flash',      // Fast and stable
    'models/gemini-2.5-flash',     // Latest flash model
    'models/gemini-2.5-pro',       // Latest pro model
    'models/gemini-2.0-flash-001'  // Stable version
  ]
  
  const prompt = `Please provide a comprehensive summary of the following file (${fileName}, type: ${mimeType}). 
  
File content:
${fileContent}

Please provide:
1. A brief overview of what the file contains
2. Key points or main topics
3. Any important details or findings
4. Overall summary

Format your response in a clear, structured manner.`

  let lastError: any = null
  
  // Try each model name until one works
  for (const modelName of modelNames) {
    try {
      console.log(`Trying model: ${modelName}`)
      const model = genAI.getGenerativeModel({ model: modelName })
      
      // Retry logic for rate limits
      let retries = 3
      let delay = 2000 // Start with 2 seconds
      
      while (retries > 0) {
        try {
          const result = await model.generateContent(prompt)
          const response = await result.response
          console.log(`Success with model: ${modelName}`)
          return response.text()
        } catch (error: any) {
          // Check if it's a rate limit error (429)
          if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
            if (retries > 1) {
              // Extract retry delay from error if available
              const retryMatch = error.message?.match(/retry in (\d+\.?\d*)s/i)
              if (retryMatch) {
                delay = parseFloat(retryMatch[1]) * 1000
              }
              console.log(`Rate limit hit, retrying in ${delay/1000}s... (${retries-1} retries left)`)
              await new Promise(resolve => setTimeout(resolve, delay))
              delay *= 2 // Exponential backoff
              retries--
              continue
            }
          }
          throw error // Re-throw if not rate limit or out of retries
        }
      }
    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error.message)
      lastError = error
      // Continue to next model
    }
  }
  
  // If all models failed, provide helpful error message
  const errorMessage = lastError?.message || 'Unknown error'
  
  // Better error messages for specific cases
  if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
    throw new Error(`Rate limit exceeded. Please wait a moment and try again. You can check your usage at https://ai.dev/usage?tab=rate-limit`)
  }
  
  throw new Error(`Failed to generate summary. Error: ${errorMessage}`)
}

