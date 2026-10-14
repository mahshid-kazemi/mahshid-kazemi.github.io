import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export function initNetwork() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => innerWidth < 800;

  /* Original organisation network restored from 9026bf9. */
  try {
    const V = THREE.Vector3,
      BG = 0x0a0d12;
    const canvas = document.getElementById("bg");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.Fog(BG, 26, 62);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.7, 0.2);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const seed = (a) => () => {
      // mulberry32: same layout every load
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const rnd = seed(7);
    const unit = () => {
      let v;
      do v = new V(rnd(), rnd(), rnd()).multiplyScalar(2).subScalar(1);
      while (v.lengthSq() > 1 || v.lengthSq() < 0.01);
      return v.normalize();
    };

    const glow = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d"),
        r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      r.addColorStop(0, "#fff");
      r.addColorStop(0.25, "#fffa");
      r.addColorStop(1, "#fff0");
      g.fillStyle = r;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    const add = {
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    };

    // four skill areas = four teams, each a cluster of people around a hub
    const CL = [
      ["HR Strategy", "#6ea8ff"],
      ["Agile Management", "#4fd1c5"],
      ["People & Culture", "#ff9d7a"],
      ["Behavioral Science", "#f4c76a"],
    ].map(([name, hex], i) => ({
      name,
      color: new THREE.Color(hex),
      i,
      f: 0.9,
    }));
    const POOL = []; // edges pulses can travel: [a, b, cluster | -1]
    const core = new V(0, 0, 0);
    const labels = [];

    CL.forEach((c) => {
      const a = Math.PI / 4 + (c.i * Math.PI) / 2;
      c.center = new V(
        Math.sin(a) * 7.5,
        c.i % 2 ? 1.3 : -1.3,
        Math.cos(a) * 7.5,
      );
      const n = 58,
        P = [c.center.clone()];
      for (let k = 1; k < n; k++)
        P.push(
          unit()
            .multiplyScalar(3 * Math.pow(rnd(), 0.6))
            .multiply(new V(1, 0.8, 1))
            .add(c.center),
        );
      c.P = P;

      const mesh = new THREE.InstancedMesh(
        new THREE.SphereGeometry(1, 14, 14),
        new THREE.MeshBasicMaterial(),
        n,
      );
      const m = new THREE.Matrix4();
      P.forEach((p, k) => {
        m.compose(
          p,
          new THREE.Quaternion(),
          new V(1, 1, 1).multiplyScalar(k ? 0.06 + rnd() * 0.09 : 0.34),
        );
        mesh.setMatrixAt(k, m);
        mesh.setColorAt(
          k,
          c.color.clone().offsetHSL(0, 0, (rnd() - 0.5) * 0.18),
        );
      });
      c.nodes = mesh;

      const seg = [];
      P.forEach((p, k) => {
        if (!k) return;
        P.map((q, j) => [j, p.distanceToSquared(q)])
          .filter(([j]) => j !== k)
          .sort((x, y) => x[1] - y[1])
          .slice(0, 2)
          .forEach(([j]) => seg.push(p, P[j]));
        if (rnd() < 0.3) {
          seg.push(p, P[0]);
          POOL.push([P[0], p, c.i]);
        }
      });
      c.lines = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(seg),
        new THREE.LineBasicMaterial({ ...add, opacity: 0.42 }),
      );
      c.hub = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([core, c.center]),
        new THREE.LineBasicMaterial({ ...add, opacity: 0.7 }),
      );
      for (let r = 0; r < 4; r++) POOL.push([core, c.center, -1]);
      c.halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: c.color,
          ...add,
          opacity: 0.6,
        }),
      );
      c.halo.position.copy(c.center);
      c.halo.scale.setScalar(3.4);
      scene.add(mesh, c.lines, c.hub, c.halo);

      const el = document.createElement("div");
      el.className = "lbl";
      el.style.setProperty("--c", "#" + c.color.getHexString());
      el.innerHTML = `<span>${c.name}</span>`;
      document.getElementById("labels").append(el);
      labels.push({ el, at: c.center.clone().add(new V(0, 0.5, 0)), c: c.i });
    });

    // bridges between teams: the HR partner's real job
    const bridge = [];
    CL.forEach((c) => {
      const o = CL[(c.i + 1) % 4];
      for (let k = 0; k < 6; k++)
        bridge.push(c.P[1 + ((rnd() * 57) | 0)], o.P[1 + ((rnd() * 57) | 0)]);
    });
    scene.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(bridge),
        new THREE.LineBasicMaterial({ ...add, color: 0xcfd6ff, opacity: 0.1 }),
      ),
    );

    // the HRBP at the centre
    const centre = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff1e6 }),
    );
    const centreHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glow,
        color: 0xffb48f,
        ...add,
        opacity: 0.45,
      }),
    );
    centreHalo.scale.setScalar(5);
    const rings = [0, 1].map((i) => {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(1.15 + i * 0.45, 0.012, 8, 160),
        new THREE.MeshBasicMaterial({ color: 0xffd9c4, ...add, opacity: 0.55 }),
      );
      r.rotation.set(1.2 + i * 0.9, i * 0.7, 0);
      return r;
    });
    scene.add(centre, centreHalo, ...rings);
    labels.push({
      el: Object.assign(document.createElement("div"), {
        className: "lbl",
        innerHTML: "<span>HR Business Partner</span>",
      }),
      at: new V(0, 0.7, 0),
      c: -1,
    });
    labels.at(-1).el.style.setProperty("--c", "#ffb48f");
    document.getElementById("labels").append(labels.at(-1).el);

    // ambient dust for depth
    const dust = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 450 }, () =>
          unit().multiplyScalar(14 + rnd() * 30),
        ),
      ),
      new THREE.PointsMaterial({
        size: 0.09,
        color: 0x8d93a1,
        ...add,
        opacity: 0.55,
      }),
    );
    scene.add(dust);

    // pulses: messages travelling the network
    const NP = 40,
      pPos = new Float32Array(NP * 3),
      pCol = new Float32Array(NP * 3);
    const pulses = Array.from({ length: NP }, () => ({
      e: POOL[(rnd() * POOL.length) | 0],
      t: rnd(),
      s: 0.25 + rnd() * 0.35,
      d: rnd() < 0.5,
    }));
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage),
    );
    pGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(pCol, 3).setUsage(THREE.DynamicDrawUsage),
    );
    scene.add(
      new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({
          size: 0.55,
          map: glow,
          vertexColors: true,
          ...add,
        }),
      ),
    );

    /* ---------- scroll story ---------- */
    // d = distance, az/el = orbit angles, off = horizontal framing (+ pushes the network right, away from left-aligned text)
    const SEC = [
      { d: 33, az: 0, el: 0.32, off: 0.22, lbl: 1, sp: 1 }, // hero: whole organisation
      {
        d: 23,
        az: 2.3,
        el: 0.12,
        off: -0.27,
        lbl: 0,
        sp: 1.6,
        ctr: 1,
        dim: 0.85,
      }, // profile: the partner at the centre
      { d: 28, az: 3.7, el: 0.32, off: 0.27, lbl: 0, sp: 1.3, dim: 0.85 }, // experience
      { d: 24, az: 4.5, el: 0.22, off: -0.26, lbl: 0, sp: 1.2, dim: 0.85 }, // approach
      { d: 30, az: 0, el: 0.2, off: 0.22, lbl: 1, sp: 1, skills: 1 }, // skills: fly to each team
      { d: 34, az: 0, el: 0.32, off: 0, lbl: 0, sp: 1, dim: 0.25 }, // projects
      { d: 24, az: 5.1, el: 0.15, off: 0.22, lbl: 0, sp: 1 }, // education
      { d: 38, az: 6.9, el: 0.5, off: 0, lbl: 0, sp: 1.6, dim: 0.3 }, // contact
    ];
    const secs = [...document.querySelectorAll("main section")];
    const navA = [...document.querySelectorAll("nav ul a")];
    const rows = [...document.querySelectorAll(".skill")];
    let tops = [],
      hover = -1,
      lastFc = -2,
      lastIdx = -1;
    rows.forEach((r) => {
      r.style.setProperty("--c", "#" + CL[r.dataset.c].color.getHexString());
      const on = () => (hover = +r.dataset.c);
      r.addEventListener("pointerenter", on);
      r.addEventListener("focus", on);
      r.addEventListener("click", on);
      r.addEventListener("pointerleave", () => (hover = -1));
      r.addEventListener("blur", () => (hover = -1));
    });

    rows.forEach((r, i) =>
      r.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          rows[(i + (e.key === "ArrowDown" ? 1 : 3)) % 4].focus();
        }
      }),
    );

    const ptr = { x: 0, y: 0 };
    addEventListener("pointermove", (e) => {
      ptr.x = e.clientX / innerWidth - 0.5;
      ptr.y = e.clientY / innerHeight - 0.5;
    });
    function resize() {
      const w = innerWidth,
        h = innerHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      tops = secs.map((s) => s.offsetTop);
    }
    addEventListener("resize", resize);
    resize();
    document.fonts?.ready.then(resize);
    addEventListener("load", resize);
    const layoutObserver = new ResizeObserver(resize);
    secs.forEach((section) => layoutObserver.observe(section));

    const cam = {
      dim: 1,
      az: -1.4,
      el: 0.75,
      d: 70,
      ctr: 0,
      off: 0,
      f: new V(),
      lbl: 0,
    };
    const wrap = (a, ref) =>
      a + Math.round((ref - a) / (2 * Math.PI)) * 2 * Math.PI;
    const tmp = new V(),
      col = new THREE.Color(),
      clock = new THREE.Clock(),
      bar = document.getElementById("bar");

    const animate = () => {
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05),
        t = clock.elapsedTime,
        k = 1 - Math.exp(-dt * (t < 3 ? 1.3 : 2.6)),
        m = mobile();
      const mid = scrollY + innerHeight * 0.5;
      const idx = Math.max(
        0,
        tops.findIndex((_, i) => i === tops.length - 1 || mid < tops[i + 1]),
      );
      const S = SEC[idx];
      if (idx !== lastIdx) {
        navA.forEach((a) =>
          a.classList.toggle(
            "on",
            a.getAttribute("href") === "#" + secs[idx].id,
          ),
        );
        lastIdx = idx;
      }
      bar.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;

      // which team is in focus (skills: hover, otherwise auto-tour)
      const fc = S.skills
        ? hover >= 0
          ? hover
          : reduce
            ? 0
            : Math.floor(t / 4) % 4
        : -1;
      if (fc !== lastFc) {
        rows.forEach((r, i) => r.classList.toggle("on", i === fc));
        lastFc = fc;
      }

      // camera target
      const T = { d: S.d, az: S.az, el: S.el, f: core };
      if (fc >= 0) {
        const c = CL[fc].center;
        T.f = c;
        T.d = 10;
        T.az = Math.atan2(c.x, c.z) + 0.5;
        T.el = 0.2;
      }
      T.d *= m ? 1.3 : Math.max(1, 1.6 / camera.aspect);
      cam.az += (wrap(T.az, cam.az) - cam.az) * k;
      cam.el += (T.el - cam.el) * k;
      cam.d += (T.d - cam.d) * k;
      cam.f.lerp(T.f, k);
      cam.off += ((m ? 0 : S.off) - cam.off) * k;
      cam.lbl += (S.lbl - cam.lbl) * k;
      cam.ctr += ((S.ctr || 0) - cam.ctr) * k;
      cam.dim += ((S.dim || 1) - cam.dim) * k;

      const az = cam.az + (reduce ? 0 : t * 0.035) + ptr.x * 0.25,
        el = cam.el - ptr.y * 0.12;
      camera.position
        .set(
          Math.sin(az) * Math.cos(el),
          Math.sin(el),
          Math.cos(az) * Math.cos(el),
        )
        .multiplyScalar(cam.d)
        .add(cam.f);
      camera.lookAt(cam.f);
      camera.setViewOffset(
        innerWidth,
        innerHeight,
        -cam.off * innerWidth,
        0,
        innerWidth,
        innerHeight,
      );
      camera.updateMatrixWorld();

      // dim the teams that are not in focus
      const g = (m ? 0.38 : 1) * cam.dim;
      CL.forEach((c) => {
        c.f += ((fc < 0 ? 0.9 : c.i === fc ? 1.3 : 0.14) - c.f) * k;
        c.nodes.material.color.setScalar(c.f * g);
        c.lines.material.color.copy(c.color).multiplyScalar(c.f * g);
        c.hub.material.color.copy(c.color).multiplyScalar(c.f * g);
        c.halo.material.opacity = 0.5 * c.f * g;
      });
      centreHalo.material.opacity = 0.45 * g;
      centre.material.color.setScalar(g);
      rings.forEach((r, i) => {
        r.rotation.z += dt * (reduce ? 0 : 0.35 + i * 0.2);
        r.material.opacity = 0.55 * g;
      });

      // pulses
      pulses.forEach((p, i) => {
        p.t += dt * p.s * S.sp * (reduce ? 0 : 1);
        if (p.t >= 1) {
          p.t = 0;
          p.e = POOL[(rnd() * POOL.length) | 0];
          p.d = rnd() < 0.5;
        }
        const [a, b, ci] = p.e;
        tmp.lerpVectors(p.d ? a : b, p.d ? b : a, p.t).toArray(pPos, i * 3);
        (ci < 0
          ? col.set(0xffd9c4).multiplyScalar(g)
          : col.copy(CL[ci].color).multiplyScalar(1.4 * CL[ci].f * g)
        ).toArray(pCol, i * 3);
      });
      pGeo.attributes.position.needsUpdate =
        pGeo.attributes.color.needsUpdate = true;

      // HTML labels pinned to the 3D hubs
      labels.forEach(({ el, at, c }) => {
        tmp.copy(at).project(camera);
        const vis =
          tmp.z < 1
            ? c < 0
              ? cam.ctr
              : cam.lbl * (fc < 0 || c === fc ? 1 : 0.25)
            : 0;
        el.style.opacity = vis.toFixed(2);
        el.style.transform = `translate(${((tmp.x * 0.5 + 0.5) * innerWidth).toFixed(1)}px,${((-tmp.y * 0.5 + 0.5) * innerHeight).toFixed(1)}px)`;
      });

      composer.render();
      document.body.classList.add("ready");
    };
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotion() {
      renderer.setAnimationLoop(motion.matches ? null : animate);
    }
    motion.addEventListener("change", updateMotion);
    updateMotion();
  } catch (err) {
    console.warn("WebGL unavailable, showing static page.", err);
  }
}
