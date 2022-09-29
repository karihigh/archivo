import "./style.css";
import data from "../json/combinedData.json";
import Isotope from "isotope-layout";
import InfiniteScroll from "infinite-scroll";
import LazyLoad from "vanilla-lazyload";

import labelsTable from "../json/labelsTable";
import labelsTableES from "../json/labelsTranslationTable";
import objectsTable from "../json/objectsTable";
import objectsTableES from "../json/objectsTranslationTable";

//console.log(data);
let cartelesLazyLoad = new LazyLoad();

window.lazyFunctions = {
  rearrange: function (element) {
    //iso.arrange();
  },
};

let dataLabels = new Set();
let dataObjects = new Set();
let dataWords = new Array();
let currentData;

let perpage = 10;
let pagenumber = 0;

let loadLock = false;

let $grid = document.querySelector(".grid");
let $overlay = document.querySelector(".loading");
let $loading = document.querySelector(".loading p");
let $labelFilters = document.querySelector(".filters--labels select");
let $objectFilters = document.querySelector(".filters--objects select");
let $wordFilters = document.querySelector(".filters--words input");
let COUNT = 0;

let brokenUrls = [];

let unescapeString = (str) => {
  return str.replace(/-/gi, " ").replace(/\+/gi, "&");
};

let escapeString = (str) => {
  return str.trim().replace(/ /gi, "-").replace(/&/gi, "+").toLowerCase();
};

// let loadImg = (url, wrapper, i) => {
//   return new Promise((resolve, reject) => {
//     let img = new Image();
//     img.addEventListener("load", (e) => {
//       $loading.textContent = `${++COUNT} of ${data.length} images loaded`;
//       resolve({ img: img, wrapper: wrapper });
//     });
//     img.addEventListener("error", (e) => {
//       brokenUrls.push(url);
//       reject(new Error(`Failed to load image's URL: ${url}`));
//     });
//     setTimeout(() => {
//       img.src = url;
//     }, i * 10);
//   });
// };

let loadImgEl = (url, wrapper, i) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute("class", "lazy img-cartel");
    img.setAttribute("data-src", url);
    img.setAttribute("data-lazy-function", "rearrange");
    resolve({ img: img, wrapper: wrapper });
  });
};

const initData = () => {
  //Iterate first all for the lists
  data.forEach((d, i) => {
    d.labels.forEach((a) => {
      dataLabels.add(a);
    });
    d.objects.forEach((a) => {
      dataObjects.add(a);
    });
    d.words.split(/[\n\r\s]/).forEach((a) => {
      dataWords.push(a);
    });
  });
  //console.log(dataLabels, dataObjects, dataWords);
};

