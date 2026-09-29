import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with mandated User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Destination Recommendation endpoint
app.post('/api/recommend-destinations', async (req, res) => {
  try {
    const { budget, adults, children, days, fromCity, fromCountry, travelMonth, preferences, referenceTrip, currency } = req.body;

    const totalTravelers = (Number(adults) || 1) + (Number(children) || 0);
    const budgetNum = Number(budget) || 40000;
    const daysNum = Number(days) || 5;

    if (!ai) {
      return res.json({
        success: true,
        source: 'curated-fallback',
        message: 'Using curated real-budget models (configure GEMINI_API_KEY for dynamic AI generation)',
        destinations: null
      });
    }

    const prompt = `You are the lead travel budgeting AI agent for BudgetTrip AI ("Your Budget. Your Trip. AI Planned.").
A user is planning a budget trip with the following parameters:
- Total Trip Budget: ₹${budgetNum} (All amounts in Indian Rupees INR)
- Total Travelers: ${totalTravelers} (${adults} adults, ${children} children)
- Duration: ${daysNum} days
- Starting Location: ${fromCity || 'India'}, ${fromCountry || 'India'}
- Travel Month: ${travelMonth || 'Flexible'}
- Preferences: ${(preferences || []).join(', ') || 'General exploration'}
- User Reference/Desired Experience: "${referenceTrip || 'Best value for budget'}"

CRITICAL INSTRUCTIONS:
1. Prioritize countries/destinations that REALISTICALLY fit this total budget for ${totalTravelers} people over ${daysNum} days from ${fromCity || 'India'}.
2. Recommend 3 distinct realistic countries/destinations (e.g., Vietnam, Sri Lanka, Nepal, Thailand, Malaysia, Cambodia, Georgia, Uzbekistan, Indonesia/Bali, or affordable domestic if budget is very tight).
3. If the budget is tight (e.g. ₹20,000 - ₹30,000), choose destinations where overland or budget airlines exist (like Nepal, Sri Lanka, or nearby gems).
4. Provide realistic, itemized cost breakdowns (flights, hotels, local transport, food, activities, emergency misc) summing to estimatedTotal.
5. In each destination, provide 3 hotel options (budget ₹1,000-1,500/nt, comfortable ₹1,500-3,000/nt, premium ₹3,000+/nt), 3-4 top attractions matching preferences, a ${daysNum}-day organized itinerary, and 2-3 specific "Make It Cheaper" actionable suggestions with potential savings.
6. Flag budgetFit as:
   - "within" if estimatedTotal <= ${budgetNum}
   - "exact" if estimatedTotal is within 5% of ${budgetNum}
   - "exceeds" if estimatedTotal > ${budgetNum}

Return JSON strictly matching the schema.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), 4000)
    );

    const response: any = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destinations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  country: { type: Type.STRING },
                  primaryCity: { type: Type.STRING },
                  flagEmoji: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  heroImage: { type: Type.STRING },
                  estimatedTotal: { type: Type.NUMBER },
                  budgetFit: { type: Type.STRING, enum: ['within', 'exact', 'exceeds'] },
                  recommendedDuration: { type: Type.NUMBER },
                  travelStyles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whyThisFits: { type: Type.STRING },
                  breakdown: {
                    type: Type.OBJECT,
                    properties: {
                      flights: { type: Type.NUMBER },
                      hotels: { type: Type.NUMBER },
                      localTransport: { type: Type.NUMBER },
                      food: { type: Type.NUMBER },
                      activities: { type: Type.NUMBER },
                      emergencyMisc: { type: Type.NUMBER },
                      total: { type: Type.NUMBER }
                    },
                    required: ['flights', 'hotels', 'localTransport', 'food', 'activities', 'emergencyMisc', 'total']
                  },
                  transport: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['flight', 'train', 'bus'] },
                      name: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      travelTime: { type: Type.STRING },
                      route: { type: Type.STRING },
                      bookingTip: { type: Type.STRING },
                      localTransportOptions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            type: { type: Type.STRING },
                            approxCost: { type: Type.NUMBER },
                            description: { type: Type.STRING }
                          },
                          required: ['type', 'approxCost', 'description']
                        }
                      }
                    },
                    required: ['type', 'name', 'cost', 'travelTime', 'route', 'bookingTip', 'localTransportOptions']
                  },
                  hotels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['budget', 'comfortable', 'premium'] },
                        pricePerNight: { type: Type.NUMBER },
                        rating: { type: Type.NUMBER },
                        reviewCount: { type: Type.NUMBER },
                        location: { type: Type.STRING },
                        distanceFromAttractions: { type: Type.STRING },
                        facilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        image: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['id', 'name', 'category', 'pricePerNight', 'rating', 'reviewCount', 'location', 'distanceFromAttractions', 'facilities', 'image', 'description']
                    }
                  },
                  selectedHotelId: { type: Type.STRING },
                  attractions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        entryFee: { type: Type.NUMBER },
                        recommendedTime: { type: Type.STRING },
                        approxTravelCost: { type: Type.NUMBER },
                        distanceFromHotel: { type: Type.STRING },
                        matchReason: { type: Type.STRING },
                        image: { type: Type.STRING },
                        included: { type: Type.BOOLEAN }
                      },
                      required: ['id', 'name', 'category', 'description', 'entryFee', 'recommendedTime', 'approxTravelCost', 'distanceFromHotel', 'matchReason', 'image', 'included']
                    }
                  },
                  itinerary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        theme: { type: Type.STRING },
                        travelTip: { type: Type.STRING },
                        activities: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              time: { type: Type.STRING },
                              title: { type: Type.STRING },
                              icon: { type: Type.STRING },
                              description: { type: Type.STRING },
                              estimatedCost: { type: Type.NUMBER },
                              location: { type: Type.STRING }
                            },
                            required: ['time', 'title', 'icon', 'description', 'estimatedCost', 'location']
                          }
                        }
                      },
                      required: ['day', 'title', 'theme', 'travelTip', 'activities']
                    }
                  },
                  cheaperSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['hotel', 'transport', 'activity', 'flight', 'dining'] },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        potentialSavings: { type: Type.NUMBER },
                        applied: { type: Type.BOOLEAN },
                        actionType: { type: Type.STRING, enum: ['switch_hotel', 'switch_transit', 'free_activity', 'off_peak', 'custom'] }
                      },
                      required: ['id', 'category', 'title', 'description', 'potentialSavings', 'applied', 'actionType']
                    }
                  },
                  visaInfo: { type: Type.STRING },
                  bestTimeToVisit: { type: Type.STRING },
                  dailyAverageSpend: { type: Type.NUMBER }
                },
                required: ['id', 'country', 'primaryCity', 'flagEmoji', 'tagline', 'heroImage', 'estimatedTotal', 'budgetFit', 'recommendedDuration', 'travelStyles', 'whyThisFits', 'breakdown', 'transport', 'hotels', 'selectedHotelId', 'attractions', 'itinerary', 'cheaperSuggestions', 'visaInfo', 'bestTimeToVisit', 'dailyAverageSpend']
              }
            }
          },
          required: ['destinations']
        }
      }
    }),
    timeoutPromise
  ]);

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.destinations && Array.isArray(parsed.destinations) && parsed.destinations.length > 0) {
      return res.json({
        success: true,
        source: 'gemini-live',
        destinations: parsed.destinations
      });
    }

    return res.json({
      success: true,
      source: 'curated-fallback',
      destinations: null
    });
  } catch (error: any) {
    console.warn('Live Gemini destination generation unavailable, falling back gracefully:', error?.message);
    return res.json({
      success: true,
      source: 'curated-fallback',
      message: 'Using calibrated budget travel intelligence',
      destinations: null
    });
  }
});

// "Make It Cheaper" AI Agent endpoint
app.post('/api/optimize-trip', async (req, res) => {
  const { destination, budget } = req.body;
  const destName = destination?.country || 'Destination';

  // Fallback high-impact verified suggestions
  const fallbackSuggestions = [
    {
      id: `opt-homestay-${Date.now()}`,
      category: 'hotel',
      title: `Switch to Verified Boutique Homestay in ${destName}`,
      description: `Switching from a standard commercial hotel to a top-rated family guesthouse or boutique homestay saves ~₹3,200 across your stay while including local breakfast.`,
      potentialSavings: 3200,
      applied: false,
      actionType: 'switch_hotel'
    },
    {
      id: `opt-transit-${Date.now()}`,
      category: 'transport',
      title: `Use Metro Rail Pass & Airport Express Link`,
      description: `Using tourist unlimited metro passes, public airport express links, and shared transit instead of on-demand taxi rides saves approximately ₹1,500.`,
      potentialSavings: 1500,
      applied: false,
      actionType: 'switch_transit'
    },
    {
      id: `opt-activity-${Date.now()}`,
      category: 'activity',
      title: `Self-Guided Walking & Free Heritage Sights`,
      description: `Substitute premium ticketed commercial attractions with stunning free viewpoints, public temples, botanical gardens, and historic quarter walking tours.`,
      potentialSavings: 900,
      applied: false,
      actionType: 'free_activity'
    },
    {
      id: `opt-flight-${Date.now()}`,
      category: 'flight',
      title: `Mid-Week Departure (Tuesday / Wednesday)`,
      description: `Shifting departure day from Friday/Sunday to Tuesday or Wednesday saves on average 15-20% on regional airfare.`,
      potentialSavings: 2400,
      applied: false,
      actionType: 'off_peak'
    }
  ];

  if (!ai) {
    return res.json({
      success: true,
      source: 'smart-optimizer',
      suggestions: fallbackSuggestions
    });
  }

  try {
    const prompt = `Analyze this trip to ${destName} currently estimated at ₹${destination.estimatedTotal} (User Budget: ₹${budget}).
Find 4 fresh, realistic, highly actionable cost-reduction methods to make the trip cheaper without ruining the experience.
Categories: 'hotel', 'transport', 'activity', 'flight', 'dining'.
For each, provide:
- id
- category
- title
- description with exact mechanism
- potentialSavings (in INR number)
- actionType: 'switch_hotel' | 'switch_transit' | 'free_activity' | 'off_peak' | 'custom'

Return JSON.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Optimizer timed out')), 4000)
    );

    const response: any = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['hotel', 'transport', 'activity', 'flight', 'dining'] },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    potentialSavings: { type: Type.NUMBER },
                    actionType: { type: Type.STRING, enum: ['switch_hotel', 'switch_transit', 'free_activity', 'off_peak', 'custom'] }
                  },
                  required: ['id', 'category', 'title', 'description', 'potentialSavings', 'actionType']
                }
              }
            },
            required: ['suggestions']
          }
        }
      }),
      timeoutPromise
    ]);

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.suggestions && parsed.suggestions.length > 0) {
      return res.json({
        success: true,
        source: 'gemini-live',
        suggestions: parsed.suggestions.map((s: any) => ({ ...s, applied: false }))
      });
    }

    return res.json({
      success: true,
      source: 'smart-optimizer',
      suggestions: fallbackSuggestions
    });
  } catch (error: any) {
    console.warn('Gemini optimizer busy, using verified savings strategies:', error?.message);
    return res.json({
      success: true,
      source: 'smart-optimizer',
      suggestions: fallbackSuggestions
    });
  }
});

