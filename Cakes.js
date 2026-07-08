/* Sweet Haven Bakery — floating cake game
   Hover a cake to pop it. Pop 200 cakes across the site to
   reveal a hidden reward.
*/
(function () {
  "use strict";

  var TARGET = 200;
  var MAX_ON_SCREEN = 22;
  var EMOJIS = ["🎂", "🧁", "🍰", "🍪", "🍩"];
  var STORAGE_KEY = "sh_cakes_popped";
  var FLAG = "ctf{h1dd3n_3ndp01nt_f0und}";

  var popped = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  if (isNaN(popped) || popped < 0) popped = 0;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    buildHud();
    buildLayer();
    buildModal();
    updateHud();

    if (popped >= TARGET) {
      // Already unlocked in a previous session — no need to replay the grind.
      showFlag(false);
    }

    for (var i = 0; i < MAX_ON_SCREEN; i++) {
      spawnCake(true);
    }
  }

  function buildHud() {
    var hud = document.createElement("div");
    hud.id = "cake-hud";
    hud.innerHTML =
      '🎂 <span class="hud-count">0</span> / ' + TARGET + " popped";
    document.body.appendChild(hud);
  }

  function buildLayer() {
    var layer = document.createElement("div");
    layer.id = "cake-layer";
    document.body.appendChild(layer);
  }

  function buildModal() {
    var modal = document.createElement("div");
    modal.id = "flag-modal";
    modal.innerHTML =
      '<div class="flag-box">' +
      "<h2>200 cakes popped! 🎉</h2>" +
      "<p>You cleared every tray in the bakery. Here's your reward:</p>" +
      '<code class="flag-code">' + FLAG + "</code>" +
      '<button type="button" id="flag-close">Nice!</button>' +
      "</div></div>";
    document.body.appendChild(modal);
    document
      .getElementById("flag-close")
      .addEventListener("click", function () {
        modal.classList.remove("open");
      });
  }

  function updateHud() {
    var el = document.querySelector("#cake-hud .hud-count");
    if (el) el.textContent = String(Math.min(popped, TARGET));
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnCake(initial) {
    var layer = document.getElementById("cake-layer");
    if (!layer) return;

    var cake = document.createElement("div");
    cake.className = "floating-cake";
    cake.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    var size = rand(22, 44);
    var left = rand(2, 96);
    var top = rand(4, 90);
    var duration = rand(5, 11);
    var delay = initial ? rand(0, 6) : 0;

    cake.style.left = left + "vw";
    cake.style.top = top + "vh";
    cake.style.fontSize = size + "px";
    cake.style.animationDuration = duration + "s";
    cake.style.animationDelay = "-" + delay + "s";

    cake.addEventListener("mouseenter", function onEnter() {
      popCake(cake);
    });

    layer.appendChild(cake);
  }

  function popCake(cake) {
    if (cake.classList.contains("popping")) return;
    cake.classList.add("popping");

    if (popped < TARGET) {
      popped += 1;
      localStorage.setItem(STORAGE_KEY, String(popped));
      updateHud();
      if (popped >= TARGET) {
        showFlag(true);
      }
    }

    setTimeout(function () {
      if (cake.parentNode) cake.parentNode.removeChild(cake);
      spawnCake(false);
    }, 380);
  }

  function showFlag(celebrate) {
    var modal = document.getElementById("flag-modal");
    if (!modal) return;
    modal.classList.add("open");
  }
})();