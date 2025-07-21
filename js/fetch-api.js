const head = document.getElementById("masthead");
const infoVirgen = document.getElementById("about");

//API securizada vdc
const apiKey = "AIzaSyBebPnb4qO1TaBM6grBRpPjEZ05qp-bx2Q";


const gSheetsFile = "1GDHFDwf5Nl-RiBCUODI14ZxLGlXU35NeA17akuFxIts";
const sheet = "piezas";

let loader = `<div id="loader"><span class="loader"></span></div>`;

const myList = document.getElementById("loop");

myList.innerHTML = loader;

//const myFilter2 = document.getElementById("filter-piezas");
const myFilter = document.getElementById("filter-secciones");

const myRequest = new Request("https://sheets.googleapis.com/v4/spreadsheets/"+gSheetsFile+"/values/"+sheet+"?alt=json&key="+apiKey);


// Detecto y cambio idioma
var userLang = navigator.language || navigator.userLanguage;

//userLang = "eu-EU"; 

console.log('user lang:', userLang);


var userLangCode = userLang.split('-')[0];


fetch(myRequest)
//fetch(myRequest,  {
//        mode: 'cors',
//        headers: {
//            'Content-Type': 'application/json',
//            'Access-Control-Allow-Origin': '*',
//            'X-Content-Type-Options': 'nosniff'
//        },
//        method: 'GET',
//        dataType: "jsonp",
//        credentials: 'include'
//    })
  .then((response) => response.json())
  .then((values) => {
    myList.innerHTML = '';

    //console.log(values); 

        const matrix = values["values"]

        //console.log(matrix);
    
        //console.log(matrix[0].length);
        //console.log(matrix.length);


        //replace special characters
        const chars = {
          ' ': '-',
          '.': '-',
          ',': '-',
          ';': '-',
          ':': '-',
          '_': '-',
          'á': 'a',
          'é': 'e',
          'í': 'i',
          'ó': 'o',
          'ú': 'u',
          'ñ': 'n'
        };
        let t = Object.keys(chars);
        let u = Object.values(chars);
        var re = new RegExp('['+t+']','g');

        // vacate headers/keys
        let keys = matrix.shift()
        // create JSON objects from Array
        let result = matrix.map(arr =>
            Object.assign({}, ...arr.map((x, i) => ({ [keys[i]]: x })))
        );

        console.log(result);
    
        // conseguir valores únicos en un array
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }


        // Conseguir el valor de todas las secciones
        let arr = [];
        for(let i = 0; i < result.length; i++){
        let rowInfo = result[i];
        let resultsSecciones = rowInfo.secDesc.replace(re, m => chars[m]).toLowerCase();
            if (resultsSecciones !== "") {
                arr.push(resultsSecciones);
            }
        }
        //console.log(arr);
        var unique = arr.filter(onlyUnique);
        console.log(unique);


        // Conseguir el valor de todas las piezas únicas
        //let arr2 = [];

        //for(let i = 0; i < result.length; i++){
        //let rowInfo = result[i];
        //let resultsPiezas = rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase();
        //    if (resultsPiezas !== "" && resultsPiezas !== "virgen" && resultsPiezas !== "portada") {
        //        arr2.push(resultsPiezas);
        //    }
        //}
        //console.log(arr2);
        //function onlyUnique(value, index, array) {
        //    return array.indexOf(value) === index;
        //}
        //var unique2 = arr2.filter(onlyUnique);
        //console.log(unique2);


        // Renderizado de todas las piezas en el div loop
        for(let i = 0; i < result.length; i++){
            let rowInfo = result[i]
            const newDiv = document.createElement("div");
            newDiv.className = "row bg-white filter portfolio-pieza";
            //console.log("NPieza :"+rowInfo.nPieza);
            
            if (rowInfo.secDesc !== undefined) {var idSeccion = rowInfo.secDesc.replace(re, m => chars[m]).toLowerCase();}

            if (rowInfo.nPieza !== undefined) {var idPieza = rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase()}
            else {continue};            
            
            // Añado la sección para poder filtrar
            if (idPieza !== "" && idSeccion !== "") {newDiv.classList.add(idPieza); newDiv.classList.add(idSeccion)};

            if (idPieza == "portada") {
                head.style.background = 'linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url('+rowInfo.imgDefecto+')';
                head.style.backgroundSize = 'cover';
                infoVirgen.style.background = 'linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url('+rowInfo.imgDefecto+')';
                infoVirgen.style.backgroundSize = 'cover';
                $("#masthead .claim").text(rowInfo.descripcion);
                $("#portfolio .claim-1").text(rowInfo.otros);
                $("#portfolio .claim-2").text(rowInfo.detalle);
            };

           if (idPieza == "virgen") {
                const newDiv1 = document.createElement("div");
                newDiv1.className = "about";
                newDiv1.classList.add(idPieza);
                newDiv1.innerHTML = `
                                <div class="container px-5">
                                    <div class="row gx-5 align-items-center justify-content-center justify-content-lg-between">
                                        <div class="col-sm-12 col-md-6 text-center">
                                            <h2 class="text-white mt-0">${rowInfo.detalle}</h2>
                                            <p class="opacity-50 wrap text-75 mb-4 px-2">${rowInfo.descripcion}</p>
                                        </div>
                                        <div class="col-sm-12 col-md-6 text-center">
                                            <div class="shadow"><img class="img-fluid rounded-4" src="${rowInfo.imgDefecto}" alt="virgen del castillo"></div>
                                        </div>
                                    </div>
                                </div>
                        `;
            infoVirgen.appendChild(newDiv1);

            }

            else if (idPieza !== "" && idPieza !== undefined && idPieza !== "virgen" && idPieza !== "portada"){
            
            //console.log("check :"+idPieza);


            newDiv.innerHTML = `
                            <div class="col text-center titulo-pieza-qr" style="display:none"><h1 class="h2 mb-3">${rowInfo.piezaDesc}</h1></div>
                            <div class="row mt-3 mb-2 ficha-pieza">
                                <!-- Imagen por defecto -->
                                <div class="col-md-4 mb-3 px-1 imagen-pieza">
                                    <div class="default-image">
                                        <img class="img-fluid img-main object-fit-fill rounded-4" src="${rowInfo.imgDefecto}">
                                    </div>
                                </div>
                                <!-- Detalles de la pieza -->
                                <div class="col-md-8 pe-0 detalles-pieza">
                                    <div class="row tittle-pieza px-0">
                                        <div class="col-sm"><h1 class="h2 mb-3">${rowInfo.piezaDesc}</h1></div>
                                        <button class="add btn project-add mb-2 col-sm-auto text-center px-3" data-toggle="tooltip" data-placement="bottom" data-bs-toggle="modal" data-bs-target=".bd-contact-modal-lg" title="Al puslar se añadirá en el formulario de contacto"><i class="bi bi-pin-angle"></i></button>
                                    </div>
                                    <nav aria-label="breadcrumb">
                                        <ol class="breadcrumb">
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.seccion}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.secDesc}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.espacio}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.nPieza}</li>
                                        </ol>
                                    </nav>  
                                    <p class="mb-4 text-muted ">${rowInfo.descripcion.replaceAll("•", "\n")}</p>
                                    <div class="mb-3">
                                        <span class="h7 text-wrap">Tipo de pieza: </span><span class="badge text-bg-primary">${rowInfo.tipo}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Archivos adjuntos -->
                            `;

                            if (rowInfo.image !== undefined || rowInfo.audio !== undefined || rowInfo.video !== undefined || rowInfo.application !== undefined) {
                                newDiv.innerHTML += `
                                    <div class="row more-info" id="more-info">
                                        <h2 class="h5 text-wrap ps-0"><i class="fa-solid me-2 fa-circle-info"></i>Información adicional de esta pieza:</h2>
                                    </div>
                            `;
                }

            

            // procesado de los media files 
            function CsvToArr(stringVal, splitter) {
                const [keys, ...rest] = stringVal.trim().split('\n').map((item) => item.split(splitter))
                
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    return object
                })
                return formedArr;
            }


        if (rowInfo.image !== undefined && rowInfo.image !== "") {

            const csv = rowInfo.image;
            var variants = CsvToArr(csv, ',');

        var otherVariants = document.createElement('div');
        var indicators = document.createElement('div');

            //para el recuento de archivos media
            var apptypes = [];

            for(let j = 0; j < variants.length; j++){
                        var newImage = document.createElement('div');
                        let rowVariant = variants[j];
                        //console.log(rowVariant);
                        //console.log(variants.length);
                        newImage.className = "carousel-item";
                        newImage.classList.add("more-images");                     
                        newImage.innerHTML = `
                        <span class="badge rounded-pill text-bg-danger">Imagen</span>
                        <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        <a class="portfolio-box" href="${rowVariant.url}" title="${rowVariant.name}">
                            <img class="img-thumbnail object-fit-fill rounded-3" src="${rowVariant.url}" alt="" />
                        </a>

                        `;
                        var newIndicator = document.createElement('button');
                        newIndicator.setAttribute("type","button");
                        newIndicator.setAttribute("data-bs-target", "#carouselImages-"+idPieza);
                        newIndicator.setAttribute("data-bs-slide-to",j);
                        newIndicator.setAttribute("aria-label","Slide "+(j+1));
                        //console.log(newImage);

            //recuento de archivos media           
            apptypes.push(rowVariant);

            indicators.appendChild(newIndicator);
            otherVariants.appendChild(newImage);           
            };
            
            //recuento de archivos media
            const c = {};
            apptypes.forEach(ele => {
            c[ele] = (c[ele] || 0) + 1;
            });
            console.log(c);
            var totaMediaTypes = Object.values(c);
            console.log(totaMediaTypes);

            //console.log(otherVariants);
            
            newDiv.innerHTML += `
                        <div class="row mediaButton image mb-4">
                            <button class="btn d-flex">
                            <div class="flex-fill text-start w-50 align-middle py-1 me-2"><span class="ms-0 icon-media me-2"><i class="bi bi-images"></i></span>Imagen/es</div><span class="flex-fill show-details ml-3">Ver</span><div class="ms-2 counter number-circle">${totaMediaTypes}</div>
                            </button>
                        </div>
                        <div class="row mediaContent image mb-4" id="${idPieza}" style="display: none;">
                        <div id="carouselImages-${idPieza}" class="carousel slide ${idPieza}">
                            <div class="carousel-indicators">
                            ${indicators.innerHTML}
                            </div>
                            <div class="carousel-inner">
                                ${otherVariants.innerHTML}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselImages-${idPieza}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselImages-${idPieza}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        </div>
                        `;
        }

        if (rowInfo.video !== undefined && rowInfo.video !== "") {

            const csv = rowInfo.video;
            var variants = CsvToArr(csv, ',');

        var otherVariants = document.createElement('div');
            //para el recuento de archivos media
            var apptypes = [];

            for(let j = 0; j < variants.length; j++){
                        var newVideo = document.createElement('div');
                        let rowVariant = variants[j];
                        //console.log(rowVariant);
                        //console.log(variants.length);
                        newVideo.className = "more-videos";
                        newVideo.innerHTML = `
                        <span class="badge rounded-pill text-bg-success">Video</span>
                        <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        <span class="badge rounded-pill text-bg-warning playing" style="display:none;"><i class="fa-solid fa-gear fa-spin me-2"></i>... en reproducción ahora</span>
                        <div class="d-grid gap-2 mt-1"><button data-value="${rowVariant.url}?alt=media&key=" class="mediaPlayButton btn btn-secondary btn-lg madiaUrl-${idPieza}" id="video-${idPieza}" style="background-color: #0d6efd; color:white"><i class="play-pause fa-beat-fade fa-solid fa-play fa-lg me-3"></i>Reproducir</button></div>
                        `;
                        //console.log(newVideo);
            //recuento de archivos media           
            apptypes.push(rowVariant);

            otherVariants.appendChild(newVideo);           
            };

            //recuento de archivos media
            const c = {};
            apptypes.forEach(ele => {
            c[ele] = (c[ele] || 0) + 1;
            });
            console.log(c);
            var totaMediaTypes = Object.values(c);
            console.log(totaMediaTypes);
            
            //console.log(otherVariants);
            
            newDiv.innerHTML += `
                        <div class="row mediaButton video mb-4">
                            <button class="btn d-flex">
                            <div class="flex-fill text-start w-50 align-middle py-1 me-2"><span class="ms-0 icon-media me-2"><i class="bi bi-collection-play"></i></span>Vídeo/s</div><span class="flex-fill show-details ml-3">Ver</span><div class="ms-2 counter number-circle">${totaMediaTypes}</div>
                            </button>
                        </div>
                        <div class="row mediaContent video mb-4" id="${idPieza}" style="display: none;">
                            ${otherVariants.innerHTML}
                        <video controls="controls" preload="none" class="video-thumbnail mediaPlayer rounded-3" id="mediaPlayer-video-${idPieza}" title="video player" style="display:none;"> 
                        Esta web no soporta este formato de video.
                        </video>
                        </div>
                        `;
        }
    
        if (rowInfo.audio !== undefined && rowInfo.audio !=="") {
;
            const csv = rowInfo.audio;
            var variants = CsvToArr(csv, ',');

        var otherVariants = document.createElement('div');
            //para el recuento de archivos media
            var apptypes = [];
            var appLangs = [];

            for(let j = 0; j < variants.length; j++){
                        var newAudio = document.createElement('div');
                        let rowVariant = variants[j];
                        var audioLang = rowVariant.name.split('-').pop().split('.')[0];
                        
                        console.log("Idioma Audio: "+audioLang);
                        if (audioLang =="de" || audioLang =="es" || audioLang =="fr")
                        {var audioLangClass = audioLang} 
                        else if (audioLang =="en") {var audioLangClass = "en"; audioLang = "gb";}
                        else {var audioLangClass = "es"; audioLang = "es";};
                        
                        //console.log(rowVariant);
                        //console.log(variants.length);
                        newAudio.className = "more-audios lang";
                        newAudio.classList.add(audioLangClass);
                        newAudio.innerHTML = `
                        <span class="badge rounded-pill text-bg-danger"><span class="fi me-2 fi-${audioLang}"></span>Audio</span>
                        <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        <span class="badge rounded-pill text-bg-warning playing" style="display:none;"><i class="fa-solid fa-gear fa-spin me-2"></i>... en reproducción ahora</span>
                        <div class="d-grid gap-2 mt-1"><button data-value="${rowVariant.url}?alt=media&key=" class="mediaPlayButton btn btn-secondary btn-lg madiaUrl-${idPieza}" id="audio-${idPieza}" style="background-color: #db792c; color:white"><i class="play-pause fa-beat-fade fa-solid fa-play fa-lg me-3"></i>Reproducir</button></div>
                        `;

                        //console.log(newAudio);
            //recuento de archivos media           
            apptypes.push(rowVariant);
            appLangs.push(audioLang);

            otherVariants.appendChild(newAudio);           
            };
            
            //recuento de archivos media
            //const c = {};
            //apptypes.forEach(ele => {
            //c[ele] = (c[ele] || 0) + 1;
            //});
            //console.log(c);
            //var totaMediaTypes = Object.values(c);
            //console.log(totaMediaTypes);

            //console.log(otherVariants);

            // Almaceno en un objeto todos los audios por idioma
            var countLangs = {};
            for (var z = 0; z < appLangs.length; z++) {
                countLangs[appLangs[z]] = 1 + (countLangs[appLangs[z]] || 0);
            }
            console.log(countLangs);

            function getValueByKey(object, row) {
            return object[row];
            }
            // Saco el total de audios si el idioma del sistema coincide con los de los audios
            let totalAudioLang = getValueByKey(countLangs, userLangCode);
            console.log("cuento archivos en el idioma detectado: "+totalAudioLang);
            // Si el idioma del sistema no coincide con ningun recuento, selecciono el de las que están en inglés
            if (totalAudioLang == undefined) {
                if (userLangCode =="eu" || userLangCode =="ca" || userLangCode =="gl")
                {totalAudioLang = getValueByKey(countLangs, "es")}
                else 
                {totalAudioLang = getValueByKey(countLangs, "gb")}
            }

            else {totalAudioLang = getValueByKey(countLangs, userLangCode)};

            console.log(userLangCode);
            console.log(totalAudioLang);
   
            
            newDiv.innerHTML += `
                        <div class="row mediaButton audio mb-4">
                            <button class="btn d-flex" id="${idPieza}">
                            <div class="flex-fill text-start w-50 align-middle py-1 me-2"><span class="ms-0 icon-media me-2"><i class="bi bi-headphones"></i></span>Audioguía/s</div><span class="flex-fill show-details ml-3">Ver</span><div class="ms-2 counter number-circle">${totalAudioLang}</div>
                            </button>
                        </div>
                        <div class="row mediaContent audio mb-4" id="mediaContent-${idPieza}" style="display: none;">
                            ${otherVariants.innerHTML}
                        <audio controls="controls" preload ="none" class="audio-thumbnail mediaPlayer" id="mediaPlayer-audio-${idPieza}" title="audio player" style="display:none;"> 
                            Esta web no soporta este formato de audio.
                        </audio>
                        </div>
                        `;
        }

        if (rowInfo.application !== undefined && rowInfo.application !== "") {

            //console.log(rowInfo.image);
            const csv = rowInfo.application;
            var variants = CsvToArr(csv, ',');


            var apptypes = []; 

            for(let i = 0; i < variants.length; i++){
                        let rowVariant = variants[i];
                        var appType = rowVariant.url.split('/')[3];
            apptypes.push(appType);
            };

            var totaMediaTypes = apptypes.length;

            var uniqueAppTypes = apptypes.filter(onlyUnique);

            //Contar cada media tipo
            const c = {};
            apptypes.forEach(ele => {
            c[ele] = (c[ele] || 0) + 1;
            });
            console.log(c);

            //console.log(otherVariants);
            
            newDiv.innerHTML += `
                        <div class="row mediaButton file mb-4">
                            <button class="btn d-flex">
                            <div class="flex-fill text-start w-50 align-middle py-1 me-2"><span class="ms-0 icon-media me-2"><i class="bi bi-file-earmark"></i></span>Archivo/s</div><span class="flex-fill show-details ml-3">Ver</span><div class="ms-2 counter number-circle">${totaMediaTypes}</div>
                            </button>
                        </div>
                        `;
            var otherVariants = document.createElement('div');
            var otherAppVariants = document.createElement('div');

            for(let k = 0; k < uniqueAppTypes.length; k++){
                let appVariant = uniqueAppTypes[k];
                var appVariantName = appVariant.replace("document","Documento").replace("presentation","Presentación").replace("file","Archivo de texto");

                if (appVariant == "document") {var iconDoc = "word"; var color = "primary";};
                if (appVariant == "presentation") {var iconDoc = "powerpoint"; var color = "warning";};
                if (appVariant == "spreadsheet") {var iconDoc = "excel"; var color = "success";};
                if (appVariant == "file") {var iconDoc = "pdf"; var color = "danger";};

                //console.log(appVariant);
                for(let j = 0; j < variants.length; j++){
                        let rowVariant = variants[j];
                        //console.log(appVariant+">>>>>"+appType);
                        var appType = rowVariant.url.split('/')[3];
                        if (appVariant == appType) {
                            //console.log(appVariant+">>BINGO>>>"+appType);
                            var newAppDoc = document.createElement('div');
                            newAppDoc.className = "more-files";
                            newAppDoc.innerHTML = `
                            <span class="badge rounded-pill text-bg-warning">Archivo</span>
                            <span class="badge rounded-pill text-bg-${color}">${appVariantName}</span>
                            <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>

                            <object class="file-thumbnail rounded-3" id="archivos" title="${rowVariant.name}"
                            data="${rowVariant.url}/export?mimeType=application/pdf&key=${apiKey}" frameborder="0" allowfullscreen  
                            type="application/pdf">
                            </object>

                            `;
                            //console.log(newApp);
                            otherVariants.appendChild(newAppDoc);
                        };
                        //console.log(appType);
                    };
                var newApp = document.createElement('div');
                newApp.className = "row w-100";
                var appVariantName = appVariant.replace("document","Documentos").replace("presentation","Presentaciones").replace("file","Archivos de texto, pdfs,...");
                
                var totalUniqueAppTypes = c[appVariant];
                console.log(totalUniqueAppTypes);
                newApp.innerHTML = `
                                <h2 class="h5 text-wrap text-center"><i class="fa-solid fa-file-${iconDoc} me-2 text-${color}"></i>${appVariantName}<span class="ms-2">${totalUniqueAppTypes}</span></h2>
                                <hr />
                                    ${otherVariants.innerHTML}
                                `;
                otherAppVariants.appendChild(newApp);
                // Reseteo el contenido de archivos cuando ya he cargado todos los que tocan en cada tipo
                otherVariants.innerHTML = "";

            };
            newDiv.innerHTML += `
                <div class="row mediaContent file mb-4" id="${idPieza}" style="display: none;">
                        ${otherAppVariants.innerHTML}
                </div>
                `;
            
        
        }

    // cargo cada una de las piezas
    myList.appendChild(newDiv);  

    }
}

