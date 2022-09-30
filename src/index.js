import "./style.css";
import data from "../json/combinedData.json";
import Isotope from "isotope-layout";
import InfiniteScroll from "infinite-scroll";
import LazyLoad from "vanilla-lazyload";

import labelsTable from "../json/labelsTable";
import labelsTableES from "../json/labelsTranslationTable";
import objectsTable from "../json/objectsTable";
import objectsTableES from "../json/objectsTranslationTable";
import translatedStringFromArray from "./translatedStringFromArray";

//React components
import RenderCartelModal from "./components/CartelModal";

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
window.currentData;

let perpage = 10;
let pagenumber = 0;

let loadLock = false;

const $grid = document.querySelector(".grid");
const $modal = document.querySelector("#react-modal-data");
const $overlay = document.querySelector(".loading");
const $loading = document.querySelector(".loading p");
const $labelFilters = document.querySelector(".filters--labels select");
const $objectFilters = document.querySelector(".filters--objects select");
const $wordFilters = document.querySelector(".filters--words input");
let COUNT = 0;

let brokenUrls = [];

const unescapeString = (str) => {
  return str.replace(/-/gi, " ").replace(/\+/gi, "&");
};

const escapeString = (str) => {
  return str.trim().replace(/ /gi, "-").replace(/&/gi, "+").toLowerCase();
};

const loadImgEl = (url, wrapper, i) => {
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

    wrapper.setAttribute("data-labels", Array.from(localLabels).join(", "));
    wrapper.setAttribute("data-objects", Array.from(localObjects).join(", "));
    wrapper.setAttribute("data-words", Array.from(localWords).join(", "));

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

    cartelesLazyLoad.update();

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
//console.log(Array.from(dataLabels), Array.from(dataObjects));

document.addEventListener("click", function (e) {
  //console.log(e.target.parentNode);
  let parent = e.target.parentNode;

  if (e.target && parent.className == "item") {
    //console.log("clickity");
    let currentLabels = parent.getAttribute("data-labels").split(", ");
    let currentLabels_es = currentLabels.map((label) => {
      return translatedStringFromArray(label, labelsTable, labelsTableES);
    });

    let currentObjects = parent.getAttribute("data-objects").split(", ");
    let currentObjects_es = currentObjects.map((object) => {
      return translatedStringFromArray(object, objectsTable, objectsTableES);
    });

    console.log(currentLabels_es, currentObjects_es);

    window.currentData = {
      image: e.target.getAttribute("src"),
      labels: currentLabels_es,
      objects: currentObjects_es,
      words: parent.getAttribute("data-words").split(", "),
    };

    RenderCartelModal(window.currentData);
    $modal.classList.remove("-hidden");
    console.log(JSON.stringify(currentData));
  }

  if (e.target && e.target.className == "closeModal") {
    window.currentData = {};
    RenderCartelModal(window.currentData);
    console.log("close");
  }
});

loadDom(0, perpage);
