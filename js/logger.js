// alert(typeof require);
// Redirigir console.log al HTML automáticamente
const oldLog = console.log;
console.log = function (message) {
    logger(message, "info");
    oldLog.apply(console, arguments);
};

const oldError = console.error;
console.error = function (message) {
    logger(message, "error");
    oldError.apply(console, arguments);
};

const oldWarn = console.warn;
console.warn = function (message) {
    logger(message, "warning");
    oldWarn.apply(console, arguments);
};

function logger(mensaje, tipo = "info") {
    const terminal = document.getElementById("terminal");
    const nuevaLinea = document.createElement("div");
    
    // Agregar timestamp (hora actual)
    const ahora = new Date().toLocaleTimeString();
    
    nuevaLinea.textContent = `[${ahora}] ${mensaje}`;
    
    // Aplicar color según el tipo
    if (tipo === "error") nuevaLinea.className = "log-error";
    if (tipo === "success") nuevaLinea.className = "log-success";
    if (tipo === "warning") nuevaLinea.className = "log-warning";
    
    terminal.appendChild(nuevaLinea);
    
    // Auto-scroll al final
    terminal.scrollTop = terminal.scrollHeight;
}