// Renderizado de los botones de filtro de piezas
//    for(let i = 0; i < unique2.length; i++){
//        let rowInfo = unique2[i]            
//        //console.log(rowInfo);
//        const newDiv = document.createElement("button");
//        newDiv.className = "btn btn-default filter-button py-2 px-3";
//
//        var idPieza2 = rowInfo.replace(re, m => chars[m]).toLowerCase();
//        if (idPieza2 !== "") {newDiv.dataset.filter = idPieza2};
//        newDiv.innerHTML = rowInfo.replace("-", " ");
//        myFilter2.appendChild(newDiv);
//    }
//    const newButton2 = document.createElement("button");
//    newButton2.className = "btn btn-default py-2 px-3 search";
//    newButton2.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
//    myFilter2.appendChild(newButton2);


// Renderizado de los botones de secciones
    for(let i = 0; i < unique.length; i++){
        let rowInfo = unique[i]            
        //console.log(rowInfo);
        const newDiv = document.createElement("button");
        newDiv.className = "btn btn-default filter-button py-2 px-3";

//        var idSeccion = rowInfo.replace(re, m => chars[m]).toLowerCase();
        var idSeccion = rowInfo;

        if (idSeccion !== "") {newDiv.dataset.filter = idSeccion};
        newDiv.innerHTML = rowInfo.replaceAll("-", " ");
        myFilter.appendChild(newDiv);
    }
    const newButton = document.createElement("button");
    newButton.className = "btn btn-default py-2 px-3 search";
    newButton.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
    myFilter.appendChild(newButton);



    $(".form-control").focus(function(){
      $(".form-check.legal").show('3000'); 
    });



    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })


