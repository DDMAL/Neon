/** @module Cursor */

/**
 * Update the cursor to a crosshair.
 */
export function updateCursor() {
    $("#bgimg").css('cursor', 'crosshair');
    $("#mei_output").css('cursor', 'crosshair');

    /////TODO: Find a way to scale cursor image to the same sice as current svg mei output
    // var nc = d3.selectAll(".nc").node().getBBox();
    // var ncHeight = nc.height;
    // var ncWidth = nc.width;

    // var curViewBox = d3.select("#svg_group").attr("viewBox");
    // var curVbHeight = parseInt(curViewBox.split(" ")[3]);
    // var curVbWidth = parseInt(curViewBox.split(" ")[2]);

    // var imgHeight = this.origHeight/curVbHeight;
    // var imgScale = this.origWidth/curVbWidth;

    // var punctum = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="30" height="30" viewBox="0 0 300 300"><path d="M31,208.5c16.667-7,37-10.5,61-10.5c22.666,0,42.334,3.5,59,10.5s27.334,10.5,32,10.5V38 C171,12,140.666-1,92-1C42-1,11.333,12,0,38v181C4,219,14.333,215.5,31,208.5" transform="scale(' + imgScale + ')"/></svg>'

    // // var url = "url('" + punctum + "'), auto";

    // console.log(url);

    // $("#bgimg").css('cursor', url);
    // $("#mei_output").css('cursor', url);
}

/**
 * Reset the cursor to the typical pointer.
 */
export function resetCursor() {
    $("#bgimg").css('cursor', 'default');
    $("#mei_output").css('cursor', 'default');
}
