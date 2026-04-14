import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://biagro-project.onrender.com");

export default function RoverControl() {

  const [rover, setRover] = useState({});

  useEffect(() => {

    socket.on("rover-update", (data) => {
      setRover(data);
    });

  }, []);

  const move = (dir) => {
    socket.emit("move-rover", dir);
  };

  return (
    <div style={styles.box}>

      <h3>🚜 Live Rover Control</h3>

      <p>📍 X: {rover.x}</p>
      <p>📍 Y: {rover.y}</p>
      <p>🔋 Battery: {rover.battery}%</p>
      <p>📡 Direction: {rover.direction}</p>

      <div style={styles.controls}>

        <button onClick={() => move("UP")}>⬆️</button>

        <div>
          <button onClick={() => move("LEFT")}>⬅️</button>
          <button onClick={() => move("RIGHT")}>➡️</button>
        </div>

        <button onClick={() => move("DOWN")}>⬇️</button>

      </div>

    </div>
  );
}

const styles = {
  box: {
    padding: "15px",
    background: "rgba(0,0,0,0.4)",
    borderRadius: "10px",
    color: "white"
  },

  controls: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px"
  }
};