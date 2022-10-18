import labelsTable from "../json/labelsTable.js";
import labelsTableES from "../json/labelsTranslationTable.js";
import objectsTable from "../json/objectsTable.js";
import objectsTableES from "../json/objectsTranslationTable";
import data from "../json/combinedData_inst.json";

const path = require("path");
const fs = require("fs");

//iterar por todos los labels
console.log(data);

//contar las ocurrencias de cada label en el archivo de datos

//crear un nuevo objeto de labels con:
// 1. el texto de la label
// 2. la cantidad de ocurrencias
// 3. el texto en español de la label
// 4. guardarlo en un nuevo json
