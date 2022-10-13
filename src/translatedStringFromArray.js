//translation tool
const translatedStringFromArray = (
  string,
  referenceArray,
  translationArray
) => {
  //console.log(string);
  let translatedResult = "";
  referenceArray.map((searchstring, idx) => {
    if (searchstring == string) {
      //console.log(translationArray[idx], idx);
      translatedResult = translationArray[idx];
    }
  });
  return translatedResult;
};

export default translatedStringFromArray;