$(document).ready(function(){

// Activate GLightbox plugin for portfolio items
// In DOM can be added the file type as data attribute: data-type="image"

        var lightbox = GLightbox({
            selector: '.portfolio-box',
            type: 'image',
            descPosition: 'top'
        });

});

$(document).ready(function(){
// Inicializo el carrusel de Bootstrap
        const carousel = new bootstrap.Carousel('.carousel');
        $(".carousel-inner").each( function () {
            $(this).children().first().toggleClass("active");
        });
        $(".carousel-indicators").each( function () {
            $(this).children().first().toggleClass("active");
            $(this).children().first().attr('aria-current', 'true');
        });
});

$(document).ready(function(){
// oculto botones sin contenido que coincida con el idioma detectado
    $('.counter:contains("undefined")').parent().parent().hide();

});

$(document).ready(function(){
// Cambio idioma una vez todo se ha renderizado

    console.log('user lang:', userLang);
    console.log('user lang Code:', userLangCode);
    console.log('Apago todo y activo idioma: '+userLangCode);
    console.log('Existe contenido con mi idioma?: '+$('.' + userLangCode).length);

    // Oculto los audios o contenido que no correspondan al idioma del sistema, con algunas excepciones
    if ($('.' + userLangCode).length) {

        console.log('camino 1');
        $('.lang').hide();
        $('.' + userLangCode).show();
        $('.' + userLangCode).addClass('shown');
    } else if (userLangCode == "eu" || userLangCode == "ca" || userLangCode == "gl") {
        console.log('camino 2');
        $('.lang').hide();
        $('.es').show();
        $('.es').addClass('shown');
    } else {
    // si no hay match entre el nav.lang y el contenido media de los 4 idiomas, dejo en ingles, lo busco en la clase
    console.log('camino 3');
        $('.lang').hide();
        $('.' + userLangCode).show();
        $('.en').show();
        $('.en').addClass('shown');
    }
    // Pongo la bandera del idioma detectado;
    let userLangCodeFlag = "";
    if (userLangCode == "en") {userLangCodeFlag = "gb"}
    else if (userLangCode == "ca") {userLangCodeFlag = "es-ct"}
    else if (userLangCode == "eu") {userLangCodeFlag = "es-pv"}
    else if (userLangCode == "gl") {userLangCodeFlag = "es-ga"}
    else {userLangCodeFlag = userLangCode};
    
    let detLang = '<span class="ms-2 current-language fi fi-'+userLangCodeFlag+'"></span>';
    $("#navbarResponsive").append(detLang);

    // Modifico el widget de google transtale; 
    $('.goog-te-gadget div').get(0).nextSibling.remove();
    $('.goog-te-gadget').find('span').hide();

    // Traduzco toda la web segun el idioma detectado; 
    console.log('user lang code:', userLangCode);

    // Busco el indice del idioma detectado en el widget de google translate
    let index = $(".goog-te-combo option[value="+userLangCode+"]").index();
    console.log('Index: '+index);

    // Traduzco toda la web segun el índice del idioma detectado modificando el select del widget del traductor, excepto para el idioma original (es)
    if (userLangCode !== "es") {
        console.log('Se procesa la traducción. Idioma distinto al original (es): '+userLangCode);
        function updateLanguage(value) {
            //var selectedIndex = 0;
            var a = document.querySelector(".goog-te-combo");
            switch (value) {
            }
            a.selectedIndex = index;
            a.dispatchEvent(new Event('change'));
        }

        updateLanguage(userLangCode);
    }
    

        
});

