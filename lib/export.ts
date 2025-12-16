export const downloadSVG = (svgId: string, filename: string) => {
  const svgElement = document.getElementById(svgId);
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  // Add namespaces if missing
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPNG = (svgId: string, filename: string) => {
  const svgElement = document.getElementById(svgId);
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  
  const img = new Image();
  // Decode SVG for image source
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    // 2x scale for Retina/Sharpness
    const scale = 2; 
    canvas.width = 1000 * scale;
    canvas.height = 1000 * scale;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill black background for PNG (SVG is transparent by default usually, but we styled it black)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, 1000, 1000);

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
};
