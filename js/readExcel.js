const { execSync } = require("child_process");
const XLSX = require("xlsx");
const fs = require("fs");
// Al principio de tu lógica en el panel
// const fs = require("fs");
const jsonPath = "/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json";

if (fs.existsSync(jsonPath)) {
    fs.unlinkSync(jsonPath); // Borra el archivo viejo antes de empezar
}
// Luego, el resto de tu código para abrir el selector y procesar el Excel
let filePath;

// 1. Abrir selector de archivos (Finder) con manejo de errores y filtros
try {
  // El parámetro 'of type' restringe a .xlsx y .xls
  filePath = execSync(`
    osascript -e 'POSIX path of (choose file with prompt "Selecciona el archivo Excel" of type {"org.openxmlformats.spreadsheetml.sheet", "com.microsoft.excel.xls"})'
  `).toString().trim();
  
  // console.log("📂 Archivo seleccionado:", filePath);

} catch (error) {
  // En lugar de salir en silencio, imprimimos un indicador
  console.log("CANCELLED"); 
  process.exit(0);
}

// Validación de seguridad extra por extensión
if (!filePath.toLowerCase().endsWith(".xlsx") && !filePath.toLowerCase().endsWith(".xls")) {
  console.error("❌ Error: El archivo seleccionado no tiene una extensión de Excel válida.");
  process.exit(1);
}

// 2. Leer Excel
try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // XLSX.utils.sheet_to_json con header:1 devuelve un array de arrays
  const data = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: ""
  });

  // Extraer Roster de A1 (Fila 0, Columna 0)
  const rosterName = data[0] ? data[0][0] : ""; 

  // Extraer Total Piezas de C14 (Fila 13, Columna 2)
  const totalUnits = data[13] ? data[13][2] : ""; 

  // 3. Headers (fila 16 -> índice 15)
  const headers = data[15];
  if (!headers) throw new Error("No se encontraron encabezados en la fila 16");

  const idxStyle = headers.indexOf("Style");
  const idxFirstName = headers.indexOf("First Name");
  const idxLastName = headers.indexOf("Last Name");
  const idxPlayer = headers.indexOf("Player#");
  const idxSize = headers.indexOf("Size");
  const idxPosition = headers.indexOf("Position");

  // 4. Filas de datos (a partir de la fila 17 -> índice 16)
  const rows = data.slice(16);

  const items = rows
    .filter(row => row[idxStyle])
    .map(row => ({
      style: row[idxStyle],
      variant: row[idxStyle] ? String(row[idxStyle]).slice(-1) : "",
      size: row[idxSize],
      firstName: row[idxFirstName],
      lastName: row[idxLastName],
      player: (row[idxPlayer] !== "" && row[idxPlayer] != null)
        ? String(row[idxPlayer]).replace(/\s+/g, "")
        : null,
      position: row[idxPosition]
    }));

  // --- ESTRUCTURA FINAL ---
  const finalResult = {
      roster: rosterName,
      totalPieces: totalUnits,
      players: items 
  };

  // 5. Guardar JSON en la ruta de la extensión RMC_PANEL
  const outputPath = "/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json";

  fs.writeFileSync(
      outputPath,
      JSON.stringify(finalResult, null, 2)
  );

  console.log("✅ JSON generado con éxito en:", outputPath);

} catch (err) {
  console.error("❌ Error al procesar el Excel:", err.message);
  process.exit(1);
}