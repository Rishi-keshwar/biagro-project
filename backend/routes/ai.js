const router = require("express").Router();

// 🧠 SIMPLE AI SIMULATION (replace with real model later)
router.post("/predict", (req, res) => {

  const { fileName } = req.body;

  let result = "healthy plant";

  if (fileName.includes("blight")) {
    result = "early blight";
  } else if (fileName.includes("mosaic")) {
    result = "mosaic virus";
  } else if (fileName.includes("leaf")) {
    result = "leaf mold";
  }

  let spray = "";

  if (result === "healthy plant") spray = "No pesticide needed 🌱";
  else if (result === "early blight") spray = "Mancozeb 💊";
  else if (result === "leaf mold") spray = "Neem Oil 💊";
  else spray = "Check manually ⚠️";

  res.json({
    disease: result,
    recommendation: spray
  });
});

module.exports = router;