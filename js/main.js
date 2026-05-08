// Esperar a que el DOM esté listo
// ES IMPORTANTE: Si usas "DOMContentLoaded", asegúrate de que tu script esté en el <head> o al inicio del <body>. Si está al final del <body>, no es necesario.
document.addEventListener("DOMContentLoaded", function () {

    document.body.style.display = "block";

    const csInterface = new CSInterface();

    const { exec } = require("child_process");

    // Click en "Procesar Excel"
    document.getElementById("btnProcesar").addEventListener("click", () => {

        // alert("Ejecutando script...");

        exec(`"/usr/local/bin/node" "/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/js/readExcel.js"`, (error, stdout, stderr) => {

            if (error) {
                console.error("Error de sistema:", error.message);
                resetPanel();
                return;
            }

            // 2. Manejo de la cancelación del usuario
            if (stdout.trim() === "CANCELLED") {
                console.error("El usuario canceló la selección.");
                resetPanel(); // Llamamos a la función que limpia el HTML
                return;
            }

            // 3. Si todo salió bien, cargamos el JSON
            cargarJSON();
        });

    });
    // Click en "Ejecutar Script Illustrator"
    document.getElementById("btnIllustrator").addEventListener("click", () => {
    if (document.getElementById("rosterName").textContent === "Sin cargar") {
        console.warn("Intentaste ejecutar el script sin cargar un archivo Excel.");
        return;
    }

    const scriptPath = '/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/jsx/RMC-Optimizador.jsx';
    
    // csInterface.evalScript(comando, callback)
        csInterface.evalScript(`$.evalFile("${scriptPath}")`, (result) => {
            
            // Verificamos si el resultado contiene la palabra SUCCESS
            if (result && result.indexOf("SUCCESS") !== -1) {
                // Creamos un array: ["SUCCESS", "SML", "T1600", "12", "77535-26..."]
                const data = result.split("|");
                
                const info = {
                    status:   data[0],
                    talla:    data[1],
                    estilo:   data[2],
                    cantidad: data[3],
                    archivo:  data[4]
                };

                // Tu Logger
                console.log(`✅ PROCESO COMPLETADO`);
                console.log(`-Talla [${info.talla}] | Estilo [${info.estilo}]`);
                console.log(`-Se generaron ${info.cantidad} archivos PDF.`);
                
            } else if (result === "ROSTER_ERROR") {
                console.error("El Roster del Excel no coincide con el ID del archivo abierto.");
                console.error(`-Roster en Excel: ${data.roster}`);
            } else if (result === "CANCELLED") {
                console.warn("Operación cancelada por el usuario.");
                
            } else {
                // Por si ocurre un error no controlado en el JSX
                console.error("❌ Error inesperado en el script de Illustrator:", result);
            }
        });
    });

    // Click en "Limpiar Consola"
    document.getElementById("btnClearLog").addEventListener("click", () => {
        document.getElementById("terminal").innerHTML = "";
        // Opcional: poner un mensaje de que se limpió/*  */
        // logger("Consola limpia", "info");
    });

});

function cargarJSON(){
    // ==========================
        // CARGAR JSON EN EL PANEL
        // ==========================

        const fs = require("fs");

        const jsonPath = "/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json";

        const rawData = fs.readFileSync(jsonPath, "utf8");

        const data = JSON.parse(rawData);

        document.getElementById("rosterName").textContent = data.roster;

        document.getElementById("totalPieces").textContent = data.totalPieces;

        console.log(data.roster + " - " + data.totalPieces + " piezas");
}

// Función para poner todo en "Por defecto"
function resetPanel() {
    document.getElementById("rosterName").textContent = "Sin cargar";
    document.getElementById("totalPieces").textContent = "0";
    // Si tienes una tabla de jugadores, también deberías limpiarla aquí
}