import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const handler = async (req, res) => {
  const { address, amount } = JSON.parse(req.body);
  if (amount > 6) return res.status(400).json({ error: "Not more than 6 allowed" });
  if (amount == 4) return res.status(400).json({ error: "4 not allowed" });
  if (amount == 5) return res.status(400).json({ error: "5 not allowed" });

  const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, 'goerli');

  const contract = await sdk.getContract(
    '0xfF919Bb7Fff7DB653B065b211810d27944821591',
    'signature-drop',
  );

  const determinePricePerToken = (amount) => {
    if(amount == 1) return 0.001;
    if(amount >= 2 && amount < 3) return 0.75;
    if(amount >=3 && amount < 6) return 0.667;
    if(amount > 6) return 0.5;
  }
  
  const price = amount * determinePricePerToken(amount);

  try {
    const signedPayload = await contract.signature.generate({
      to: address,
      price,
      quantity: amount,
    });

    return res.status(200).json({
      signedPayload: signedPayload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};

export default handler;
