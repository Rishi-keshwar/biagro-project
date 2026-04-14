import { useEffect, useState } from "react";
import axios from "axios";
import FarmMap from "../components/FarmMap";
import { loadModel, predictImage } from "../Utils/aiModels";


export default function Dashboard() {

  const [rover, setRover] = useState({});
  const [farm, setFarm] = useState({});
  const [ngo, setNgo] = useState([]);

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // =========================
  // LOAD BACKEND DATA
  // =========================
  useEffect(() => {

    const loadData = async () => {
      try {
        const roverRes = await axios.get("http://localhost:5000/rover");
        const farmRes = await axios.get("http://localhost:5000/farm");
        const ngoRes = await axios.get("http://localhost:5000/ngo");

        setRover(roverRes.data);
        setFarm(farmRes.data);
        setNgo(ngoRes.data);

      } catch (err) {
        console.log("API Error:", err);
      }
    };

    loadData();

    // 🔄 live rover battery simulation
    const interval = setInterval(() => {
      setRover(prev => ({
        ...prev,
        battery: prev.battery > 0 ? prev.battery - 1 : 100
      }));
    }, 4000);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    loadModel().catch(err => {
      console.error("Model load failed:", err);
      setUploadError("Unable to load AI model.");
    });
  }, []);

  // =========================
  // AI UPLOAD HANDLER
  // =========================
  const createImageFromFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setLoading(true);
    setUploadError("");

    try {
      const img = await createImageFromFile(selectedFile);
      const result = await predictImage(img);
      setAiResult(result.className);
    } catch (err) {
      console.log("AI Error:", err);
      setUploadError("AI detection failed. Please try another image.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.body}>

      {/* NAVBAR */}
      <div style={styles.nav}>
        <h2>🌿 BIAGRO AI CONTROL CENTER</h2>
        <p>Smart Agriculture Rover System</p>
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* ROVER */}
        <div style={styles.card}>
          <h3>🚜 Rover Status</h3>

          <div style={styles.rover}></div>

          <p>🔋 Battery: {rover.battery ?? "Loading..."}%</p>
          <p>💦 Spray: {rover.spray ?? "Medium"}</p>
          <p>📡 Status: {rover.status ?? "Active"}</p>
        </div>

        {/* FARM */}
        <div style={styles.card}>
          <h3>🌾 Farm Intelligence</h3>

          <p>📍 Acres: {farm.acres ?? 5}</p>
          <p>🌱 Crop: {farm.crop ?? "Rice"}</p>
          <p>🧱 Soil: {farm.soil ?? "Clay"}</p>
          <p>💊 Pesticide: {farm.pesticide ?? 12} L</p>

          <button style={styles.btn}>
            Recalculate AI
          </button>
        </div>

        {/* CAMERA */}
        <div style={styles.card}>
          <h3>📷 Rover Camera</h3>
          <div style={styles.camera}>
            LIVE FEED STREAM
          </div>
        </div>

      </div>

      {/* SECOND GRID */}
      <div style={styles.grid2}>

        {/* NGO */}
        <div style={styles.card}>
          <h3>🌾 NGO Support System</h3>

          {ngo.map((n, i) => (
            <p key={i}>
              📞 {n.name} - {n.phone}
            </p>
          ))}
        </div>

        {/* PST */}
        <div style={styles.card}>
          <h3>🚨 PST Analysis</h3>
          <p>🚜 Rover scanning farmland...</p>
          <p>🧠 AI detecting crop health...</p>
        </div>

      </div>

      {/* AI UPLOAD SECTION */}
      <div style={styles.upload}>

        <h3>📤 AI Leaf Disease Detection</h3>

        <input type="file" onChange={handleUpload} />

        {loading && <p>🧠 AI analyzing image...</p>}

        <p>AI Result: {aiResult ?? "Healthy / Blight / Disease"}</p>
        {uploadError && <p style={styles.error}>{uploadError}</p>}

        <div style={styles.analytics}>
          <h3>📊 Farm Analytics</h3>
          <p>Total Acres: {farm.acres ?? "N/A"}</p>
          <p>AI Health Score: 87%</p>
          <p>Spray Efficiency: High</p>
        </div>

        <FarmMap rover={rover} />

      </div>

    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {

  body: {
    fontFamily: "Arial",
    background: "linear-gradient(135deg,#0f3d1e,#1b5e20)",
    color: "white",
    minHeight: "100vh",
    padding: "10px"
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#0b2e16",
    borderRadius: "10px",
    alignItems: "center"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginTop: "10px"
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px"
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "15px",
    borderRadius: "15px",
    boxShadow: "0 0 15px rgba(0,255,100,0.2)"
  },

  rover: {
    height: "100px",
    background: "url('https://i.imgur.com/3KXQZ8M.gif')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    marginBottom: "10px"
  },

  camera: {
    height: "120px",
    background: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    marginTop: "10px"
  },

  upload: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "15px"
  },

  analytics: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "10px"
  },

  btn: {
    marginTop: "10px",
    padding: "10px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  resultBox: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(0,0,0,0.5)",
    borderRadius: "10px"
  },

  error: {
    marginTop: "10px",
    color: "#ff9aa2"
  }
};