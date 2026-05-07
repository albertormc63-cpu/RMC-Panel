const { execSync } = require("child_process");
const XLSX = require("xlsx");
const fs = require("fs");

// 1. Abrir selector de archivos (Finder)
const filePath = execSync(`
osascript -e 'POSIX path of (choose file with prompt "Selecciona el archivo Excel")'
`).toString().trim();

console.log("📂 Archivo seleccionado:", filePath);

// 2. Leer Excel
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: ""
});

// 3. Headers (fila 16)
const headers = data[15];

// índices fijos (siempre vienen igual)
const idxStyle = headers.indexOf("Style");
const idxFirstName = headers.indexOf("First Name");
const idxLastName = headers.indexOf("Last Name");
const idxPlayer = headers.indexOf("Player#");
const idxSize = headers.indexOf("Size");
const idxPosition = headers.indexOf("Position");

// 4. Filas reales
const rows = data.slice(16);

  const result = rows
  .filter(row => row[idxStyle])
  .map(row => ({
    style: row[idxStyle],
    // baseStyle: row[idxStyle].slice(0, -1),
    variant: row[idxStyle].slice(-1),
    size: row[idxSize],
    firstName: row[idxFirstName],
    lastName: row[idxLastName],
    // player: (row[idxPlayer] !== "") ? String(row[idxPlayer]).trim() : null,
    player: (row[idxPlayer] !== "" && row[idxPlayer] != null)
    ? String(row[idxPlayer]).replace(/\s+/g, "")
    : null,
    // player: (row[idxPlayer] !== "") ? Number(row[idxPlayer]) : null,
    position: row[idxPosition]
  }));

// 5. Guardar JSON
// fs.writeFileSync("output.json", JSON.stringify(result, null, 2));

// const outputPath = path.join(__dirname, "output.json");

const outputPath = "/Users/rmlsub1/Library/Application Support/Adobe/CEP/extensions/RMC_PANEL/output.json";

fs.writeFileSync(
    outputPath,
    JSON.stringify(result, null, 2)
);

console.log("✅ JSON generado correctamente");