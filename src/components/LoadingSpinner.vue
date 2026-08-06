<template>
  <div class="loader-overlay">
    <div class="loader-container">
      <div class="atom-loader">
        <!-- 3D Inclined Rings with distinct neon colors -->
        <div class="ring ring-cyan"></div>
        <div class="ring ring-magenta"></div>
        <div class="ring ring-green"></div>
        <div class="ring ring-purple"></div>
        <div class="ring ring-blue"></div>

        <!-- Center Text -->
        <div class="center-text">
          <span>Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fullscreen Backdrop */
.loader-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  background: #04060a;
  pointer-events: auto; /* prevents clicking behind while loading */
}

.loader-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.atom-loader {
  position: relative;
  width: 220px;
  height: 220px;
  transform-style: preserve-3d;
}

/* Base Ring Styling */
.ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  transform-style: preserve-3d;
}

/* Color Palette & 3D Orientations matching the image */

/* Cyan Ring (Horizontal-ish Ellipse) */
.ring-cyan {
  border-top-color: #00e5ff;
  border-right-color: rgba(0, 229, 255, 0.4);
  transform: rotateX(70deg) rotateY(15deg);
  animation: spinCyan 4s linear infinite;
  filter: drop-shadow(0 0 10px #00e5ff) drop-shadow(0 0 20px #00e5ff);
}

/* Magenta Ring (Tilted Oval) */
.ring-magenta {
  border-bottom-color: #ff007f;
  border-left-color: rgba(255, 0, 127, 0.4);
  transform: rotateX(60deg) rotateY(-45deg);
  animation: spinMagenta 3.5s linear infinite;
  filter: drop-shadow(0 0 10px #ff007f) drop-shadow(0 0 25px #ff007f);
}

/* Neon Green Ring (Vertical Tilted) */
.ring-green {
  border-top-color: #39ff14;
  border-left-color: rgba(57, 255, 20, 0.3);
  transform: rotateX(-65deg) rotateY(30deg);
  animation: spinGreen 5s linear infinite;
  filter: drop-shadow(0 0 10px #39ff14) drop-shadow(0 0 20px #39ff14);
}

/* Purple Outer Trail Ring */
.ring-purple {
  border-right-color: #b026ff;
  border-top-color: rgba(176, 38, 255, 0.3);
  transform: rotateX(45deg) rotateY(75deg);
  animation: spinPurple 6s linear infinite;
  filter: drop-shadow(0 0 8px #b026ff) drop-shadow(0 0 18px #b026ff);
}

/* Blue Accent Thin Ring */
.ring-blue {
  border-bottom-color: #0088ff;
  transform: rotateX(-40deg) rotateY(-70deg);
  animation: spinBlue 4.5s linear infinite;
  filter: drop-shadow(0 0 6px #0088ff);
}

/* Center Text Styling */
.center-text {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.center-text span {
  color: #ffffff;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-shadow:
    0 0 5px rgba(255, 255, 255, 0.8),
    0 0 12px rgba(0, 229, 255, 0.6);
}

/* Smooth 3D Orbit Keyframes */
@keyframes spinCyan {
  0% {
    transform: rotateX(70deg) rotateY(15deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(70deg) rotateY(15deg) rotateZ(360deg);
  }
}

@keyframes spinMagenta {
  0% {
    transform: rotateX(60deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(60deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes spinGreen {
  0% {
    transform: rotateX(-65deg) rotateY(30deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(-65deg) rotateY(30deg) rotateZ(-360deg);
  }
}

@keyframes spinPurple {
  0% {
    transform: rotateX(45deg) rotateY(75deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(45deg) rotateY(75deg) rotateZ(360deg);
  }
}

@keyframes spinBlue {
  0% {
    transform: rotateX(-40deg) rotateY(-70deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(-40deg) rotateY(-70deg) rotateZ(-360deg);
  }
}
</style>
