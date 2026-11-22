const vehicleViewer = (() => {
  // Length, half-width, sill, hood, roof, wheel radius, cabin start and end.
  const shapes = {
    sedan: [4.5, .91, .25, .86, 1.35, .34, -.96, .83],
    hatch: [4.03, .86, .25, .88, 1.43, .33, -1.51, .67],
    suv: [4.58, .99, .35, 1.06, 1.73, .41, -1.88, .79],
    offroad: [3.8, .88, .38, 1.01, 1.75, .40, -1.73, .75],
    van: [5.08, .99, .27, .96, 1.74, .35, -2.26, .99],
    convertible: [3.94, .89, .21, .71, 1.12, .33, -.73, .55],
    electric: [4.7, .94, .24, .77, 1.35, .35, -1.23, 1.08]
  };
  // Profiles follow the catalog's illustration IDs.
  const profiles = [
    ["sedan", "#9ca7b0", .95], ["sedan", "#327bce", .98], ["suv", "#526d58", .94],
    ["suv", "#eaebed", 1], ["electric", "#bf3843", 1], ["hatch", "#286ba9", 1],
    ["offroad", "#ddd1a6", .97], ["sedan", "#525b64", 1.05], ["suv", "#ecc136", .91],
    ["hatch", "#38664d", .94], ["convertible", "#962f45", 1], ["suv", "#63744b", 1.02],
    ["offroad", "#c5ac7d", .93], ["van", "#858e9c", 1], ["suv", "#3b547b", 1.04]
  ];

  function makeModel(id) {
    const [shape, paint, stretch] = profiles[id - 1];
    const [length, width, sill, hood, roof, tire, rearGlass, frontGlass] = shapes[shape];
    const half = length * stretch / 2;
    const polygons = [];
    const face = (points, color, shade = 1) => polygons.push({points, color, shade});
    function shell(sections, colors, shades) {
      for (let slice = 1; slice < sections.length; slice++) {
        const a = sections[slice - 1], b = sections[slice];
        for (let j = 0; j < a.length; j++) {
          const next = (j + 1) % a.length;
          face([a[j], a[next], b[next], b[j]], colors[j], shades[j]);
        }
      }
      face(sections[0], colors[0], .64);
      face(sections.at(-1), colors[0], .85);
    }
    const body = [
      [-half, .87, hood - .14], [-half + .18, .98, hood - .02],
      [-half + .48, 1, hood + .01], [0, 1, hood - .04],
      [half - .50, 1, hood], [half - .17, .95, hood - .13],
      [half, .83, hood - .25]
    ].map(([x, w, top]) => [
      [x, sill, -width*w*.91], [x, top-.18, -width*w],
      [x, top, -width*w*.83], [x, top+.045, 0],
      [x, top, width*w*.83], [x, top-.18, width*w], [x, sill, width*w*.91]
    ]);
    shell(body, Array(7).fill(paint), [.70, .88, 1.12, 1.03, .95, .78, .45]);

    const glass = "#324a5d";
    const cabinBase = hood - .03;
    const cabin = [
      [rearGlass, cabinBase+.015, .82], [rearGlass+.33, roof-.03, .68],
      [frontGlass-.48, roof, .66], [frontGlass, cabinBase+.015, .83]
    ].map(([x, y, w]) => [
      [x, cabinBase, -width*.85], [x, y, -width*w], [x, y+.055, 0],
      [x, y, width*w], [x, cabinBase, width*.85]
    ]);
    shell(cabin, [glass, paint, paint, glass, "#171f25"], [.90, 1.12, 1.03, 1, .7]);
    for (const end of [0, 3]) face(cabin[end], glass, end ? 1.12 : .83);

    for (const side of [-1, 1]) {
      const x = (rearGlass + frontGlass) / 2;
      const z = side * width;
      face([[x, cabinBase, z*.855], [x, roof, z*.67], [x+.07, roof, z*.67],
        [x+.07, cabinBase, z*.855]], "#20282c", .9);
      for (const axle of [-.65, .65]) {
        const wheelX = half * axle;
        const circle = (r, edge) => Array.from({length: 20}, (_, i) => {
          const angle = i * Math.PI / 10;
          return [wheelX + r*Math.cos(angle), tire + r*Math.sin(angle), edge];
        });
        const inner = circle(tire, z*.75), outer = circle(tire, z*1.035);
        face(inner, "#181b20");
        face(outer, "#171a20");
        for (let i = 0; i < outer.length; i++) {
          const j = (i+1) % outer.length;
          face([outer[i], outer[j], inner[j], inner[i]], "#292d33", .7 + i/50);
        }
        face(circle(tire*.69, z*1.046), "#9da6b1");
        face(circle(tire*.51, z*1.052), "#454e58");
        face(circle(tire*.21, z*1.061), "#cbd3dc");
      }
      for (const end of [-1, 1]) {
        const xLight = end * (half+.009);
        const y = end === 1 ? hood-.39 : hood-.30;
        face([[xLight,y,z*.39],[xLight,y,z*.68],[xLight,y+.10,z*.73],[xLight,y+.09,z*.39]],
          end === 1 ? "#e5f4ff" : "#dc3941", 1.12);
      }
    }
    face([[half+.015,sill+.05,-width*.48],[half+.015,sill+.05,width*.48],
      [half+.015,hood-.41,width*.55],[half+.015,hood-.41,-width*.55]], "#272a2e");
    return polygons;
  }

  function draw(canvas, context, polygons, angle, tilt, zoom) {
    const width = canvas.clientWidth || 560, height = canvas.clientHeight || 320;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const scale = Math.min(width / 5.7, height / 3.4) * zoom;
    const cx = width/2, cy = height*.53;
    context.fillStyle = "#17191d";
    context.fillRect(0,0,width,height);
    context.save();
    context.translate(cx, cy+scale*.70);
    context.scale(1, .27);
    const shadow = context.createRadialGradient(0,0,0,0,0,scale*2.4);
    shadow.addColorStop(0, "#000b");
    shadow.addColorStop(1, "#0000");
    context.fillStyle = shadow;
    context.fillRect(-scale*2.4,-scale*2.4,scale*4.8,scale*4.8);
    context.restore();

    const cos = Math.cos(angle), sin = Math.sin(angle);
    const cosTilt = Math.cos(tilt), sinTilt = Math.sin(tilt);
    const visible = polygons.map(({points,color,shade}) => {
      const corners = points.map(([x, y, z]) => {
        const horizontal = x*cos - z*sin;
        const depth = x*sin + z*cos;
        const elevated = y - .72;
        const vertical = elevated*cosTilt - depth*sinTilt;
        const cameraDepth = depth*cosTilt + elevated*sinTilt;
        const perspective = 9 / (9-cameraDepth);
        return [cx + horizontal*scale*perspective, cy - vertical*scale*perspective, cameraDepth];
      });
      return {corners, color, shade, depth: corners.reduce((sum,point) => sum+point[2],0)/corners.length};
    }).sort((a,b) => a.depth-b.depth);
    for (const {corners,color,shade} of visible) {
      context.beginPath();
      for (const [i, [x,y]] of corners.entries()) {
        if (i === 0) context.moveTo(x,y);
        else context.lineTo(x,y);
      }
      context.closePath();
      const base = Number.parseInt(color.slice(1),16);
      const tint = shift => Math.min(255, Math.round(((base >> shift) & 255)*shade));
      context.fillStyle = `rgb(${tint(16)},${tint(8)},${tint(0)})`;
      context.fill();
      context.strokeStyle = context.fillStyle;
      context.lineWidth = .65;
      context.stroke();
    }
  }

// Запасной режим рисует упрощённый кузов на canvas.
  function openSchematic(button) {
    const image = Number(button.dataset.view3d);
    const name = button.closest(".result").querySelector("h2").textContent;
    const modal = document.createElement("dialog");
    modal.className = "vehicle-dialog";
    modal.setAttribute("aria-labelledby", "vehicle-dialog-title");
    modal.innerHTML = `<div class="vehicle-dialog-head"><h2 id="vehicle-dialog-title"></h2>
      <form method="dialog"><button autofocus type="submit">Закрыть</button></form></div>
      <canvas tabindex="0" aria-label="3D-просмотр. Стрелки вращают машину, плюс и минус меняют масштаб"></canvas>
      <p class="viewer-help">Потяни мышью или пальцем, чтобы повернуть машину. Схематичная 3D‑модель кузова.</p>
      <div class="viewer-controls" aria-label="Управление 3D-моделью">
      <button type="button" data-view-action="left">Повернуть влево</button><button type="button" data-view-action="right">Повернуть вправо</button>
      <button type="button" data-view-action="in" aria-label="Приблизить">+</button><button type="button" data-view-action="out" aria-label="Отдалить">−</button>
      <button type="button" data-view-action="reset">Сбросить вид</button></div>`;
    modal.querySelector("h2").textContent = name;
    document.body.append(modal);
    modal.showModal();
    const canvas = modal.querySelector("canvas");
    const context = canvas.getContext("2d");
    let observer;
    modal.addEventListener("close", () => {
      observer?.disconnect();
      modal.remove();
      button.focus();
    }, {once:true});
    if (!context) {
      canvas.hidden = true;
      modal.querySelector(".viewer-controls").hidden = true;
      modal.querySelector(".viewer-help").textContent = "3D-просмотр недоступен в этом браузере.";
      return;
    }
    const polygons = makeModel(image);
    let angle = .66, tilt = .36, zoom = 1;
    let pointer = null;
    const render = () => draw(canvas, context, polygons, angle, tilt, zoom);
    const adjust = action => {
      switch (action) {
        case "left": angle -= .25; break;
        case "right": angle += .25; break;
        case "up": tilt = Math.min(1.26, tilt+.12); break;
        case "down": tilt = Math.max(-.13, tilt-.12); break;
        case "in": zoom = Math.min(1.5, zoom+.12); break;
        case "out": zoom = Math.max(.55, zoom-.12); break;
        case "reset": angle = .66; tilt = .36; zoom = 1; break;
      }
      render();
    };
    modal.querySelectorAll("[data-view-action]").forEach(control => {
      control.onclick = () => adjust(control.dataset.viewAction);
    });
    canvas.addEventListener("keydown", event => {
      const action = {ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down","+":"in","=":"in","-":"out"}[event.key];
      if (!action) return;
      event.preventDefault();
      adjust(action);
    });
    canvas.addEventListener("pointerdown", event => {
      if (pointer || event.button !== 0) return;
      pointer = {id:event.pointerId, x:event.clientX, y:event.clientY};
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", event => {
      if (event.pointerId !== pointer?.id) return;
      angle += (event.clientX-pointer.x)*.014;
      tilt = Math.max(-.13, Math.min(1.26, tilt+(event.clientY-pointer.y)*.009));
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      render();
    });
    canvas.addEventListener("lostpointercapture", () => {pointer = null;});
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(render);
      observer.observe(canvas);
    }
    render();
  }
  // The hosted models use Sketchfab's public embed player, with author credits.
  const modelSources = [
    ["4b233560eabd4f4da05613a995cdedea", "VIAdvena", ""],
    ["aa89b6a2893441e499d7851c91253910", "mrpekala", ""],
    ["a253d913f99d4611860e8dd955c476d7", "ANDREO12", "Год и комплектация могут отличаться."],
    ["5b9d1be9dd934276869c2bc969115c7c", "Duc Ha", "Год и комплектация могут отличаться."],
    ["5ef9b845aaf44203b6d04e2c677e444f", "Ameer Studio", "Кузов 2018 года.", "models/tesla-model-3.glb"],
    ["42c3b5c432534d008873feba09d354d4", "centaurus21", "Кузов 2022 года."],
    ["f6f344ba44464afcaecd6e73ac59f50b", "marcteuber", "Ранняя версия семейства ВАЗ‑2121."],
    ["c10b108996d94ebd8498c16a0bda7c6b", "Vahe Simonyan", "Год и комплектация могут отличаться."],
    ["a29232f2dcba4424a8d62e5bf1474bc1", "slowpoly", "Кузов 2023 года."],
    ["bec89391257c426d824a8b0434bbcf6b", "Ddiaz Design", "Показана версия Cooper S поколения F56."],
    ["4abed89f152b4196b96b6fd1a2ec771e", "Ddiaz Design", "Показана тюнингованная версия поколения ND."],
    ["611ae23685c14134b5a4f3decde248e9", "tonielpro520", ""],
    ["74150556ab57405a8f9064bbb5b6fb9a", "NETRUNNER_pl", "Год и комплектация могут отличаться."],
    ["65a2899d406c40f1be9f270ca15484ca", "SQUIR3D", ""],
    ["e58605ccf0ef4592aff37141a1ad8b65", "Nieve5677", "Показана версия Outlander GT."]
  ];

// Открываем 3D-просмотр для модели из нажатой карточки результата.
  function open(button) {
    const name = button.closest(".result").querySelector("h2").textContent;
    // Номера изображений в карточках начинаются с 1, индексы массива источников 3D — с 0.
    const [id, author, versionNote, local] = modelSources[Number(button.dataset.view3d) - 1];
    const page = `https://sketchfab.com/models/${id}`;
    const modal = document.createElement("dialog");
    // Сигнал связывает загрузку локальной модели со временем жизни окна просмотра.
    const lifetime = new AbortController();
    modal.className = "vehicle-dialog";
    modal.setAttribute("aria-labelledby", "vehicle-dialog-title");
    modal.innerHTML = `<div class="vehicle-dialog-head"><h2 id="vehicle-dialog-title"></h2>
      <form method="dialog"><button autofocus type="submit">Закрыть</button></form></div>
      <div class="model-host" aria-label="Просмотр 3D-модели"></div>
      <p class="viewer-help">${versionNote} Автор модели — <a href="${page}" target="_blank" rel="noopener noreferrer">${author} · Sketchfab</a>.${local ? ' <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>. Файл оптимизирован проектом Auto Atlas.' : ""}</p>
      <div class="viewer-controls" hidden>
        <button type="button" data-view-action="left">Повернуть влево</button>
        <button type="button" data-view-action="right">Повернуть вправо</button>
        <button type="button" data-view-action="in" aria-label="Приблизить">+</button>
        <button type="button" data-view-action="out" aria-label="Отдалить">−</button>
        <button type="button" data-view-action="reset">Сбросить вид</button></div>
      <button type="button" class="viewer-fallback">Открыть упрощённую модель</button>`;
    modal.querySelector("h2").textContent = name;
    modal.addEventListener("close", () => {
      lifetime.abort();
      modal.remove();
      if (!document.querySelector(".vehicle-dialog")) button.focus();
    }, {once:true});
    modal.querySelector(".viewer-fallback").onclick = () => {
      modal.close();
      openSchematic(button);
    };
    document.body.append(modal);
    modal.showModal();
    const host = modal.querySelector(".model-host");

    function showEmbed() {
      if (lifetime.signal.aborted) return;
      const frame = document.createElement("iframe");
      frame.title = `3D-модель ${name} — Sketchfab`;
      frame.allow = "fullscreen";
      frame.allowFullscreen = true;
      frame.src = `https://sketchfab.com/models/${id}/embed?autostart=1&ui_infos=0`;
      host.replaceChildren(frame);
    }
    if (!local) {
      showEmbed();
      return;
    }
    host.textContent = "Загрузка 3D-модели…";
    import("./viewer-engine.bundle.js")
      .then(engine => engine.mountCar(host, local, lifetime.signal))
      .then(adjust => {
        if (!adjust || lifetime.signal.aborted) return;
        const controls = modal.querySelector(".viewer-controls");
        controls.hidden = false;
        controls.querySelectorAll("[data-view-action]").forEach(control => {
          control.onclick = () => adjust(control.dataset.viewAction);
        });
        host.querySelector("canvas").addEventListener("keydown", event => {
          const action = {ArrowLeft:"left",ArrowRight:"right","+":"in","=":"in","-":"out"}[event.key];
          if (!action) return;
          event.preventDefault();
          adjust(action);
        });
      }).catch(showEmbed);
  }

  return {open};
})();
