const head = document.getElementById("masthead");
const infoVirgen = document.getElementById("about");

const apiKey = "AIzaSyAHboM6ymynP11uObDSMrJM6wQugHw4BbM";
const gSheetsFile = "1GDHFDwf5Nl-RiBCUODI14ZxLGlXU35NeA17akuFxIts";
const sheet = "piezas";

let loader = `<div id="loader"><span class="loader"></span></div>`;

const myList = document.getElementById("loop");

myList.innerHTML = loader;

//const myFilter2 = document.getElementById("filter-piezas");
const myFilter = document.getElementById("filter-secciones");

const myRequest = new Request("https://sheets.googleapis.com/v4/spreadsheets/"+gSheetsFile+"/values/"+sheet+"?alt=json&key="+apiKey);


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


        // Conseguir el valor de todas las secciones / espacios
        let arr = [];
        for(let i = 0; i < result.length; i++){
        let rowInfo = result[i];
        let resultsSecciones = rowInfo.seccion.replace(re, m => chars[m]).toLowerCase();
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
            var idPieza = rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase();
            var idSeccion = rowInfo.seccion.replace(re, m => chars[m]).toLowerCase();
            
            if (idPieza !== "" && idSeccion !== "") {newDiv.classList.add(idPieza); newDiv.classList.add(idSeccion)};

            if (idPieza == "portada") {
                head.style.background = 'linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url('+rowInfo.imgDefecto+')';
                head.style.backgroundSize = 'cover';
                infoVirgen.style.background = 'linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url('+rowInfo.imgDefecto+')';
                infoVirgen.style.backgroundSize = 'cover';
                $("#portfolio .claim").text(rowInfo.descripcion);
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
                                            <p class="opacity-75 wrap text-75 mb-4 px-2">${rowInfo.descripcion}</p>
                                        </div>
                                        <div class="col-sm-12 col-md-6 text-center">
                                            <div class="shadow"><img class="img-fluid rounded-4" src="${rowInfo.imgDefecto}" alt="virgen del castillo"></div>
                                        </div>
                                    </div>
                                </div>
                        `;
            infoVirgen.appendChild(newDiv1);

            }

            else if (idPieza !== "" && idPieza !== "virgen" && idPieza !== "portada"){
            
            console.log("check :"+idPieza);


            newDiv.innerHTML = `
                            <div class="row mt-4 mb-2">
                                <!-- Imagen por defecto -->
                                <div class="col-md-4 mb-2">
                                    <div class="default-image">
                                        <img class="img-fluid img-main object-fit-fill" src="${rowInfo.imgDefecto}">
                                    </div>
                                </div>
                                <!-- Detalles de la pieza -->
                                <div class="col-md-8">
                                    <div class="row tittle-pieza">
                                        <div class="col-sm"><h1 class="h2 mb-3">${rowInfo.nPieza}</h1></div>
                                        <button class="add btn project-add mb-2 col-sm-auto text-center px-3" data-toggle="tooltip" data-placement="bottom" data-bs-toggle="modal" data-bs-target=".bd-contact-modal-lg" title="Al puslar se añadirá en el formulario de contacto"><i class="fa-solid fa-thumbtack"></i></button>
                                    </div>
                                    <nav aria-label="breadcrumb">
                                        <ol class="breadcrumb">
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.seccion}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.espacio}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.soporte}</li>
                                            <li class="breadcrumb-item active" aria-current="page">${rowInfo.nPieza}</li>
                                        </ol>
                                    </nav>  
                                    <p class="mb-4">${rowInfo.descripcion.replaceAll("•", "\n")}</p>
                                    <div class="mb-3">
                                        <span class="h7 text-wrap">Tipo de pieza: </span><span class="badge text-bg-primary">${rowInfo.tipo}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Archivos adjuntos -->
                            `;

                            if (rowInfo.image !== undefined || rowInfo.audio !== undefined || rowInfo.video !== undefined || rowInfo.application !== undefined) {
                                newDiv.innerHTML += `
                                    <div class="row more-info">
                                        <h2 class="h5 text-wrap"><i class="fa-solid me-2 fa-circle-info"></i>Información adicional de esta pieza:</h2>
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


        if (rowInfo.image !== undefined) {

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
                        newImage.classList.add("moreimages");                     
                        newImage.innerHTML = `
                        <a class="portfolio-box ratio ratio-16x9" href="${rowVariant.url}" title="${rowVariant.name}">
                            <img class="img-fluid img-thumbnail object-fit-fill d-block w-100" src="${rowVariant.url}" alt="" />
                        </a>
                        <div class="carousel-caption d-none d-md-block">
                            <span class="badge rounded-pill text-bg-danger">Imagen</span>
                            <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        </div>
                        `;
                        var newIndicator = document.createElement('button');
                        newIndicator.setAttribute("data-bs-target", "#carouselImages."+idPieza);
                        newIndicator.setAttribute("data-bs-slide-to",j);
                        newIndicator.setAttribute("aria-current","true");
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
                        <div class="row mediaButton mb-4">
                            <button class="btn">
                            <i class="fa-solid fa-image me-2"></i>Imagenes<span class="ms-2">${totaMediaTypes}</span><i class="fa-solid fa-arrow-right mx-2"></i><span class="show-details ml-3">Ver detalles</span>
                            </button>
                        </div>
                        <div class="row mediaContent mb-4" id="${idPieza}" style="display: none;">
                        <div id="carouselImages" class="carousel slide ${idPieza}">
                            <div class="carousel-indicators">
                            ${indicators.innerHTML}
                            </div>
                            <div class="carousel-inner">
                                ${otherVariants.innerHTML}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselImages.${idPieza}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselImages.${idPieza}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        </div>
                        `;
        }

        if (rowInfo.video !== undefined) {

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
                        newVideo.className = "col";
                        newVideo.innerHTML = `
                        <span class="badge rounded-pill text-bg-success">Video</span>
                        <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        <iframe class="video-thumbnail ratio ratio-16x9 img-fluid object-fit-fill rounded-3" id="video" title="${rowVariant.name}"
                        src="${rowVariant.url}">
                        </iframe>
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
                        <div class="row mediaButton mb-4">
                            <button class="btn">
                            <i class="fa-solid fa-video me-2"></i>Video<span class="ms-2">${totaMediaTypes}</span><i class="fa-solid fa-arrow-right mx-2"></i><span class="show-details ml-3">Ver detalles</span>
                            </button>
                        </div>
                        <div class="row mediaContent mb-4" id="${rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase()}" style="display: none;">
                            ${otherVariants.innerHTML}
                        </div>
                        `;
        }
    
        if (rowInfo.audio !== undefined) {
;
            const csv = rowInfo.audio;
            var variants = CsvToArr(csv, ',');

        var otherVariants = document.createElement('div');
            //para el recuento de archivos media
            var apptypes = [];

            for(let j = 0; j < variants.length; j++){
                        var newAudio = document.createElement('div');
                        let rowVariant = variants[j];
                        //console.log(rowVariant);
                        //console.log(variants.length);
                        newAudio.className = "col";
                        newAudio.innerHTML = `
                        <span class="badge rounded-pill text-bg-danger">Audio</span>
                        <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                        <iframe class="rounded-pill audio-thumbnail" id="audio" title="${rowVariant.name}"
                        src="${rowVariant.url}">
                        </iframe>
                        `;
                        //console.log(newAudio);
            //recuento de archivos media           
            apptypes.push(rowVariant);

            otherVariants.appendChild(newAudio);           
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
                        <div class="row mediaButton mb-4">
                            <button class="btn">
                            <i class="fa-solid fa-volume-high me-2"></i>Audio<span class="ms-2">${totaMediaTypes}</span><i class="fa-solid fa-arrow-right mx-2"></i><span class="show-details ml-3">Ver detalles</span>
                            </button>
                        </div>
                        <div class="row mediaContent mb-4" id="${rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase()}" style="display: none;">
                            ${otherVariants.innerHTML}
                        </div>
                        `;
        }

        if (rowInfo.application !== undefined) {

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
                        <div class="row mediaButton mb-4">
                            <button class="btn">
                            <i class="fa-solid fa-file me-2"></i>Archivos<span class="ms-2">${totaMediaTypes}</span><i class="fa-solid fa-arrow-right mx-2"></i><span class="show-details ml-3">Ver detalles</span>
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
                            newAppDoc.className = "col h_iframe";
                            newAppDoc.innerHTML = `
                            <span class="badge rounded-pill text-bg-warning">Archivo</span>
                            <span class="badge rounded-pill text-bg-${color}">${appVariantName}</span>
                            <span class="badge rounded-pill text-bg-secondary text-wrap">${rowVariant.name}</span>
                            <iframe class="img-fluid ratio ratio-1x1 file-thumbnail img-thumbnail object-fit-fill" id="archivos" title="${rowVariant.name}"
                            src="${rowVariant.url}">
                            </iframe>
                            `;
                            //console.log(newApp);
                            otherVariants.appendChild(newAppDoc);
                        };
                        //console.log(appType);
                    };
                var newApp = document.createElement('div');
                newApp.classList.add("row");
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
                <div class="row mediaContent mb-4" id="${rowInfo.nPieza.replace(re, m => chars[m]).toLowerCase()}" style="display: none;">
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

        var idSeccion = rowInfo.replace(re, m => chars[m]).toLowerCase();
        if (idSeccion !== "") {newDiv.dataset.filter = idSeccion};
        newDiv.innerHTML = rowInfo.replace("-", " ");
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
            descPosition: 'bottom'
        });

        var lightbox2 = GLightbox({
            selector: '.video-thumbnail'
        });

