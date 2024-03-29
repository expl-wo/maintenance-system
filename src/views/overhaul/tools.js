export const downLoadBlob = (filename, blob) => {
    const a = document.createElement("a");
    const URL = window.URL || window.webkitURL;
    const herf = URL.createObjectURL(blob);
    a.href = herf;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(herf);
}