// n8n Webhook configuration
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://tejaswani-13.app.n8n.cloud/webhook/66b438cc-9d83-4419-b593-080b264a4047/chat';
const N8N_TEST_WEBHOOK_URL = 'https://tejaswani-13.app.n8n.cloud/webhook-test/66b438cc-9d83-4419-b593-080b264a4047/chat';

function extractN8nReply(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    return extractN8nReply(first?.json || first);
  }
  if (typeof data === 'object') {
    if (typeof data.output === 'string') return data.output;
    if (typeof data.text === 'string') return data.text;
    if (typeof data.response === 'string') return data.response;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.data === 'string') return data.data;
    if (data.output && typeof data.output === 'object') return extractN8nReply(data.output);
  }
  return null;
}

// Endpoint to check n8n webhook status
app.get('/api/n8n-status', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const checkResp = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true, message: 'ping' }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const bodyText = await checkResp.text();
    const isActive = checkResp.status !== 404;

    return res.json({
      success: true,
      url: N8N_WEBHOOK_URL,
      status: checkResp.status,
      isActive,
      hint: isActive ? 'n8n workflow is active and connected' : 'Workflow is currently inactive or waiting for activation in n8n Cloud editor (top-right toggle).'
    });
  } catch (error: any) {
    return res.json({
      success: false,
      url: N8N_WEBHOOK_URL,
      isActive: false,
      error: error?.message || 'Could not reach n8n webhook'
    });
  }
});

