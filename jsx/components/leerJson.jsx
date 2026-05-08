function procesarJSON(targetSize, targetStyle, nombreArchivo) {
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
    for (var i = 0; i < players.length; i++) {
        // Validación de Talla y Variante (Estilo)
        if (players[i].size == targetSize && players[i].variant == targetStyle) {
            filtered.push(players[i]);
        }
    }

    alert("✅ Roster Validado: " + strJSON + 
          "\nTotal Pzs Excel: " + rootData.totalPieces + 
          "\nP piezas filtradas para esta acción: " + filtered.length);

    return filtered;
}