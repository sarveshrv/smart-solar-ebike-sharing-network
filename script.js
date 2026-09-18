const bikes = [
  { id: "SEB-001", location: "ECE Block", battery: 92, status: "Available" },
  { id: "SEB-002", location: "Main Gate", battery: 76, status: "Available" },
  { id: "SEB-003", location: "Hostel Zone", battery: 64, status: "Available" },
  { id: "SEB-004", location: "Library", battery: 48, status: "Charging" },
  { id: "SEB-005", location: "Main Gate", battery: 87, status: "Available" }
];

let rideSeconds = 0;
let rideInterval = null;
let progress = 0;

const bikeList = document.getElementById("bikeList");
const bikeSelect = document.getElementById("bikeSelect");
const rideStatus = document.getElementById("rideStatus");
const rideInfo = document.getElementById("rideInfo");
const rideProgress = document.getElementById("rideProgress");
const rideTimer = document.getElementById("rideTimer");
const startRide = document.getElementById("startRide");
const endRide = document.getElementById("endRide");

function renderBikes() {
  bikeList.innerHTML = "";
  bikeSelect.innerHTML = "";

  bikes.forEach(bike => {
    const row = document.createElement("div");
    row.className = "bike";
    row.innerHTML = `
      <div>
        <strong>${bike.id}</strong>
        <small>📍 ${bike.location} • ${bike.status}</small>
      </div>
      <div class="battery">${bike.battery}%</div>
    `;
    bikeList.appendChild(row);

    if (bike.status === "Available") {
      const option = document.createElement("option");
      option.value = bike.id;
      option.textContent = `${bike.id} — ${bike.battery}% battery`;
      bikeSelect.appendChild(option);
    }
  });

  document.getElementById("availableBikes").textContent =
    bikes.filter(b => b.status === "Available").length;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

startRide.addEventListener("click", () => {
  const selected = bikes.find(b => b.id === bikeSelect.value);
  if (!selected) return;

  selected.status = "In Ride";
  renderBikes();

  rideStatus.textContent = "Ride active";
  rideStatus.className = "tag green";
  rideInfo.textContent = `${selected.id} is on a simulated ride.`;
  startRide.disabled = true;
  endRide.disabled = false;

  rideSeconds = 0;
  progress = 0;
  rideTimer.textContent = "00:00";

  clearInterval(rideInterval);
  rideInterval = setInterval(() => {
    rideSeconds++;
    progress = Math.min(100, progress + 1);
    rideTimer.textContent = formatTime(rideSeconds);
    rideProgress.style.width = `${progress}%`;

    if (selected.battery > 5 && rideSeconds % 20 === 0) {
      selected.battery--;
      renderBikes();
    }
  }, 1000);
});

endRide.addEventListener("click", () => {
  const active = bikes.find(b => b.status === "In Ride");
  if (active) {
    active.status = "Available";
    active.location = "Campus Drop Zone";
  }

  clearInterval(rideInterval);
  rideStatus.textContent = "Ride completed";
  rideStatus.className = "tag green";
  rideInfo.textContent = "The simulated ride has ended.";
  startRide.disabled = false;
  endRide.disabled = true;
  rideProgress.style.width = "0%";
  renderBikes();
});

document.getElementById("refreshBtn").addEventListener("click", () => {
  document.getElementById("solarPower").textContent =
    `${(2.0 + Math.random() * 0.8).toFixed(1)} kW`;
  document.getElementById("dockBattery").textContent =
    `${Math.floor(80 + Math.random() * 15)}%`;
  document.getElementById("co2Saved").textContent =
    `${(12 + Math.random() * 2).toFixed(1)} kg`;
  renderBikes();
});

renderBikes();
