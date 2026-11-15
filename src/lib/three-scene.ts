import * as THREE from "three";
import type { ObjectKind } from "@/components/object-art";

// Each model is original procedural geometry; no external model or texture fetches.
export function mountObject(
  element: HTMLElement,
  kind: ObjectKind,
  decorative: boolean,
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0.3, kind === "megaphone" ? 6.4 : 7.1);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, matchMedia("(pointer: coarse)").matches ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.touchAction = "pan-y";
  element.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334428, 1.7));
  const light = new THREE.DirectionalLight(0xffffff, 3.5);
  light.position.set(-3, 5, 6);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0xb8ccff, 2.5);
  rim.position.set(4, 0, -3);
  scene.add(rim);
  const group = new THREE.Group();
  scene.add(group);
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const mat = (color: string, roughness = 0.32, metalness = 0.12) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      side: THREE.DoubleSide,
    });
    materials.push(material);
    return material;
  };
  const green = mat("#013900"),
    lime = mat("#b6fe00"),
    blue = mat("#3848cf"),
    orange = mat("#fa8005"),
    cream = mat("#fdfbe8"),
    yellow = mat("#f7d000");
  function mesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position = [0, 0, 0],
    parent = group,
  ) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(...(position as [number, number, number]));
    parent.add(item);
    return item;
  }
  const box = (
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    position: number[],
    parent = group,
  ) => mesh(new THREE.BoxGeometry(x, y, z), material, position, parent);
  const sphere = (
    r: number,
    material: THREE.Material,
    position: number[],
    parent = group,
  ) => mesh(new THREE.SphereGeometry(r, 32, 24), material, position, parent);
  function roundedBox(
    width: number,
    height: number,
    depth: number,
    radius: number,
    material: THREE.Material,
    position: number[],
  ) {
    const x = -width / 2,
      y = -height / 2,
      s = new THREE.Shape();
    s.moveTo(x + radius, y);
    s.lineTo(x + width - radius, y);
    s.quadraticCurveTo(x + width, y, x + width, y + radius);
    s.lineTo(x + width, y + height - radius);
    s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    s.lineTo(x + radius, y + height);
    s.quadraticCurveTo(x, y + height, x, y + height - radius);
    s.lineTo(x, y + radius);
    s.quadraticCurveTo(x, y, x + radius, y);
    const geometry = new THREE.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 12,
    });
    geometry.translate(0, 0, -depth / 2);
    return mesh(geometry, material, position);
  }
  function poster(lines: string[], background: string, color: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 896;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 768, 896);
    ctx.fillStyle = color;
    ctx.font = '900 220px "Barlow Condensed", Impact, sans-serif';
    // Canvas uses the already-loaded page heading font when available.
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-condensed")
      .trim();
    ctx.font = `900 220px ${family || "Impact"}`;
    lines.forEach((line, i) => ctx.fillText(line, 55, 260 + i * 225, 658));
    ctx.lineWidth = 17;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(570, 735);
    ctx.lineTo(675, 630);
    ctx.moveTo(570, 630);
    ctx.lineTo(675, 630);
    ctx.lineTo(675, 735);
    ctx.stroke();
    ctx.font = `800 37px ${family || "Arial"}`;
    ctx.fillText("GREATER KANDY", 55, 825);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.75,
    });
    materials.push(material);
    return material;
  }
  if (kind === "megaphone") {
    const cone = mesh(
      new THREE.CylinderGeometry(1.12, 0.34, 1.85, 64, 1, true),
      blue,
      [0, 0.24, 0],
    );
    cone.rotation.x = Math.PI / 2;
    const inside = mesh(
      new THREE.CylinderGeometry(1.065, 0.31, 1.79, 64, 1, true),
      cream,
      [0, 0.24, 0.01],
    );
    inside.rotation.x = Math.PI / 2;
    mesh(new THREE.TorusGeometry(1.1, 0.095, 16, 64), lime, [0, 0.24, 0.94]);
    const cap = mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.34, 40),
      orange,
      [0, 0.24, -1],
    );
    cap.rotation.x = Math.PI / 2;
    const throat = sphere(0.32, yellow, [0, 0.24, -0.45]);
    throat.scale.z = 0.3;
    const handle = roundedBox(
      0.42,
      1.18,
      0.45,
      0.12,
      orange,
      [0, -0.73, -0.58],
    );
    handle.rotation.x = -0.2;
    for (let i = 0; i < 3; i++)
      box(0.44, 0.045, 0.48, blue, [0, -0.65 - i * 0.17, -0.6]);
    group.rotation.set(-0.22, -0.85, -0.35);
  } else if (kind === "billboard") {
    roundedBox(3.05, 2.4, 0.19, 0.1, green, [0, 0.4, 0]);
    mesh(
      new THREE.PlaneGeometry(2.83, 2.19),
      poster(["GOOD IDEAS", "GO PLACES."], "#b6fe00", "#013900"),
      [0, 0.4, 0.14],
    );
    [-0.9, 0.9].forEach((x) => {
      box(0.16, 1.3, 0.16, green, [x, -1.28, -0.04]);
      box(0.8, 0.1, 0.6, green, [x, -1.91, 0]);
    });
    group.rotation.set(-0.05, -0.3, -0.12);
  } else if (kind === "kiosk") {
    roundedBox(1.85, 3.05, 0.28, 0.18, blue, [0, 0.22, 0]);
    mesh(
      new THREE.PlaneGeometry(1.6, 2.55),
      poster(["HELLO", "KANDY."], "#b6fe00", "#013900"),
      [0, 0.32, 0.19],
    );
    sphere(0.055, lime, [0, -1.18, 0.19]);
    box(0.3, 0.63, 0.35, green, [0, -1.55, 0]);
    roundedBox(1.8, 0.12, 0.75, 0.05, green, [0, -1.9, 0]);
    group.rotation.set(-0.05, -0.32, 0.12);
  } else {
    mesh(
      new THREE.CylinderGeometry(0.66, 0.46, 0.84, 48),
      orange,
      [0, -1.22, 0],
    );
    mesh(
      new THREE.TorusGeometry(0.63, 0.07, 12, 48),
      orange,
      [0, -0.8, 0],
    ).rotation.x = Math.PI / 2;
    mesh(
      new THREE.CylinderGeometry(0.075, 0.09, 1.75, 20),
      green,
      [0, -0.1, 0],
    );
    for (const side of [-1, 1]) {
      const leaf = sphere(0.32, green, [side * 0.24, -0.25 + side * 0.2, 0]);
      leaf.scale.set(1.4, 0.4, 0.7);
      leaf.rotation.z = side * 0.65;
    }
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const petal = sphere(0.36, blue, [
        Math.sin(a) * 0.65,
        0.95 + Math.cos(a) * 0.65,
        0,
      ]);
      petal.scale.set(0.9, 1.3, 0.5);
      petal.rotation.z = -a;
    }
    const middle = sphere(0.42, yellow, [0, 0.95, 0.12]);
    middle.scale.z = 0.5;
    [-0.13, 0.13].forEach((x) => sphere(0.035, green, [x, 1, 0.32]));
    const smile = mesh(
      new THREE.TorusGeometry(0.14, 0.018, 8, 24, Math.PI),
      green,
      [0, 0.91, 0.32],
    );
    smile.rotation.z = Math.PI;
    group.rotation.set(0.02, -0.15, -0.1);
  }

  const baseline = group.rotation.clone();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const scrollPose = {
    turn: Number(element.dataset.scrollTurn || 0),
    tilt: Number(element.dataset.scrollTilt || 0),
  };
  const hover = { x: 0, y: 0 };
  let compiled = false, disposed = false, suspended = !!document.documentElement.dataset.transition;
  let elapsed = 0, previousTime = 0, lastRendered = 0;
  let isVisible = true,
    isPaused = false,
    frame = 0,
    rotation = 0,
    target = 0,
    down = false,
    pointerX = 0;
  const render = () => { if (compiled && !disposed) renderer.render(scene, camera); };
  const animate = (time: number) => {
    frame = 0;
    if (!compiled || disposed || !isVisible || document.hidden || suspended) { previousTime = 0; return; }
    if (time - lastRendered < 15.5) { frame = requestAnimationFrame(animate); return; }
    const delta = previousTime ? Math.min(time - previousTime, 50) : 16.67;
    previousTime = time;
    lastRendered = time;
    elapsed += delta;
    const still =
      isPaused ||
      reduced.matches ||
      document.documentElement.dataset.motion === "paused";
    rotation += (target - rotation) * (1 - Math.exp(-delta * 0.008));
    group.rotation.y =
      baseline.y +
      rotation +
      (still || down
        ? 0
        : Math.sin(elapsed * 0.00045) * 0.16 + scrollPose.turn + hover.x);
    group.rotation.x =
      baseline.x + (still || down ? 0 : scrollPose.tilt + hover.y);
    group.rotation.z =
      baseline.z + (still || down ? 0 : Math.sin(elapsed * 0.00035) * 0.035);
    group.position.y = still || down ? 0 : Math.sin(elapsed * 0.001) * 0.075;
    render();
    if (!still || Math.abs(target - rotation) > 0.001)
      frame = requestAnimationFrame(animate);
  };
  const wake = () => {
    if (!frame && compiled && !disposed && !suspended) frame = requestAnimationFrame(animate);
  };
  let previousWidth = 0, previousHeight = 0;
  const sizeCanvas = () => {
    // Layout dimensions do not fluctuate with the object's entrance transform.
    const width = element.clientWidth, height = element.clientHeight;
    if (!width || !height || (width === previousWidth && height === previousHeight)) return;
    previousWidth = width; previousHeight = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    wake();
  };
  const resize = new ResizeObserver(sizeCanvas);
  sizeCanvas();
  resize.observe(element);
  const visibility = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible) wake();
  });
  visibility.observe(element);
  const start = (e: PointerEvent) => {
    if (decorative) return;
    down = true;
    pointerX = e.clientX;
    element.setPointerCapture(e.pointerId);
    element.style.cursor = "grabbing";
  };
  const move = (e: PointerEvent) => {
    if (!down) {
      if (e.pointerType !== "mouse") return;
      const bounds = element.getBoundingClientRect();
      hover.x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 0.22;
      hover.y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 0.12;
      wake();
      return;
    }
    target += (e.clientX - pointerX) * 0.013;
    pointerX = e.clientX;
    wake();
  };
  const end = () => {
    down = false;
    element.style.cursor = decorative ? "default" : "grab";
    wake();
  };
  const leave = () => {
    hover.x = 0;
    hover.y = 0;
    wake();
  };
  const pose = (event: Event) => {
    const detail = (event as CustomEvent<{ turn: number; tilt: number }>)
      .detail;
    scrollPose.turn = detail.turn;
    scrollPose.tilt = detail.tilt;
    wake();
  };
  const contextLost = (e: Event) => {
    e.preventDefault();
    element.style.opacity = "0";
    element.parentElement?.classList.remove("is-3d");
  };
  const suspend = () => { suspended = true; cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
  const resume = () => {
    suspended = !!document.documentElement.dataset.transition || !!document.querySelector("dialog[open]");
    wake();
  };
  element.addEventListener("pointerdown", start);
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", end);
  element.addEventListener("pointercancel", end);
  element.addEventListener("pointerleave", leave);
  element.addEventListener("gk-object-pose", pose);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  reduced.addEventListener("change", wake);
  document.addEventListener("visibilitychange", wake);
  window.addEventListener("gk-motion", wake);
  window.addEventListener("gk-route-start", suspend);
  window.addEventListener("gk-menu-open", suspend);
  window.addEventListener("gk-route-end", resume);
  window.addEventListener("gk-menu-close", resume);
  const ready = renderer.compileAsync(scene, camera).then(() => {
    if (disposed) return;
    compiled = true;
    render();
    wake();
  });
  return {
    ready,
    rotate(amount: number) {
      target += amount;
      wake();
    },
    pause(value: boolean) {
      isPaused = value;
      wake();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      element.removeEventListener("pointerdown", start);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", end);
      element.removeEventListener("pointercancel", end);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("gk-object-pose", pose);
      reduced.removeEventListener("change", wake);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("gk-motion", wake);
      window.removeEventListener("gk-route-start", suspend);
      window.removeEventListener("gk-menu-open", suspend);
      window.removeEventListener("gk-route-end", resume);
      window.removeEventListener("gk-menu-close", resume);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((item) => {
        if (item instanceof THREE.Mesh) item.geometry.dispose();
      });
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
