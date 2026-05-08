//Creado por Jose Alberto Villarreal - RMC Linares 2026
#include "components/dropdowns.jsx"
#include "components/leerJson.jsx"
#include "components/guardarPDFs.jsx"


function main() {
    var config = flujoControlado();
    if (config == null) {
        return "CANCELLED"; // El usuario cerró el diálogo inicial
    }

    var filtered = procesarJSON(config.size, config.style, config.nombreArchivo);
    
    // IMPORTANTE: procesarJSON debe devolver [] si el roster no coincide
    if (filtered.length === 0) {
        return "ROSTER_ERROR"; 
    }

    guardarPDFs(filtered, config);

    
    // Construimos el string: STATUS|TALLA|ESTILO|CANTIDAD|ARCHIVO
    // Usamos "|" como separador porque es raro encontrarlo en nombres de archivos
    var resumen = [
        "SUCCESS",
        config.size,
        config.style,
        filtered.length,
        config.nombreArchivo
    ];
    // app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

    return resumen.join("|");
}

// Ejecutamos la función para que evalScript reciba el return
main();