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
        csInterface.evalScript(
            '$.evalFile("/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/jsx/RMC-Optimizador.jsx")'
        );
    });

    // Click en "Limpiar Consola"
    document.getElementById("btnClearLog").addEventListener("click", () => {
        document.getElementById("terminal").innerHTML = "";
        // Opcional: poner un mensaje de que se limpió
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

        console.log(data);
}

// Función para poner todo en "Por defecto"
function resetPanel() {
    document.getElementById("rosterName").textContent = "Sin cargar";
    document.getElementById("totalPieces").textContent = "0";
    // Si tienes una tabla de jugadores, también deberías limpiarla aquí
}