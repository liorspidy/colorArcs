document.addEventListener("DOMContentLoaded", function () {
  const paper = document.querySelector("#paper");
  const pen = paper.getContext("2d");
  let startTime = null;
  let isAnimating = false;

  const arcsNumberInput = document.querySelector("#arcsNum");
  const runLengthInput = document.querySelector("#runLength");
  const startButton = document.querySelector("#start");

  startButton.addEventListener("click", function () {
    isAnimating = true;
    startTime = new Date().getTime();
    draw();
  });

  arcsNumberInput.value = localStorage.getItem("arcsNumber")
    ? localStorage.getItem("arcsNumber")
    : arcsNumberInput.value;
  let arcsNumber = arcsNumberInput.value;
  arcsNumberInput.addEventListener("change", function (event) {
    arcsNumber = event.target.value;
    localStorage.setItem("arcsNumber", arcsNumber);
  });

  runLengthInput.value = localStorage.getItem("runLength")
    ? localStorage.getItem("runLength")
    : runLengthInput.value;
  let runLength = runLengthInput.value;
  runLengthInput.addEventListener("change", function (event) {
    runLength = event.target.value;
    localStorage.setItem("runLength", runLength);
  });

  const colors = [
    "#aaead8",
    "#acdedd",
    "#aedecf",
    "#ccdfc5",
    "#eee7ad",
    "#fde4a4",
    "#fcdcab",
    "#f4d8b6",
    "#f1d6bb",
    "#e7cacf",
    "#dec1df",
    "#e1c0e1",
    "#e3c3e4",
    "#cfc7ef",
    "#b9dbe6",
  ];

  const draw = () => {
    if (!isAnimating) return;

    const currentTime = new Date().getTime();

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
      x: paper.width * 0.05,
      y: paper.height * 0.95,
    };

    const end = {
      x: paper.width * 0.95,
      y: paper.height * 0.95,
    };

    const center = {
      x: paper.width / 2,
      y: paper.height * 0.95,
    };

    // The length of the base line
    const length = end.x - start.x;

    // The radius of the arc
    const radius = length * 0.05;
    const arcsSpacing = (length / 2 - radius) / arcsNumber;

    pen.strokeStyle = "white";
    pen.lineWidth = 4;

    // Draw the base line
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    for (let i = 0; i < arcsNumber; i++) {
      const color = colors[i % colors.length];
      const arcRadius = radius + i * arcsSpacing;

      pen.strokeStyle = color;
      pen.lineWidth = 4;

      // Draw the arc
      pen.beginPath();
      pen.arc(center.x, center.y, arcRadius, Math.PI, Math.PI * 2);
      pen.stroke();

      // Draw the ball
      const timePassed = (currentTime - startTime) / 1000;
      const oneFullLoop = Math.PI * 2;
      const numberOfLoops = arcsNumber;
      const speed = (oneFullLoop * (numberOfLoops - i)) / (runLength * 60);
      const maxAngle = Math.PI * 2;
      const distance = speed * timePassed + Math.PI;
      const moduloDistance = distance % maxAngle;
      let fixedDistance =
        moduloDistance >= Math.PI ? moduloDistance : maxAngle - moduloDistance;

      const ballX = center.x + arcRadius * Math.cos(fixedDistance);
      const ballY = center.y + arcRadius * Math.sin(fixedDistance);

      pen.beginPath();
      pen.arc(
        ballX,
        ballY,
        Math.min(arcsSpacing / 3, radius * 0.15),
        0,
        Math.PI * 2
      );
      pen.fillStyle = "white";
      pen.fill();
    }

    requestAnimationFrame(draw);
  };
});
