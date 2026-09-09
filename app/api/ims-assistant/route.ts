import OpenAI from "openai";

function getImsApiUrl() {
  return process.env.NEXT_PUBLIC_IMS_API_URL || process.env.IMS_API_URL || "";
}

function extractRequestedSerial(message: string) {
  const explicitSerialMatch = message.match(
    /(?:serial(?:\s+number)?|s\/n|sn)\s*[:#-]?\s*([A-Za-z0-9][A-Za-z0-9-]{4,})/i
  );

  if (explicitSerialMatch?.[1]) {
    return explicitSerialMatch[1].trim();
  }

  const possibleSerials = message.match(
    /\b(?=[A-Za-z0-9-]{6,}\b)(?=[A-Za-z0-9-]*\d)(?=[A-Za-z0-9-]*[A-Za-z0-9])[A-Za-z0-9-]+\b/g
  );

  if (!possibleSerials || possibleSerials.length === 0) {
    return "";
  }

  const ignoredWords = new Set([
    "gpt-5",
    "dc-1",
    "dc-1s",
    "openai",
    "ims",
    "dcl",
    "office",
    "warranty",
    "inventory",
    "accessory",
    "accessories",
  ]);

  const match = possibleSerials.find((value) => {
    const normalized = value.toLowerCase();

    if (ignoredWords.has(normalized)) {
      return false;
    }

    return value.length >= 6;
  });

  return match || "";
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch IMS data. Status: ${response.status}`);
  }

  return response.json();
}
export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const imsApiUrl = getImsApiUrl();

    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    if (!imsApiUrl) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_IMS_API_URL or IMS_API_URL." },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing message." }, { status: 400 });
    }

    const requestedSerial = extractRequestedSerial(message);
    const imsData = await fetchJson(imsApiUrl);

    let serialLookup = null;

    if (requestedSerial) {
      const serialUrl = new URL(imsApiUrl);
      serialUrl.searchParams.set("serial", requestedSerial);

      const serialData = await fetchJson(serialUrl.toString());
      serialLookup = serialData.serialLookup || null;
    }

    const enrichedImsData = {
      ...imsData,
      requestedSerial,
      serialLookup,
    };

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content:
            "You are the Daylight IMS Assistant. Only answer questions about the Daylight IMS dashboard, office inventory, DCL inventory, warranty issues, accessories, serial numbers, and office locator data. Use only the IMS JSON data provided. Do not make up numbers. If the answer is not in the data, say that the IMS data does not include that information. If serialLookup is provided, use it as the source of truth for that serial number. If serialLookup.found is false, say that no latest record was found for that serial number. For serial number answers, include the serial number, item type, status, condition, shelf, rack, warranty issue, notes, and latest timestamp when available. Keep answers concise and clear.",
        },
        {
          role: "user",
          content: `IMS JSON data:\n${JSON.stringify(
            enrichedImsData
          )}\n\nUser question:\n${message}`,
        },
      ],
    });

    return Response.json({
      answer: response.output_text,
      requestedSerial,
      serialLookup,
    });
  } catch (error) {
    console.error("IMS Assistant error:", error);

    return Response.json(
      { error: "IMS Assistant failed." },
      { status: 500 }
    );
  }
}