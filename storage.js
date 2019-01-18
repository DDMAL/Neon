var meiReady = false,
    pngReady = false;

var fileInfo = {
    mei: "",
    png: ""
};

var db = new PouchDB("Neon2");

document.getElementById("mei-file").onchange = (e) => {
    let reader = new FileReader();
    meiReady = false;
    reader.onload = (res) => {
        fileInfo.mei = res.target.result;
        meiReady = true;
    }
    let file = e.target.files[0];
    if (file) {
        reader.readAsText(file);
    }
};
document.getElementById("png-file").onchange = (e) => {
    let reader = new FileReader();
    pngReady = false;
    reader.onload = (res) => {
        fileInfo.png = res.target.result.split(",")[1];
        console.log(res.target.result);
        pngReady = true;
    }
    let file = e.target.files[0];
    if (file) {
        reader.readAsDataURL(file);
    }
};
document.getElementById("submit-storage").onclick = (e) => {
    if (meiReady && pngReady) {
        const data = [
            { name: "mei.original", data: fileInfo.mei },
            { name: "mei", data: fileInfo.mei },
            { name: "img", data: fileInfo.png }
        ];

        db.put(
            {
                _id: "mei.original",
                data: fileInfo.mei
            }, (err, result) => {
                if (err) { console.error("Failed to store the original MEI"); }
                else {
                   db.put(
                       {
                           _id: "mei",
                           data: fileInfo.mei
                       }, (err, result) => {
                           if (err) { console.error("Failed to store the MEI"); }
                           else {
                               db.put(
                                   {
                                       _id: "img",
                                       data: fileInfo.png
                                   }, (err, result) => {
                                       if (err) { console.error("Failed to store the background image"); }
                                       else {
                                           let editor = document.createElement("a");
                                           editor.setAttribute("href", "editor.html");
                                           editor.style.display = "none";
                                           document.body.append(editor);
                                           editor.click();
                                           document.body.removeChild(editor);
                                       }
                                   }
                               );
                           }
                       }
                   );
                }
            }
        );
    }
    else {
        // give alert
        console.warn("Missing either MEI or PNG file");
    }
};