$(document).ready(function(){
    $(".add").click(function(){
        var idPieza = $(this).parent().find("h1").text();
        var nameidPieza = idPieza.replace(re, m => chars[m]).toLowerCase();
        var target = document.getElementById("tittle-cart-items");
        var newField = document.createElement("div");
        newField.className = "form-check form-check-inline";
        newField.classList.add(nameidPieza);

        if ($('.form-check.'+nameidPieza).length === 0) {
            $(this).find('i').removeClass('bi-pin-angle');
            $(this).find('i').addClass('bi-pin-fill');
            $(this).addClass("active");
            newField.innerHTML = `
                        <input class="form-check-input" type="checkbox" id="piezas-${nameidPieza}" name="piezas" value="${nameidPieza}" checked />
                        <label class="form-check-label" for="piezas-${nameidPieza}">${idPieza}</label>
        `;;
            target.after(newField);
            $('.cart-items').show('1000');
            var numItems = $('.cart-items .form-check').length;
            $(".cart span").text(numItems);
            $(".cart span").show();
            $(this).attr("data-bs-original-title", "Pieza añadida");
            // document.getElementById("tittle-cart-items").scrollIntoView( {behavior: "smooth" });
        }

        else if ($('.form-check.'+nameidPieza).length > 0) {
            alert("Ya has añadido la pieza: "+nameidPieza);
            $(this).tooltip('dispose');
            $(this).tooltip('hide');
        }


        });
});


