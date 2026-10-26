export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { source, target } = req.body;
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is not set in Vercel environment variables.' });
  }

  if (!source || !target) {
    return res.status(400).json({ error: 'Missing source or target image data.' });
  }

  try {
    // Call Replicate's official face-swap model endpoint
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "762eb1383ed0c6d7d425b01c385805553e19875e5f5f4b46c9f6920f78553641",
        input: {
          swap_image: source,
          input_image: target
        }
      })
    });

    const prediction = await response.json();

    if (prediction.error) {
      return res.status(500).json({ error: prediction.error });
    }

    // Handle synchronous or queued outputs
    let outputUrl = prediction.output;
    
    // If it's an array, grab the first item
    if (Array.isArray(outputUrl)) {
      outputUrl = outputUrl[0];
    }

    if (!outputUrl) {
      return res.status(500).json({ error: "AI processing timed out or returned no output." });
    }

    return res.status(200).json({ output: outputUrl });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