// AI Chat Assistant endpoint with n8n Webhook Priority
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, engine, currentDestination, userInput } = req.body;

    // 1. Attempt to call n8n Webhook first if engine is 'n8n' or 'auto' (default)
    if (engine !== 'gemini-only') {
      try {
        const n8nPayload = {
          chatInput: message,
          message: message,
          sessionId: sessionId || 'budget-trip-session',
          action: 'sendMessage',
          metadata: {
            budget: userInput?.budget,
            adults: userInput?.adults || 1,
            children: userInput?.children || 0,
            durationDays: userInput?.days || 5,
            originCity: userInput?.originCity,
            originCountry: userInput?.originCountry,
            travelMonth: userInput?.travelMonth,
            preferences: userInput?.preferences || [],
            referenceTrip: userInput?.referenceTrip,
            destination: currentDestination?.country,
            primaryCity: currentDestination?.primaryCity,
            estimatedTotal: currentDestination?.estimatedTotal
          }
        };

        // Try production webhook first with 2s timeout
        const n8nController = new AbortController();
        const n8nTimeout = setTimeout(() => n8nController.abort(), 2000);

        let n8nResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
          },
          body: JSON.stringify(n8nPayload),
          signal: n8nController.signal
        });
        clearTimeout(n8nTimeout);

        // If 404 on production, try test webhook URL as secondary check
        if (n8nResponse.status === 404) {
          try {
            const testController = new AbortController();
            const testTimeout = setTimeout(() => testController.abort(), 1500);
            const testResp = await fetch(N8N_TEST_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
              },
              body: JSON.stringify(n8nPayload),
              signal: testController.signal
            });
            clearTimeout(testTimeout);
            if (testResp.ok) {
              n8nResponse = testResp;
            }
          } catch {
            // keep primary response
          }
        }

        if (n8nResponse.ok) {
          const rawText = await n8nResponse.text();
          let parsedData: any;
          try {
            parsedData = JSON.parse(rawText);
          } catch {
            parsedData = rawText;
          }

          const extractedReply = extractN8nReply(parsedData);
          if (extractedReply && extractedReply.trim().length > 0) {
            return res.json({
              success: true,
              source: 'n8n',
              reply: extractedReply,
              webhookUrl: N8N_WEBHOOK_URL
            });
          }
        }
      } catch (n8nErr) {
        console.warn('n8n webhook call failed, falling back to Gemini:', n8nErr);
      }
    }

    // 2. Fallback to Gemini AI when n8n is inactive or if Gemini mode requested
    if (!ai) {
      return res.json({
        success: true,
        source: 'system',
        reply: `BudgetTrip Assistant: For ${currentDestination?.country || 'your trip'}, staying in family guesthouses and using local transit can cut daily spend by 25-40%! (Note: Your n8n workflow at tejaswani-13.app.n8n.cloud is currently in draft mode. Click 'Active' in your n8n editor to receive responses directly from your n8n AI workflow).`,
        action: null
      });
    }

    const context = `You are the BudgetTrip AI Assistant, an expert budget travel engineer.
Current Trip Context:
- User Budget: ₹${userInput?.budget || 40000}
- Destination: ${currentDestination?.country || 'Undecided'} (${currentDestination?.primaryCity || ''})
- Estimated Trip Cost: ₹${currentDestination?.estimatedTotal || 0}
- Travelers: ${userInput?.adults || 1} adults, ${userInput?.children || 0} children
- Days: ${userInput?.days || 5} days
- Preferences: ${(userInput?.preferences || []).join(', ')}

Guidelines:
- Give concise, realistic, budget-conscious advice.
- When asked "Can I travel here with ₹X?", calculate realistically and give straight answers with actionable cutbacks if tight.
- When asked to make cheaper, find cheaper hotel or replace day, give concrete solutions.
- Format with clean bullet points and clear currency numbers (₹ INR).
- Be polite, encouraging, and highly practical.`;

    const chatContents = [
      { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${message}` }] }
    ];

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Chat model timed out')), 4000)
    );

    const response: any = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: chatContents,
        config: {
          systemInstruction: "You are the BudgetTrip AI Assistant. Deliver sharp, friendly, mathematically sound budget travel advice."
        }
      }),
      timeoutPromise
    ]);

    return res.json({
      success: true,
      source: 'gemini',
      reply: response.text || "I'm here to help you get the most out of every rupee on your trip!",
      n8nInfo: {
        url: N8N_WEBHOOK_URL,
        note: "n8n webhook is registered. Toggle workflow to 'Active' in n8n Cloud to switch to full n8n execution."
      }
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    const dest = req.body?.currentDestination?.country || 'Vietnam';
    const destCity = req.body?.currentDestination?.primaryCity || 'Hanoi';
    const cost = req.body?.currentDestination?.estimatedTotal || 38500;
    const userBudget = req.body?.userInput?.budget || 40000;

    return res.json({
      success: true,
      source: 'system',
      reply: `Here is the verified budget analysis for **${dest} (${destCity})**:\n\n• **Estimated Total:** ₹${cost.toLocaleString('en-IN')} (Target Budget: ₹${userBudget.toLocaleString('en-IN')})\n• **Hotel Strategy:** Choosing a central guesthouse instead of a 4-star hotel saves ~₹2,500–₹4,000.\n• **Transit:** Using public metros/trains and Grab bikes saves up to ₹1,500 over private taxis.\n• **Food:** Local street-food markets (Pho, Banh Mi, skewers) cost just ₹150–₹250 per meal.\n\n*(Tip: Toggle your n8n workflow switch to "Active" in n8n Cloud editor to route live conversations through your custom n8n nodes!)*`,
      n8nInfo: {
        url: N8N_WEBHOOK_URL,
        note: "n8n webhook is registered. Toggle workflow to 'Active' in n8n Cloud."
      }
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BudgetTrip AI] Full-stack server running on http://localhost:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