$(document).ready(function(){

        $(".filter-button").click(function(){
            var value = $(this).attr('data-filter');

            // colapso todos los paneles de media content de las piezas
            $(".mediaButton .btn.active").click();
            
            $(".search").removeClass("active");
            $(this).parent().next('#search-field').hide('3000');
            if(value == "all")
            {
                
                $('.filter').show('1000');
            }
            else
            {
                $(".filter").not('.'+value).hide('3000');
                $('.filter').filter('.'+value).show('3000');
                
            }
        });


});


$(document).ready(function() {
    $(".filter-button").click(function () {
        $(".filter-button").removeClass("active");

        // $(".tab").addClass("active"); // instead of this do the below 
        $(this).addClass("active");   
    });


    $(".search").click(function () {
        // $(".tab").addClass("active"); // instead of this do the below 

        if ($(this).parent().next('#search-field').is(":visible")) {
            $(this).parent().next('#search-field').find("#myInput").trigger( "focus" );
        }
        else {
            $(".filter-button[data-filter='all']").click();
            $(".filter-button").removeClass("active");
            $(this).parent().next('#search-field').show('0');
            $(this).addClass("active");
            $(this).parent().next('#search-field').find("#myInput").trigger( "focus" );
        }
    });



    $('input.deletable').wrap('<span class="deleteicon"></span>').after($('<span><i class="fa fa-times-circle fa-lg" aria-hidden="true"></i></span>').click(function() {
        $(this).prev('input').val('').trigger('change').focus();
        $(".filter-button[data-filter='all']").click();
    }));


    $(".mediaButton .btn").click(function () {
        var mediaPlayer = $('.mediaPlayer');
        $('.playing').hide();
        //$(this).css({'transform' : 'rotate('+ degrees +'deg)'});
        $(this).toggleClass("active");

        //Paro todas las reproducciones
        mediaPlayer.each(function(){
        this.pause(); // Stop playing
        this.currentTime = 0; // Reset time
        });


            if ($(this).hasClass("active"))
            {  
                $('.mediaContent').hide('3000');    
                $('.show-details').text('Ver');
                $('.mediaButton .btn').removeClass('active');
                $('.mediaPlayButton').show();
                mediaPlayer.hide();

                $(this).parent().next(".mediaContent").show('1000');    
                $(this).find('.show-details').text('Ocultar');
                $(this).addClass('active');
            }
            else
            {
                $(this).parent().next(".mediaContent").hide('3000');
                $(this).find('.show-details').text('Ver');
                $(this).removeClass('active');
            }

    });

    $(".mediaPlayButton").click(function () {
        idPieza = $(this).attr('id');
        console.log("idPieza: "+idPieza);
        $('.playing').hide();

        //$(this).toggleClass("active");
        //$(this).parent().next(".mediaContent").toggle('1000');

        var player = document.getElementById('mediaPlayer-'+idPieza);
        var playerSource = document.createElement('source');

        var source = $(this).attr("data-value");
        //Inyecto el API key en la pieza a reproducir, audio o video. Para no generar concurrencia de peticiones
        console.log("inyecto API key");
        console.log(player.tagName);
        playerSource.setAttribute('src', source+apiKey);

        //if (player.tagName == 'VIDEO') {playerSource.setAttribute('type', 'video/mp4');}
        //if (player.tagName == 'AUDIO') {playerSource.setAttribute('type', 'audio/mp3');}

        console.log($('#mediaPlayer-'+idPieza+' source').length);
        if ($('#mediaPlayer-'+idPieza+' source').length == 0 ) {
        player.appendChild(playerSource);
        //call this to just preload the audio without playing
        }
        //player.autoplay = true; //call this to play the song right away
        $(this).hide('3000');
        $(this).parent().parent().find('.playing').show('1000');

        $('#mediaPlayer-'+idPieza).show('1000');
        //$(this).find('.bi').addClass('bi-pause-fill');
        //$(this).find('.bi').removeClass('bi-play-fill');
        player.load();
        player.play();

    });

});