const loadDom = (rangeStart, rangeEnd) => {
  let labels = new Set();
  let objects = new Set();
  let words = new Set();
  let imagePromises = [];

  // change range to load
  // let rangeStart = 0;
  // let rangeEnd = 100;

  //current data range
  let dataRange = data.slice(rangeStart, rangeEnd);
  //data.responses = data.responses.slice(0,1500);

  // ~~~~~~~~~~~~ GET DATA in Range ~~~~~~~~~~~~
  dataRange.forEach((d, i) => {
    let wrapper = document.createElement("div");
    let localLabels = [];
    let localObjects = [];
    let localWords = [];
    wrapper.classList.add("item");

    d.labels.forEach((a) => {
      labels.add(a);
      localLabels.push(a);
    });
    d.objects.forEach((a) => {
      objects.add(a);
      localObjects.push(a);
    });
    d.words.split(/[\n\r\s]/).forEach((a) => {
      words.add(a);
      localWords.push(a);
    });

    wrapper.setAttribute("data-labels", Array.from(localLabels).join(" "));
    wrapper.setAttribute("data-objects", Array.from(localObjects).join(" "));
    wrapper.setAttribute("data-words", Array.from(localWords).join(" "));

    let url = d.url;
    let imgp = loadImgEl(url, wrapper, i);
    imagePromises.push(imgp);
  });

  // // ~~~~~~~~~~~~ LOAD LABEL DROPDOWN ~~~~~~~~~~~~
  // let op = document.createElement("option");
  // op.value = "*";
  // op.textContent = "All";
  // $labelFilters.appendChild(op);

  // labels.forEach((f) => {
  //   let op = document.createElement("option");
  //   op.value = `${f}`;
  //   op.textContent = f;
  //   $labelFilters.appendChild(op);
  // });

  // // ~~~~~~~~~~~~ LOAD OBJECT DROPDOWN ~~~~~~~~~~~~
  // op = document.createElement("option");
  // op.value = "*";
  // op.textContent = "All";
  // $objectFilters.appendChild(op);

  // objects.forEach((f) => {
  //   let op = document.createElement("option");
  //   op.value = `${f}`;
  //   op.textContent = f;
  //   $objectFilters.appendChild(op);
  // });

  // ~~~~~~~~~~~~ LOAD ALL IMAGES AND INIT ISO ~~~~~~~~~~~~
  Promise.allSettled(imagePromises).then((results) => {
    let res = results.filter((r) => r.status === "fulfilled");

    res.forEach((r) => {
      r.value.wrapper.appendChild(r.value.img);
      $grid.appendChild(r.value.wrapper);
    });

    // let iso = new Isotope(".grid", {
    //   itemSelector: ".item",
    //   layoutMode: "masonry",
    // });

    // $labelFilters.addEventListener("change", function (e) {
    //   $objectFilters.options[0].selected = true;
    //   iso.arrange({
    //     filter: function (item) {
    //       return (
    //         $labelFilters.value === "*" ||
    //         item.dataset.dataLabels.includes($labelFilters.value)
    //       );
    //     },
    //   });
    // });

    // $objectFilters.addEventListener("change", function (e) {
    //   $labelFilters.options[0].selected = true;
    //   iso.arrange({
    //     filter: function (item) {
    //       return (
    //         $objectFilters.value === "*" ||
    //         item.dataset.dataObjects.includes($objectFilters.value)
    //       );
    //     },
    //   });
    // });

    // $wordFilters.addEventListener("input", function (e) {
    //   $labelFilters.options[0].selected = true;
    //   $objectFilters.options[0].selected = true;
    //   iso.arrange({
    //     filter: function (item) {
    //       let r = new RegExp($wordFilters.value, "gi");
    //       return r.test(item.dataset.words);
    //     },
    //   });
    // });

    document
      .querySelectorAll(".-hidden")
      .forEach((x) => x.classList.remove("-hidden"));
    //$overlay.classList.add("-hidden");
    cartelesLazyLoad.update();
    // iso.arrange({
    //   filter: "*",
    // });

    loadLock = false;
  });
};

//Scroll event listener
let tmpGrid = document.querySelector("body .grid");

document.addEventListener(
  "scroll",
  (event) => {
    // handle scroll event
    let y = window.scrollY + 580;
    let loadHeight = document.body.scrollHeight - 20;
    //console.log(y, loadHeight);
    if (loadLock == false && y >= loadHeight) {
      pagenumber++;
      loadLock = true;
      console.log("nextpage");
      console.log(pagenumber * perpage, pagenumber * perpage + perpage);
      loadDom(pagenumber * perpage, pagenumber * perpage + perpage);
    }
  },
  { passive: true }
);

initData();
console.log(Array.from(dataLabels), Array.from(dataObjects));

document.addEventListener("click", function (e) {
  //console.log(e.target.parentNode);
  let parent = e.target.parentNode;

  if (e.target && parent.className == "item") {
    //console.log("clickity");
    currentData = {
      labels: parent.getAttribute("data-labels"),
      objects: parent.getAttribute("data-objects"),
      words: parent.getAttribute("data-words"),
    };

    console.log(JSON.stringify(currentData));
  }
});

loadDom(0, perpage);
