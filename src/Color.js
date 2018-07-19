/** @module Color*/

/**
 * Highlight each staff a different color.
 */
export function setStaffHighlight() {
    let staves = Array.from(document.getElementsByClassName("staff"));
    for (var i = 0; i < staves.length; i++) {
        let staffColor = ColorPalette[i % ColorPalette.length];
        highlight(staves[i], staffColor);
    }
}

/**
 * Remove the highlight from each staff.
 */
export function unsetStaffHighlight() {
    unhighlight(".staff");
}

/**
 * Highlight a staff a certain color.
 * @param {SVGSVGElement} staff - The staff's SVG element.
 * @param {string} color - The color to highlight the staff.
 */
export function highlight(staff, color) {
    let children = Array.from($("#" + staff.id).children());
    children.forEach(child => {
        if (child.tagName === "path") {
            child.setAttribute("stroke", color);
        } else {
            child.setAttribute("fill", color);
        }
        $(child).addClass("highlighted");
    });
}

/**
 * Remove the highlight from a staff.
 * @param {(SVGSVGElement|string)} staff - The staff's SVG element or a JQuery selector.
 */
export function unhighlight(staff) {
    let children = Array.from($(staff).children(".highlighted"));
    children.forEach(elem => {
        if (elem.tagName === "path") {
            elem.setAttribute("stroke", "#000000");
        } else {
            elem.removeAttribute("fill");
        }
    });
    $(staff).children(".highlighted").removeClass("highlighted");
}
    
/**
 * Color palette from Figure 2 (Colors optimized for color-blind
 * individuals) from "Points of view: Color blindness" by Bang Wong
 * published in Nature Methods volume 8 on 27 May 2011
 * https://www.nature.com/articles/nmeth.1618?WT.ec_id=NMETH-201106
 */
ColorStaves.Colors = [ 
    "rgb(0,0,0)",
    "rgb(230, 159, 0)",
    "rgb(86, 180, 233)",
    "rgb(0, 158, 115)",
    "rgb(240, 228, 66)",
    "rgb(0, 114, 178)",
    "rgb(213, 94, 0)",
    "rgb(204, 121, 167)"
];