$(document).ready(function(){

    let t = Object.keys(chars);
    let u = Object.values(chars);

    var rtt = ' _áéíóúñ';
    var re = new RegExp('['+t+']','g');
    let s = 'áopt é_qwñíáááúó aá ññññ_ ';
    s = s.replace(re, m => chars[m]);

    for (var i in t) {
    console.log(t[i]); //output of keys as string
    }
    console.log(s);
    console.log(t);
    console.log(u);

});



$(document).ready(function(){
//oculto en la ficha la imagen cuando no hay src
    $('.imagen-pieza img').each(function () {
        //console.log($(this).attr('src'));
    if ($(this).not().attr('src') == "" || $(this).not().attr('src') == "undefined") {
        
        $(this).parent().parent().hide();
        $(this).parent().parent().next('.detalles-pieza').addClass('w-100');
    }
    });

//oculto en los carruseles de imagen los botones cuando sólo hay 1 imagen
    $('.carousel-inner').each(function () {

        var numItems = $(this).find('.carousel-item').length;
        console.log(numItems);

        if(numItems == '1') {
            $(this).parent().find('.carousel-indicators').hide();
            $(this).parent().find('.carousel-control-prev').hide();
            $(this).parent().find('.carousel-control-next').hide();
        }
    });

});



$(document).ready(function() {
    // Asumeiendo una URL con esta estructura: http://url.com/?param1=value1&param2=value2 -->
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
    const param1Value = urlParams.get('param1');
    // const param2Value = urlParams.get('param2');

// Reseteo las cookies
//$.removeCookie('events');
//$.removeCookie('count');
//$.removeCookie('visita');


    console.log(urlParams.has('param1')); // true

    if (urlParams.has('param1')) {
    var idUrlsParam = param1Value.split('-')[0];
    console.log("id param: "+idUrlsParam);

        if (idUrlsParam == "pieza") {
            // eventos si hay parámetro

            $([document.documentElement, document.body]).animate({
                scrollTop: $("#more-info").offset().top
            }, 1000);

            $('.under-construction').hide();
            //$('.ficha-pieza').hide();
            $('.titulo-pieza-qr').hide();
            $('.'+param1Value+' .mediaButton.audio .btn').click();
            $('.journey-button').show('1000');
            $('.filter').hide();
            $('.filter.'+param1Value).show('1000');
            //$('[data-filter="'+param1Value+'"]').click();
            console.log('param1Value:', param1Value);
                $(".navbar-nav").hide();
                //$("#filter-piezas").hide();
                $("#masthead").hide();
                $("#header-portfolio").hide();
                $("#about").hide();
                $("#contact").hide();
                $("#portfolio").addClass("mt-6");
                $("#mainNav").addClass("dark");
                $(".add").hide();

                var seccion = param1Value.split('-')[1];
                console.log(seccion);

                console.log($.cookie('count'));
                console.log($.cookie('events'));
                console.log($.cookie('visita'));


    // Añado la opción de ver toda la web si estás en la sección 8
                if(seccion == "s08") {
                    var restore = String('<div class="container px-3 mt-0 restoreDiv"><div class="col text-center"><i class="mb-3 fa-solid fa-bounce fa-lg fa-angles-down"></i><div class="wrap"><button class="btn w-50 backToMain"><i class="fa-solid fa-house me-2"></i>Ir a la web de la exposición</button></div></div></div>');
                    $("#portfolio").append(restore);
                }

                const event = new Date();
                let time = event.toLocaleString();
                console.log(time);

                // Variable como cookie, empiezo en 1 por sesión, cada sesión son 24h:
                
                if ($.cookie('count') == undefined || $.cookie('events') == undefined) {
                let countValue = 1;

                var start = new Date();
                var end = new Date("14 Sep 2025");// Finaliza la exposición

                // end - start returns difference in milliseconds 
                var diff = new Date(end - start);

                // get days
                var days = parseInt(diff/1000/60/60/24);
                console.log("Ahora :"+start);
                console.log("Fin :"+end);
                console.log("Dias :"+days);

                $.cookie('events', '', {expires: days, secure: true});
                $.cookie('count', countValue, {expires: days, secure: true});
                $.cookie('visita', [], {expires: days, secure: true});
    
                let count = $.cookie('count');
                let eventsValue = String('<li class="event" data-date="'+time+'"><h4 class="mb-3">Parada número:<span style="display: inline;">'+count+'</span></h4><p>Pieza visitada:<span class="pieza-visitada" style="display: inline;">'+param1Value+'</span></p></li>');
                $(".bd-journey .modal-body .timeline-1").html(eventsValue);

                let itinerario = ["vistia ("+count+"): "+time+" | "+param1Value];

                //Object.assign(itinerario, { visita: { id: count, hora:  time, pieza: param1Value} });


                count = parseInt(count) + 1;

                $.cookie('events', eventsValue);
                $.cookie('count', count);
                $.cookie('visita', [itinerario]);
                console.log(itinerario);
                console.log($.cookie('visita'));
                }

                else {
                console.log("camino 2: cookie ya creada");
                let count = $.cookie('count');
                let eventsValue = String($.cookie('events') + '<li class="event" data-date="'+time+'"><h4 class="mb-3">Parada número:<span style="display: inline;">'+count+'</span></h4><p>Pieza visitada:<span class="pieza-visitada" style="display: inline;">'+param1Value+'</span></p></li>');
                $(".bd-journey .modal-body .timeline-1").html(eventsValue);

                let itinerario = [$.cookie('visita')];

                itinerario.push("vistia ("+count+"): "+time+" | "+param1Value);

                count = parseInt(count) + 1;

                $.cookie('events', eventsValue);
                $.cookie('count', count);
                $.cookie('visita', [itinerario]);
                console.log(itinerario);
                console.log($.cookie('visita'));
            }
                
                //console.log($.cookie('count'));
                //console.log($.cookie('events'));
                //console.log(itinerario);
        }

        else if (idUrlsParam == "pruebas") {
            console.log("ok");
        // parámetro para pruebas, cargo toda la web
        }

        else {$("#portfolio").remove();}
        
    }


    else {
        $('.journey-button').hide();
        // Url sin params, elemino toda la exposicion
        $("#portfolio").remove();

    }

    // console.log('param2Value:', param2Value);
    
    $(".backToMain").click(function () {
        //$('.titulo-pieza-qr').hide();
        $('.mediaButton.audio .btn').click();
        $('.ficha-pieza').show();
        $('.filter').show();
        $(".navbar-nav").show();
        //$("#filter-piezas").hide();
        $("#masthead").show();
        $("#header-portfolio").show();
        $("#about").show();
        $("#contact").show();
        $("#portfolio").removeClass("mt-6");
        document.getElementById("masthead").scrollIntoView( {behavior: "smooth" });
        $("#mainNav").removeClass("dark");
        $(".restoreDiv").remove();
        //$(".filter-button").filter('[data-filter="all"]').click();
        $(".mediaButton .btn.active").click();
        $(".add").show();
        
        // elimino parámetros de la url
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }

    });
});







})
.catch(console.error);




