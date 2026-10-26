import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { source, target } = req.body;

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'REPLICATE_API_TOKEN is missing in Vercel environment variables.' });
  }

  try {
    const replicate = new Replicate();

    const input = {
        swap_image: source,
        input_image: target
    };

    const output = await replicate.run(
      "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111", 
      { input }
    );

    // Convert output to a usable URL string
    const outputUrl = output && typeof output.url === 'function' ? output.url() : output;

    return res.status(200).json({ output: outputUrl });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
