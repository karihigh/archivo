console.log(data);
let $grid = document.querySelector('.grid');
let $loading = document.querySelector('.loading');
let $labelFilters = document.querySelector('.filters--labels select');
let $objectFilters = document.querySelector('.filters--objects select');
let COUNT = 0;

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
      reject(new Error(`Failed to load image's URL: ${url}`));
    })
    img.src = url;
  })
}

let loadDom = () => {
  let labels = new Set();
  let objects = new Set();
  let imagePromises = [];

  // ~~~~~~~~~~~~ GET DATA ~~~~~~~~~~~~
  data.responses.forEach( d => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("item");

    d.labelAnnotations.forEach( a => {
      labels.add(a.description);
      wrapper.classList.add(escapeString(a.description));
    })

    d.localizedObjectAnnotations.forEach( a => {
      objects.add(a.name);
      wrapper.classList.add(escapeString(a.name));
    })

    let url = d.context.uri.replace("gs://", "https://storage.cloud.google.com/");
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
    op.value = `.${escapeString(f)}`;
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
    op.value = `.${escapeString(f)}`;
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
      iso.arrange({ filter: $labelFilters.value });
    });

    $objectFilters.addEventListener( 'change', function(e) {
      iso.arrange({ filter: $objectFilters.value });
    });

    document.querySelectorAll('.-hidden').forEach( x => x.classList.remove('-hidden') );
    $loading.classList.add('-hidden');
  })
}


loadDom();
