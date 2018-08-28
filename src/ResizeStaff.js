export default class Resize {
    constructor(staffId) {
        this.staff = document.getElementById(staffId);
    }

    drawInitialRect() {
        if (this.staff === null) return;
        let paths = Array.from(this.staff.getElementsByTagName("path"));
        let ulx, uly, lrx, lry;
        paths.forEach(path => {
            let box = path.getBBox();
            if (ulx === undefined || ulx > box.x) {
                ulx = box.x;
            }
            if (uly === undefined || uly > box.y) {
                uly = box.y;
            }
            if (lrx === undefined || lrx < box.x + box.width) {
                lrx = box.x + box.width;
            }
            if (lry === undefined || lry < box.y + box.height) {
                lry = box.y + box.height;
            }
        });

        d3.select("#" + this.staff.id).append("rect")
            .attr("x", ulx)
            .attr("y", uly)
            .attr("width", lrx - ulx)
            .attr("height", lry - uly)
            .attr("id", "resizeRect")
            .attr("stroke", "black")
            .attr("stroke-width", 4)
            .attr("fill", "none");
    }
}
