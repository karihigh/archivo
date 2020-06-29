console.log(data);
data.responses = data.responses.slice(0,200);
let $grid = document.querySelector('.grid');
let $loading = document.querySelector('.loading');
let $labelFilters = document.querySelector('.filters--labels select');
let $objectFilters = document.querySelector('.filters--objects select');
let $wordFilters = document.querySelector('.filters--words input');
let COUNT = 0;

let brokenUrls = [];

let unescapeString = (str) => {
  return str.replace(/-/gi, ' ').replace(/\+/gi, '&');
}

let escapeString = (str) => {
  return str.trim().replace(/ /gi, '-').replace(/&/gi, '+').toLowerCase();
}

let loadImg = (url, wrapper) => {
  return new Promise( (resolve, reject) => {
    let img = new Image();
    img.addEventListener('load', e => {
      $loading.textContent = `${++COUNT} of ${data.responses.length} images loaded`;
      resolve({img: img, wrapper: wrapper})
    });
    img.addEventListener('error', () => {
      console.log(`ERROR: ${url}`);
      brokenUrls.push(url);
      reject(new Error(`Failed to load image's URL: ${url}`));
    })
    img.src = url;
  })
}

let loadDom = () => {
  let labels = new Set();
  let objects = new Set();
  let words = new Set();
  let imagePromises = [];

  // ~~~~~~~~~~~~ GET DATA ~~~~~~~~~~~~
  data.responses.forEach( d => {
    let wrapper = document.createElement("div");
    let localLables = [];
    let localObjects = [];
    let localWords = [];
    wrapper.classList.add("item");

    d.labels.forEach( a => { labels.add(a); localLables.push(a); } );
    d.objects.forEach( a => { objects.add(a); localObjects.push(a); } );
    d.words.split(/[\n\r\s]/).forEach( a => { words.add(a); localWords.push(a); } );

    wrapper.setAttribute('data-labels', Array.from(localLables).join(' '));
    wrapper.setAttribute('data-objects', Array.from(localObjects).join(' '));
    wrapper.setAttribute('data-words', Array.from(localWords).join(' '));

    let url = d.url;
    let imgp = loadImg(url, wrapper);
    imagePromises.push(imgp);
  });



  // ~~~~~~~~~~~~ LOAD LABEL DROPDOWN ~~~~~~~~~~~~
  let op = document.createElement('option');
  op.value = '*';
  op.textContent = 'All';
  $labelFilters.appendChild(op);

  labels.forEach( f => {
    let op = document.createElement('option');
    op.value = `${f}`;
    op.textContent = f;
    $labelFilters.appendChild(op);
  })


  // ~~~~~~~~~~~~ LOAD OBJECT DROPDOWN ~~~~~~~~~~~~
  op = document.createElement('option');
  op.value = '*';
  op.textContent = 'All';
  $objectFilters.appendChild(op);

  objects.forEach( f => {
    let op = document.createElement('option');
    op.value = `${f}`;
    op.textContent = f;
    $objectFilters.appendChild(op);
  })



  // ~~~~~~~~~~~~ LOAD ALL IMAGES AND INIT ISO ~~~~~~~~~~~~
  Promise.all(imagePromises).then( (vals) => {
    vals.forEach( (val) => {
      val.wrapper.appendChild(val.img);
      $grid.appendChild(val.wrapper);
    })

    let iso = new Isotope( '.grid', {
      itemSelector: '.item',
      layoutMode: 'masonry'
    });

    $labelFilters.addEventListener( 'change', function(e) {
      $objectFilters.options[0].selected = true;
      iso.arrange({
        filter: function(item) {
          return $labelFilters.value === "*" || item.dataset.labels.includes($labelFilters.value);
        }
      });
    });

    $objectFilters.addEventListener( 'change', function(e) {
      $labelFilters.options[0].selected = true;
      iso.arrange({
        filter: function(item) {
          return $objectFilters.value === "*" || item.dataset.objects.includes($objectFilters.value);
        }
      });
    });

    $wordFilters.addEventListener( 'input', function(e) {
      $labelFilters.options[0].selected = true;
      $objectFilters.options[0].selected = true;
      iso.arrange({
        filter: function(item) {
          let r = new RegExp($wordFilters.value, "gi");
          return r.test(item.dataset.words);
        }
      });
    });


    document.querySelectorAll('.-hidden').forEach( x => x.classList.remove('-hidden') );
    $loading.classList.add('-hidden');
  })
}


loadDom();
