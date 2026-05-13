function procesarJSON(targetSize, targetStyle, nombreArchivo) {
    // Ruta fija al archivo JSON generado por el script de Node.js
    // puede cambiar si se mueve el proyecto a otra computadora, pero siempre debe ser la carpeta "output.json" dentro de la extensión para que el JSX pueda leerlo después
    var file = new File("/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json");
    
    if (!file.exists) {
        alert("No se encontró el archivo JSON.");
        return [];
    }

    file.open("r");
    var content = file.read();
    file.close();

    // Usamos eval porque ExtendScript a veces no tiene JSON.parse nativo
    var rootData = eval("(" + content + ")");
    var players = rootData.players;

    // --- VALIDACIÓN DE ROSTER ---
    // Extraemos solo el número inicial (ej: "77535-26") de ambos lados
    var idRosterJSON = rootData.roster.match(/^[\d-]+/);
    var idRosterDoc  = nombreArchivo.match(/^[\d-]+/);

    // Convertimos a string y validamos que existan
    var strJSON = idRosterJSON ? idRosterJSON[0] : "No encontrado en JSON";
    var strDoc  = idRosterDoc ? idRosterDoc[0] : "No encontrado en Archivo";

    if (strJSON !== strDoc) {
        alert("❌ ERROR DE ROSTER\n\n" +
              "El archivo abierto no coincide con el Excel.\n\n" +
              "Roster en Excel: " + strJSON + "\n" +
              "Roster en Illustrator: " + strDoc);
        return []; // Detenemos el proceso devolviendo un arreglo vacío
    }
    // ----------------------------

    var filtered = [];
    var yaCompletados = 0; // Contador nuevo

    for (var i = 0; i < players.length; i++) {
        if (players[i].size == targetSize && players[i].variant == targetStyle) {
            // Si el jugador ya tiene la marca de completado en el JSON
            if (players[i].completed === true) {
                yaCompletados++;
            }
            filtered.push(players[i]);
        }
    }

    // SI YA ESTÁN MARCADOS, PREGUNTAR
    if (filtered.length > 0 && yaCompletados === filtered.length) {
        if (!confirm("⚠️ Esta combinación (" + targetSize + " - " + targetStyle + ") ya aparece como COMPLETADA.\n\n¿Deseas volver a generar los archivos?")) {
            return 0; // El usuario decidió no repetir
        }
    }

    alert("✅ Roster Validado: " + strJSON + 
          "\nTotal Pzs Excel: " + rootData.totalPieces + 
          "\nPiezas a procesar ahora: " + filtered.length);

    return filtered;
}