// Inicializo el carrusel de Bootstrap
        const carousel = new bootstrap.Carousel('#carouselImages');
        $( ".carousel-inner" ).each( function () {
            $(this).children().first().toggleClass("active");
        });
        $( ".carousel-indicators" ).each( function () {
            $(this).children().first().toggleClass("active");
        });

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
            $(this).attr("data-bs-original-title", "Pieza añadido");
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
    }));


    $(".mediaButton .btn").click(function () {
        $(this).toggleClass("active");
        $(this).parent().next(".mediaContent").toggle('1000');
        $(this).find('.show-details').text(function(i, v){
             return v === 'Ocultar detalles' ? 'Ver detalles' : 'Ocultar detalles'
         })
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



$(document).ready(function() {
    // Asumeiendo una URL con esta estructura: http://url.com/?param1=value1&param2=value2 -->
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
    const param1Value = urlParams.get('param1');
    // const param2Value = urlParams.get('param2');

    console.log(urlParams.has('param1')); // true

    if (urlParams.has('param1')) {
        // Now you can use these values as needed
        $('.filter').hide();
        $('.filter.'+param1Value).show('1000');
        //$('[data-filter="'+param1Value+'"]').click();
        document.getElementById("filter-secciones").scrollIntoView( {behavior: "smooth"});
        console.log('param1Value:', param1Value);
            $(".navbar-nav").hide();
            //$("#filter-piezas").hide();
            $("#masthead").hide();
            $("#header-portfolio").hide();
            $("#about").hide();
            $("#contact").hide();
            $("#portfolio").addClass("mt-6");
            document.getElementById("loop").scrollIntoView( {behavior: "smooth" });
            $("#mainNav").addClass("dark");
            $(".add").hide();

            var seccion = param1Value.split('-')[1];
            console.log(seccion);
            //$.removeCookie('count');
            //$.removeCookie('events');

            console.log($.cookie('count'));
            console.log($.cookie('events'));

            if(seccion == "s08") {
                var restore = String('<div class="container px-3 mt-0 restoreDiv"><div class="col text-center"><i class="mb-3 fa-solid fa-bounce fa-lg fa-angles-down"></i><div class="wrap"><button class="btn w-50 backToMain"><i class="fa-solid fa-house me-2"></i>Ir a la web de la exposición</button></div></div></div>');
                $("#portfolio").append(restore);
            };

            const event = new Date();
            let time = event.toLocaleString();
            console.log(time);

            // Variable como cookie, empiezo en 1 por sesión, cada sesión son 24h, en este caso 12:
            
            if ($.cookie('count') == undefined || $.cookie('events') == undefined) {
            let countValue = 1;
            $.cookie('events', '', { expires: 0.5 });
            $.cookie('count', countValue, { expires: 0.5 });
            let count = $.cookie('count');
            let eventsValue = String('<li class="event" data-date="'+time+'"><h4 class="mb-3">Visita número: '+count+'</h4><p>Visitaste la pieza: '+param1Value+'</p></li>');

            $(".bd-journey .modal-body .timeline-1").html(eventsValue);
            console.log(eventsValue);
            $.cookie('events', eventsValue);
            count = parseFloat(count) + 1;
            $.cookie('count', count);
            }

            else {
            let count = $.cookie('count');
            let eventsValue = String($.cookie('events') + '<li class="event" data-date="'+time+'"><h4 class="mb-3">Visita número: '+count+'</h4><p>Visitaste la pieza: '+param1Value+'</p></li>');
            $(".bd-journey .modal-body .timeline-1").html(eventsValue);
            $.cookie('events', eventsValue);
            count = parseFloat(count) + 1;
            $.cookie('count', count);
            console.log(eventsValue);
            }
            
            console.log($.cookie('count'));
            console.log($.cookie('events'));
            

    };

    // console.log('param2Value:', param2Value);
    
    $(".backToMain").click(function () {
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
        

    });
});



})
.catch(console.error);




