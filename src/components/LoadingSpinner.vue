<template>
  <div class="loader-overlay">
    <div class="loader">
      <span class="orbit orbit1"></span>
      <span class="orbit orbit2"></span>
      <span class="orbit orbit3"></span>
      <span class="orbit orbit4"></span>
      <span class="orbit orbit5"></span>

      <div class="center-text">
        Loading...
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  background: radial-gradient(circle, #122b3d 0%, #08141f 55%, #03080f 100%);
}

.loader {
  position: relative;
  width: 260px;
  height: 260px;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-top: 2.5px solid currentColor;
  animation: spin linear infinite;
  filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 15px currentColor)
    drop-shadow(0 0 28px currentColor);
}

.orbit::before {
  content: '';
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: currentColor;
  left: 50%;
  top: -8px;
  transform: translateX(-50%);
  box-shadow:
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 35px currentColor;
}

.orbit::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -1px;
  transform: translateX(-50%);
  width: 45px;
  height: 3px;
  border-radius: 20px;
  background: linear-gradient(to right, transparent, currentColor, transparent);
  filter: blur(3px);
}

/* Different orbit sizes */
.orbit1 {
  inset: 0;
  color: #00e5ff;
  animation-duration: 2.8s;
}

.orbit2 {
  inset: 12px;
  color: #ff00ff;
  animation-duration: 3.5s;
}

.orbit3 {
  inset: 24px;
  color: #39ff14;
  animation-duration: 4.2s;
}

.orbit4 {
  inset: 36px;
  color: #ffffff;
  animation-duration: 5s;
}

.orbit5 {
  inset: 48px;
  color: #7c4dff;
  animation-duration: 3.8s;
}

.center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow:
    0 0 8px #fff,
    0 0 18px #00e5ff;
}

.dots {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: blink 1.2s infinite;
}

.dots span:nth-child(1) {
  background: #00e5ff;
}

.dots span:nth-child(2) {
  background: #ff00ff;
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  background: #39ff14;
  animation-delay: 0.4s;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.7);
  }

  40% {
    opacity: 1;
    transform: scale(1.35);
  }
}
</style>
