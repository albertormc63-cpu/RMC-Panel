var doc = app.activeDocument;

var lista = "🎨 MUESTRAS EN EL DOCUMENTO:\n\n";

for (var i = 0; i < doc.swatches.length; i++) {

    var swatch = doc.swatches[i];

    lista += "- " + swatch.name + "\n";
}

alert(lista);