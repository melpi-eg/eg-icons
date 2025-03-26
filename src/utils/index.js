export function createSvgUrlFromCode(svgCode) {
  // Create a Blob object from the existing SVG string
  const blob = new Blob([svgCode], { type: "image/svg+xml" });

  // Create a URL from the Blob
  const svgUrl = URL.createObjectURL(blob);

  return svgUrl;
}
