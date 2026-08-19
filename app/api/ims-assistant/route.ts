import OpenAI from "openai";

const IMS_API_URL = process.env.NEXT_PUBLIC_IMS_API_URL || "";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Missing message." },
        { status: 400 }
      );
    }

    if (!IMS_API_URL) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_IMS_API_URL." },
        { status: 500 }
      );
    }

    const imsResponse = await fetch(IMS_API_URL, {
      cache: "no-store",
    });

    if (!imsResponse.ok) {
      return Response.json(
        { error: "Failed to fetch IMS data." },
        { status: 500 }
      );
    }

    const imsData = await imsResponse.json();

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content:
            "You are the Daylight IMS Assistant. Only answer questions about the Daylight IMS dashboard, office inventory, DCL inventory, warranty issues, accessories, and office locator data. Use only the IMS JSON data provided. Do not make up numbers. If the answer is not in the data, say that the IMS data does not include that information. Keep answers concise and clear.",
        },
        {
          role: "user",
          content: `IMS JSON data:\n${JSON.stringify(
            imsData
          )}\n\nUser question:\n${message}`,
        },
      ],
    });

    return Response.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("IMS Assistant error:", error);

    return Response.json(
      { error: "IMS Assistant failed." },
      { status: 500 }
    );
  }
}