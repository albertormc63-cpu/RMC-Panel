function procesarJSON(targetSize, targetStyle, nombreArchivo) {
    var file = new File("/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json");
    
    if (!file.exists) {
        alert("No se encontró el archivo JSON.");
        return "Error: No file";
    }

    file.open("r");
    var content = file.read();
    file.close();

    var rootData = eval("(" + content + ")");
    var players = rootData.players;
    var filtered = [];

    for (var i = 0; i < players.length; i++) {
        if (players[i].size == targetSize && players[i].variant == targetStyle) {
            filtered.push(players[i]);
        }
    }

    alert("Roster: " + rootData.roster + 
          "\nTotal: " + rootData.totalPieces + 
          "\nFiltrados: " + filtered.length);

    if(rootData.roster.indexOf(nombreArchivo) != -1) {
        alert("Archivo correcto: " + nombreArchivo);
    }

    // Retornamos un string para que main.js sepa que terminó
    return filtered;
}
