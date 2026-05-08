var doc = app.activeDocument;
var nombreArchivo = doc.name;


// ==============================
// DIÁLOGO
// ==============================
function dialogDropdowns() {

    var win = new Window("dialog", "Configuración de proceso");

    var grupo = win.add("group");
    grupo.orientation = "column";
    grupo.alignChildren = ["left", "center"];

    // STYLE
    var styleGroup = grupo.add("group");
    styleGroup.add("statictext", undefined, "Style:");
    var styleDropdown = styleGroup.add("dropdownlist", undefined, ["A", "W", "Y", "G", "I"]);
    styleDropdown.selection = 0;

    // SIZE
    var sizeGroup = grupo.add("group");
    sizeGroup.add("statictext", undefined, "Size:");
    var sizeDropdown = sizeGroup.add("dropdownlist", undefined, [
        "XSM","SML","MED","LGE","XLG","2XL","3XL","4XL", "ALL"
        // "XSM","SML","MED","LGE","XLG","2XL","3XL","4XL", "ALL", "M/L", "L/X", "X/S"
    ]);
    sizeDropdown.selection = 0;

    //=========================
    // ===== OPCIONES AVANZADAS
    //=========================
        var advPanel = grupo.add("panel", undefined, "Opciones avanzadas");
        advPanel.orientation = "column";
        advPanel.alignChildren = ["left", "center"];

        // Checkbox activar
        var advCheckbox = advPanel.add("checkbox", undefined, "Activar opciones avanzadas");

        // Grupo interno
        var advGroup = advPanel.add("group");
        advGroup.orientation = "column";

        // Dirección del texto
        var orientGroup = advGroup.add("group");
        orientGroup.add("statictext", undefined, "Orientación texto:");

        var orientDropdown = orientGroup.add("dropdownlist", undefined, ["Horizontal", "Vertical"]);
        orientDropdown.selection = 0;

        // Escala manual
        var scaleGroup = advGroup.add("group");
        scaleGroup.add("statictext", undefined, "Horizontal Scale:");

        var scaleInput = scaleGroup.add("edittext", undefined, "100");
        scaleInput.characters = 5;

        // Desactivar por defecto
        advGroup.enabled = false;

        // Toggle
        advCheckbox.onClick = function () {
            advGroup.enabled = advCheckbox.value;
        };
        
    //=========================
    // BOTONES
    //=========================
    var btnGroup = grupo.add("group");
    btnGroup.alignment = "right";

    btnGroup.add("button", undefined, "Procesar", {name: "ok"});
    btnGroup.add("button", undefined, "Cancelar", {name: "cancel"});

    // RESULTADO
    if (win.show() == 1) {

        return {
            style: styleDropdown.selection.text,
            size: sizeDropdown.selection.text,
            advanced: advCheckbox.value,
            orientation: orientDropdown.selection.text,
            scale: advCheckbox.value ? Number(scaleInput.text) : 100,
            nombreArchivo: nombreArchivo
        };

    } else {

        return null;
    }
}


// ==============================
// VALIDACIÓN
// ==============================
function validarArchivo(style, size) {

    if (
        nombreArchivo.indexOf(style) == -1 ||
        nombreArchivo.indexOf(size) == -1
    ) {
        return false;
    }

    return true;
}


// ==============================
// FLUJO CONTROLADO
// ==============================
var config;
function flujoControlado(){
    while (true) {

        config = dialogDropdowns();

        if (config == null) {
            // alert("Proceso cancelado.");
            return null;
        }

        if (validarArchivo(config.style, config.size)) {
            // alert(config.style + " - " + config.size + " Orientacion: " + config.orientation + " Escala: " + config.scale);
            break; // ✅ sale del loop si todo está bien
        }

        alert("⚠️ El archivo no coincide.\n *Verifica escritura de  talla \n XSM - SML - MED - LGE - XLG - 2XL - 3XL - 4XL \n *Verifica escritura de estilo \n A - W - Y - G - I");

    }
    return config;
}



