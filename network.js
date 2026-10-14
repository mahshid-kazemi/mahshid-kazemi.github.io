export async function initNetwork() {
  if (
    !matchMedia("(min-width: 1025px)").matches ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  try {
    const THREE = await import("./vendor/three/build/three.module.js");
    const canvas = document.getElementById("bg");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 32);
    const colors = [0x6ea8ff, 0x4fd1c5, 0xff9d7a, 0xf4c76a];
    colors.forEach((color, i) => {
      const angle = Math.PI / 4 + (i * Math.PI) / 2;
      const centre = new THREE.Vector3(
        Math.cos(angle) * 6,
        Math.sin(angle) * 6,
        0,
      );
      const points = Array.from({ length: 22 }, (_, j) => {
        const a = j * 2.4;
        return new THREE.Vector3(
          centre.x + Math.cos(a) * Math.sqrt(j) * 0.5,
          centre.y + Math.sin(a) * Math.sqrt(j) * 0.5,
          Math.sin(j) * 1.5,
        );
      });
      const edges = [new THREE.Vector3(), centre];
      points.forEach((point, j) =>
        edges.push(point, points[(j + 1) % points.length]),
      );
      scene.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(edges),
          new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.28,
          }),
        ),
      );
      scene.add(
        new THREE.Points(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.PointsMaterial({ color, size: 0.09 }),
        ),
      );
    });
    function render() {
      if (
        !matchMedia("(min-width: 1025px)").matches ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        canvas.style.display = "none";
        return;
      }
      canvas.style.display = "";
      renderer.setSize(innerWidth * 0.5, innerHeight, false);
      camera.aspect = (innerWidth * 0.5) / innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      document.body.classList.add("ready");
    }
    render();
    addEventListener("resize", render, { passive: true });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
      "change",
      render,
    );
  } catch {
    /* The decorative layer is optional; content stays available. */
  }
}
