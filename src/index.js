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
import logo from "./img/c80_logo_blanco.svg";
import html from "./index.html";

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
let filteredData = new Array();

let perpage = 20;
let pagenumber = 0;

let loadLock = false;

const c80Logo = new Image();
c80Logo.src = logo;

const $grid = document.querySelector(".grid");
const $header = document.getElementById("site-header");
const $headerPresentation = document.querySelector(".description-header");
const headerHeight = $header.offsetHeight;
//console.log($header.offsetHeight);
const $modal = document.querySelector("#react-modal-data");
const $overlay = document.querySelector(".loading");
const $loading = document.querySelector(".loading p");
// const $labelFilters = document.querySelector(".filters--labels select");
// const $objectFilters = document.querySelector(".filters--objects select");
// const $wordFilters = document.querySelector(".filters--words input");
const $etiquetasPlace = document.getElementById("etiquetas-select");
const $objectsPlace = document.getElementById("objetos-select");
const $titlePlace = document.getElementById("resultados-titulo");
const $searchForm = document.getElementById("search-words-form");
const $searchInput = document.getElementById("search-words");
const $etiquetasSelect = document.querySelector("#etiquetas-select");
const $objectsSelect = document.querySelector("#objetos-select");
console.log($titlePlace);

$headerPresentation.prepend(c80Logo);

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
  initFilters();
};

const initFilters = () => {
  Array.from(labelsTable).map((label, idx) => {
    let translated = translatedStringFromArray(
      label,
      labelsTable,
      labelsTableES
    );
    //$etiquetasPlace.innerHTML += `<span class="filter-label" data-label="${label}">${translated}</span>`;
    $etiquetasPlace.innerHTML += `<option value="${label}">${translated}</option>`;
  });

  Array.from(objectsTable).map((object, idx) => {
    let translated = translatedStringFromArray(
      object,
      objectsTable,
      objectsTableES
    );
    //$objectsPlace.innerHTML += `<span class="filter-object" data-object="${object}">${translated}</span>`;
    $objectsPlace.innerHTML += `<option value="${object}">${translated}</option>`;
  });
};

const filterSign = (filterItem, filter, translatedItem) => {
  filteredData = [];
  //console.log(label);
  data.map((item, idx) => {
    if (item[filter].indexOf(filterItem) != -1) {
      //console.log(label);
      filteredData.push(item);
    }
  });
  $grid.innerHTML = "";
  let filterLabel = filter == "labels" ? "Etiquetas" : "Objetos";
  $searchInput.value = "";
  resultsTitle(`${filteredData.length} ${filterLabel} : ${translatedItem}`);
  loadDom(filteredData);
};

const filterWord = (word) => {
  filteredData = [];
  data.map((item, idx) => {
    let wordRef = item.words.toLowerCase();
    let searchWord = word.toLowerCase();
    if (wordRef.match(searchWord)) {
      filteredData.push(item);
    }
  });
  $grid.innerHTML = "";
  $objectsSelect.selectedIndex = 0;
  $etiquetasSelect.selectedIndex = 0;
  resultsTitle(`${filteredData.length}: ${word}`);
  loadDom(filteredData);
};

const resultsTitle = (title) => {
  $titlePlace.innerHTML = `<h2>${title}</h2>`;
};

const loadDom = (data) => {
  let labels = new Set();
  let objects = new Set();
  let words = new Set();
  let imagePromises = [];

  // change range to load
  // let rangeStart = 0;
  // let rangeEnd = 100;

  //current data range
  //let dataRange = data;
  //data.responses = data.responses.slice(0,1500);

  // ~~~~~~~~~~~~ GET DATA in Range ~~~~~~~~~~~~
  data.forEach((d, i) => {
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
const $wrapper = document.querySelector(".wrapper-carteles");

window.addEventListener(
  "scroll",
  (event) => {
    // handle scroll event
    let y = window.scrollY + 780;
    let loadHeight = $grid.offsetHeight;
    let loadTrigger = $wrapper.scrollTop + $wrapper.offsetHeight;
    console.log(loadHeight, loadTrigger, loadLock);

    //console.log(loadLock == false, y, loadHeight);

    if (loadLock == false && loadTrigger >= loadHeight) {
      pagenumber++;
      loadLock = true;
      console.log("nextpage");
      console.log(pagenumber * perpage, pagenumber * perpage + perpage);

      if (filteredData.length > 0) {
        loadDom(
          filteredData.slice(
            pagenumber * perpage,
            pagenumber * perpage + perpage
          )
        );
      } else {
        loadDom(
          data.slice(pagenumber * perpage, pagenumber * perpage + perpage)
        );
      }
    }
  },
  { passive: true }
);

initData();

//searcher

$searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log($searchInput.value);
  filterWord($searchInput.value);
});

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
    //console.log(JSON.stringify(currentData));
  }

  if (e.target && e.target.id == "closeModal") {
    window.currentData = {};
    RenderCartelModal(window.currentData);
    console.log("close");
  }

  if (e.target && e.target.className == "filter-label") {
    let filterData = e.target.getAttribute("data-label");
    //console.log(filterData);
    filterSign(filterData, "labels");
    console.log(filteredData);
  }

  if (e.target && e.target.className == "filter-object") {
    let filterData = e.target.getAttribute("data-object");
    //console.log(filterData);
    filterSign(filterData, "objects");
    console.log(filteredData);
  }
});

//Select event listeners

$etiquetasSelect.addEventListener("change", function (e) {
  let translatedItem =
    $etiquetasSelect.options[$etiquetasSelect.selectedIndex].text;
  filterSign(e.target.value, "labels", translatedItem);
  $objectsSelect.selectedIndex = 0;
});

$objectsSelect.addEventListener("change", function (e) {
  let translatedItem =
    $objectsSelect.options[$objectsSelect.selectedIndex].text;
  filterSign(e.target.value, "objects", translatedItem);
  $etiquetasSelect.selectedIndex = 0;
});

loadDom(data.slice(0, perpage));
