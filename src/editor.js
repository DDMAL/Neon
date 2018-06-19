import { Neon } from './Neon.js';
import './bulma-slider.min.css';
import './bulma-slider.min.js';

function writeBody () {
    var columns = document.createElement("div");
    columns.className = "columns";
    
    var svgOutput = document.createElement("div");
    svgOutput.className = "column is-two-thirds box";
    svgOutput.id = "svg_output";
    svgOutput.setAttribute("style", "overflow: 'hidden'");
    columns.appendChild(svgOutput);

    var sideBar = document.createElement("div");
    sideBar.className = "column is-one-third";
    
    var panel = document.createElement("div");
    panel.className = "panel";

    var controls = document.createElement("p");
    controls.className = "panel-heading";
    controls.innerHTML = "Controls";
    panel.appendChild(controls);

    var zoomBlock = document.createElement("a");
    zoomBlock.className = "panel-block has-text-centered";

    var button = document.createElement("button");
    button.className = "button";
    button.id = "reset-zoom";
    button.innerHTML = "Zoom";
    zoomBlock.appendChild(button);

    var input = document.createElement("input");
    input.className = "slider is-fullwidth";
    input.id = "zoomSlider";
    input.setAttribute("step", "5");
    input.setAttribute("min", "25");
    input.setAttribute("max", "200");
    input.setAttribute("value", "100");
    input.setAttribute("type", "range");
    zoomBlock.appendChild(input);

    var output = document.createElement("output");
    output.id = "zoomOutput";
    output.setAttribute("for", "zoomSlider");
    output.innerHTML = "100";
    zoomBlock.appendChild(output);
    
    panel.appendChild(zoomBlock);

    var neumeBlock = document.createElement("a");
    neumeBlock.className = "panel-block has-text-centered";

    var button2 = button.cloneNode();
    button2.id = "reset-opacity";
    button2.innerHTML = "Neume Opacity";
    neumeBlock.appendChild(button2);

    var input2 = input.cloneNode();
    input2.id = "opacitySlider";
    input2.setAttribute("min", "0");
    input2.setAttribute("max", "100");
    input2.setAttribute("value", "100");
    neumeBlock.appendChild(input2);

    var output2 = output.cloneNode();
    output2.id = "opacityOutput";
    output2.setAttribute("for", "opacitySlider");
    output2.innerHTML = "100";
    neumeBlock.appendChild(output2);

    panel.appendChild(neumeBlock);

    var bgBlock = document.createElement("a");
    bgBlock.className = "panel-block has-text-centered";

    var button3 = button2.cloneNode();
    button3.id = "reset-bg-opacity";
    button3.innerHTML = "Image Opacity";
    bgBlock.appendChild(button3);

    var input3 = input2.cloneNode();
    input3.id = "bgOpacitySlider";
    bgBlock.appendChild(input3);

    var output3 = output2.cloneNode();
    output3.id = "bgOpacityOutput";
    output3.setAttribute("for", "bgOpacitySlider");
    output3.innerHTML = "100";
    bgBlock.appendChild(output3);

    panel.appendChild(bgBlock);

    var textBlock = document.createElement("a");
    textBlock.className = "panel-block";

    var label = document.createElement("label");
    label.className = "checkbox";
    label.innerHTML = "Display Text:";
    var inner = document.createElement("input");
    inner.className = "checkbox";
    inner.id = "displayText";
    inner.setAttribute("type", "checkbox");
    label.appendChild(inner);
    textBlock.appendChild(label);
    panel.appendChild(textBlock);

    sideBar.appendChild(panel);

    var info = document.createElement("div");
    info.id = "neume_info";
    sideBar.appendChild(info);
    columns.appendChild(sideBar);

    return columns;
}

document.body.appendChild(writeBody());

var neon = new Neon({
    meifile: meiFile,
    bgimg: bgImg,
});
