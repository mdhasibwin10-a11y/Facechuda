export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { source, target } = req.body;
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Model identifier for AI face swap
        version: "c4df97a39e80a0...model-version-hash...", 
        input: {
          swap_image: source,
          target_image: target
        }
      })
    });

    const prediction = await response.json();
    res.status(200).json({ output: prediction.output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}