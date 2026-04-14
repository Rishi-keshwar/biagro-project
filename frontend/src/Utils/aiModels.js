import * as tmImage from "@teachablemachine/image";

const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_URL/";

let model;

export const loadModel = async () => {
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
};

export const predictImage = async (image) => {
  const prediction = await model.predict(image);
  prediction.sort((a, b) => b.probability - a.probability);
  return prediction[0];
};