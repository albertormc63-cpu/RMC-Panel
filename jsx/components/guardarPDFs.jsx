function guardarPDFs(filtered) {
    // Guardar la ruta del documento activo para reabrirlo después
    var rutaBase = app.activeDocument.fullName.fsName;

    for (var j = 0; j < filtered.length; j++) {

        var doc = app.activeDocument;

        var numeroNuevo = filtered[j].player;

        var nombreFirst = filtered[j].firstName;
        var nombreLast = filtered[j].lastName;
        var nombreNuevo = (
            filtered[j].firstName + " " + filtered[j].lastName
        ).replace(/^\s+|\s+$/g, "");

        var positionNueva = filtered[j].position;

        // 🔥 REEMPLAZAR TEXTOS
        reemplazarTextos(doc, numeroNuevo, nombreFirst, nombreLast, nombreNuevo, positionNueva, config);

        // 🔥 GUARDAR
        guardarArchivo(doc, numeroNuevo, nombreNuevo);

        // 🔥 REINICIAR
        doc.close(SaveOptions.DONOTSAVECHANGES);
        app.open(new File(rutaBase));
    }
}

function reemplazarTextos(doc, numeroNuevo, nombreFirst, nombreLast, nombreNuevo, positionNueva, config) {

    for (var k = 0; k < doc.textFrames.length; k++) {

        var tf = doc.textFrames[k];

        // NUMERO
        if (tf.contents == "27") {
            tf.contents = (numeroNuevo != null && numeroNuevo !== "") 
            ? numeroNuevo 
            : " ";
        }
        /////CAMBIO DE FIRST
        if (tf.contents == "FIRST"){
            if (nombreFirst != "") {

                tf.contents = nombreFirst;
                // ajustarNombre(tf, doc, config);

            } else {
                tf.contents = " ";
            }
        }

        /////CAMBIO DE LAST
        if (tf.contents == "LAST"){
            if (nombreLast != "") {

                tf.contents = nombreLast;
                // ajustarNombre(tf, doc, config);

            } else {
                tf.contents = " ";
            }
        }

        // NAME
        if (tf.contents == "NAME") {

            if (nombreNuevo != "") {

                tf.contents = nombreNuevo;
                ajustarNombre(tf, doc, config);

            } else {
                tf.contents = " ";
            }
        }

        // POSITION
        if (tf.contents == "ATT" && positionNueva != "") {
            tf.contents = positionNueva;
        }
        else if (tf.contents == "ATT " && (positionNueva == "" || positionNueva == null)) {
            tf.contents = " ";
        }
    }
}

function ajustarNombre(tf, doc, config) {

    // 🔥 Reset base
    tf.textRange.characterAttributes.horizontalScale = 100;
    tf.textRange.characterAttributes.verticalScale = 100;

    var maxWidth = obtenerAnchoZonaSafe(doc);
    var maxHeight = obtenerAltoZonaSafe(doc);

    var buffer = 0.99;
    var minScale = 50; // límite de seguridad

    var scale;

    // 🔥 Definir escala inicial
    if (config.advanced) {
        scale = config.scale; // valor del usuario
    } else {
        scale = 100;
    }

    tf.textRange.characterAttributes.horizontalScale = scale;
    app.redraw();
    // 🔥 ORIENTACIÓN
    if (config.orientation == "Vertical") {

        if (maxHeight != null) {

            var alto = tf.height;

            if (alto > maxHeight) {
                // alert("⚠️ El texto es demasiado alto para la zona segura, se ajustará automáticamente.");
                var escala = (maxHeight / alto) * 100 * buffer;
                tf.textRange.characterAttributes.horizontalScale = escala;
            }

        } else {
            alert("⚠️ No se encontró ZONASAFE del texto, agrega un rectángulo con ese nombre para ajustar el tamaño del texto automáticamente.");
        }
    } else {

        if (maxWidth != null) {
            var ancho = tf.width;
            if (ancho > maxWidth) {
                var escala = (maxWidth / ancho) * 100 * buffer;
                tf.textRange.characterAttributes.horizontalScale = escala;
            }

        } else {
            alert("⚠️ No se encontró ZONASAFE del texto, agrega un rectángulo con ese nombre para ajustar el tamaño del texto automáticamente.");
        }
    }
}

function guardarArchivo(doc, numeroNuevo, nombreNuevo) {

    // Generar el nombre base
    var nombreOriginal = doc.name.replace(/\.pdf$/i, "");

    var nombreGuardar;

    if (numeroNuevo != null || numeroNuevo === 0) {
        nombreGuardar = nombreOriginal + " " + numeroNuevo + ".pdf";
    } 
    else if (nombreNuevo) {
        nombreGuardar = nombreOriginal + " " + nombreNuevo + ".pdf";
    }
    else {
        nombreGuardar = nombreOriginal + " SIN_DATOS.pdf";
    }

    var destino = new File(doc.path + "/" + nombreGuardar);

    // 🔥 TU lógica original (intacta)
    if (destino.exists) {

        if (nombreNuevo != "") {
            nombreGuardar = nombreOriginal + " " + numeroNuevo + " " + nombreNuevo + ".pdf";
        } else {
            nombreGuardar = nombreOriginal + " " + numeroNuevo + " DUP.pdf";
        }

        destino = new File(doc.path + "/" + nombreGuardar);
    }

    var contador = 1;

    while (destino.exists) {
        nombreGuardar = nombreGuardar.replace(/\.pdf$/i, "") + " (" + contador + ").pdf";
        destino = new File(doc.path + "/" + nombreGuardar);
        contador++;
    }

    var opciones = new PDFSaveOptions();
    doc.saveAs(destino, opciones);
}

function obtenerAnchoZonaSafe(doc) {

    for (var i = 0; i < doc.pageItems.length; i++) {

        var item = doc.pageItems[i];

        if (item.name == "ZONASAFE") {
            return item.width; // 👈 ya está en pulgadas si tu doc está en pulgadas
        }
    }

    return null;
}

function obtenerAltoZonaSafe(doc) {

    for (var i = 0; i < doc.pageItems.length; i++) {

        var item = doc.pageItems[i];

        if (item.name == "ZONASAFE") {
            return item.height; // 👈 ya está en pulgadas si tu doc está en pulgadas
        }
    }

    return null;
}

