export function createSvgUrlFromCode(svgCode) {
  // Create a Blob object from the existing SVG string
  const blob = new Blob([svgCode], { type: "image/svg+xml" });

  // Create a URL from the Blob
  const svgUrl = URL.createObjectURL(blob);

  return svgUrl;
}

export const changeStrokeBasedOnTheme = (svgString, theme) => {
  const iconColor = theme.palette.mode === "dark" ? "#FFFFFF" : "#000000";
  let tempSvg = svgString.replace(
    /stroke:\s*#[0-9a-fA-F]+;/,
    `stroke:${iconColor};`
  );

  //regex to replace the fill color in the svg string
  tempSvg = tempSvg.replace(
    /(fill:\s*#(?:[0-9a-fA-F]{3}){1,2};)/,
    `fill: ${iconColor};`
  );

  // Regex to match all <path> elements and their 'fill' attributes
  const pathRegex = /<path([^>]*)>/gi;

  // tempSvg = tempSvg.replace(pathRegex, (match, pathContent) => {
  //   // Remove existing inline styles that set the fill color
  //   pathContent = pathContent.replace(/style="fill:[^"]*"/, "");

  //   // If the path already has a fill attribute, replace it
  //   if (pathContent.includes('fill="')) {
  //     return match.replace(/fill="[^"]*"/, `fill="${iconColor}"`);
  //   }

  //   // Otherwise, add the fill attribute
  //   return match.replace("<path", `<path fill="${iconColor}"`);
  // });
  return tempSvg;
};

// Function to calculate and return dynamic `d` attribute based on stroke width
function getDynamicPathD(originalD, scaleFactor) {
  return originalD.replace(/([0-9.-]+)/g, (match) => {
    // Scale each number by the scale factor (based on stroke width)
    return (parseFloat(match) * scaleFactor).toFixed(2);
  });
}

export function updateSVGString(svgString, strokeWidth) {
  // Parse the SVG string into a DOM object
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

  // Find all path elements in the parsed SVG
  const pathElements = svgDoc.querySelectorAll("path");

  // Apply transformations to the d attribute of each path
  pathElements.forEach((path) => {
    const originalD = path.getAttribute("d");
    const scaleFactor = 1 + (strokeWidth - 1) * 0.2; // Adjust scale factor based on stroke width
    const newD = getDynamicPathD(originalD, scaleFactor); // Get the new `d` value based on stroke width
    path.setAttribute("d", newD); // Update the path's d attribute
  });

  // Serialize the modified SVG back into a string
  const serializer = new XMLSerializer();
  const updatedSVGString = serializer.serializeToString(svgDoc.documentElement);

  return updatedSVGString;
}
