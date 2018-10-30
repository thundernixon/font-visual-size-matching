// ==========================================================
// ================ VARIABLES TO PLAY WITH ==================

// Change the list to see different Google Fonts families
const gFontFamilies = ["Noto Serif", "EB Garamond"];
// note: doesn't currently change most caption text

// these set the google fonts into the styles
document.body.style.setProperty("--fontA", gFontFamilies[0]);
document.body.style.setProperty("--fontB", gFontFamilies[1]);

// if you instead want to check against a system font, you can uncomment and use the code below
// document.body.style.setProperty("--fontA", "Times");
// document.body.style.setProperty("--fontB", "Arial");

// ================ VARIABLES TO PLAY WITH ==================
// ==========================================================

import FontMetrics from "fontmetrics";
var WebFont = require("webfontloader");

WebFont.load({
  google: {
    families: gFontFamilies
  }
});

function getMetrics(element) {
  const style = getComputedStyle(element);
  const fontFamily = style.fontFamily.split(",")[0];
  const fontSize = style.fontSize;
  const metrics = FontMetrics({
    fontFamily: fontFamily
  });
  return metrics;
}

function xHeightFactor(elementA, elementB) {
  const xHeightDiff =
    getMetrics(elementA).xHeight / getMetrics(elementB).xHeight;
  return xHeightDiff;
}

function calcVisualSize(element) {
  const metrics = getMetrics(element);
  const visualSize = -(
    (metrics.capHeight + metrics.xHeight + metrics.ascent) /
    3
  );
  return visualSize;
}

function vizMatchFactor(elementA, elementB) {
  const vizHeightDiff = calcVisualSize(elementA) / calcVisualSize(elementB);
  return vizHeightDiff;
}

function calcAltVisualSize(element) {
  const metrics = getMetrics(element);
  const visualSize = -(
    (metrics.capHeight + metrics.xHeight + metrics.ascent + metrics.descent) /
    4
  );
  return visualSize;
}

function altVizMatchFactor(elementA, elementB) {
  const vizHeightDiff =
    calcAltVisualSize(elementA) / calcAltVisualSize(elementB);
  return vizHeightDiff;
}

function makeCaption(fontFamily, fontSize) {
  const caption =
    fontFamily.replace('"', "").replace('"', "") + ", " + fontSize;
  return caption;
}

function newFontSize(elementA, elementB, caption, matchType = "x") {
  let fontBfontSize = getComputedStyle(elementB).fontSize.replace("px", "");

  let fontBsize = parseFloat(fontBfontSize);

  if (matchType === "x") {
    var fontBmatchXsize = fontBsize * xHeightFactor(elementA, elementB);
    var newLineHeight = 1 / xHeightFactor(elementA, elementB);
  } else if (matchType === "visual") {
    var fontBmatchXsize = fontBsize * vizMatchFactor(elementA, elementB);
    var newLineHeight = 1 / vizMatchFactor(elementA, elementB);
  } else if (matchType === "altVisual") {
    var fontBmatchXsize = fontBsize * altVizMatchFactor(elementA, elementB);
    var newLineHeight = 1 / altVizMatchFactor(elementA, elementB);
  }

  let fontBnewStyle = fontBmatchXsize.toString() + "px";

  caption.innerHTML = makeCaption(
    getMetrics(elementB).fontFamily,
    fontBmatchXsize
  );
  // getMetrics(elementB)
  //   .fontFamily.replace('"', "")
  //   .replace('"', "") +
  // ", " +
  // parseFloat(fontBnewStyle).toFixed(2) +
  // "px";

  return fontBnewStyle;
}

// =============
// xHeight Match
// =============

const xMatchFontA = document.querySelector("#x-match .fontA p");
const xMatchFontB = document.querySelector("#x-match .fontB p");
const xMatchFontBcaption = document.querySelector("#x-match .fontB figcaption");

xMatchFontB.style.fontSize = newFontSize(
  xMatchFontA,
  xMatchFontB,
  xMatchFontBcaption
);

console.log(getMetrics(xMatchFontA).fontSize + "px");
xMatchFontB.style.lineHeight = getComputedStyle(xMatchFontA).fontSize;

// =============
// Visual Match
// =============

const vizMatchFontA = document.querySelector("#visual-match .fontA p");
const vizMatchFontB = document.querySelector("#visual-match .fontB p");
const vizMatchFontBcaption = document.querySelector(
  "#visual-match .fontB figcaption"
);

vizMatchFontB.style.fontSize = newFontSize(
  vizMatchFontA,
  vizMatchFontB,
  vizMatchFontBcaption,
  "visual"
);
vizMatchFontB.style.lineHeight = getComputedStyle(vizMatchFontA).fontSize;

// ================
// Alt Visual Match
// ================

const altVizMatchFontA = document.querySelector("#alt-visual-match .fontA p");
const altVizMatchFontB = document.querySelector("#alt-visual-match .fontB p");
const altVizMatchFontBcaption = document.querySelector(
  "#alt-visual-match .fontB figcaption"
);

altVizMatchFontB.style.fontSize = newFontSize(
  altVizMatchFontA,
  altVizMatchFontB,
  altVizMatchFontBcaption,
  "altVisual"
);
altVizMatchFontB.style.lineHeight = getComputedStyle(altVizMatchFontA).fontSize;

// set captions

const figures = document.querySelectorAll("fig");

for (var i in figures) {
  if (typeof figures[i] == "object") {
    console.log(figures[i].childNodes);
    const metrics = getMetrics(figures[i].childNodes[1]);
    console.log(metrics);

    const fontSize = getComputedStyle(figures[i].childNodes[1]).fontSize;
    // set caption
    figures[i].childNodes[3].innerHTML = makeCaption(
      metrics.fontFamily,
      fontSize
    );
  }
  // const example = figures[i].querySelector("p");
  // console.log(example)
}
