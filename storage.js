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
        fileInfo.png = res.target.result;
        pngReady = true;
    }
    let file = e.target.files[0];
    if (file) {
        reader.readAsDataURL(file);
    }
};
document.getElementById("submit-storage").onclick = async (e) => {
    if (meiReady && pngReady) {
        const data = [
            { _id: "mei.original", data: fileInfo.mei },
            { _id: "mei", data: fileInfo.mei },
            { _id: "img", data: fileInfo.png }
        ];

        // Update with new documents
        let didError = false;
        await db.get("mei.original").catch((err) => {
            if (err.name === "not_found") {
                return {
                    _id: "mei.original",
                    data: ""
                };
            } else {
                throw err;
            }
        }).then((doc) => {
            doc.data = fileInfo.mei;
            return db.put(doc);
        }).catch((err) => { console.log(err); didError = true; });
        await db.get("mei").catch((err) => {
            if (err.name === "not_found") {
                return {
                    _id: "mei",
                    data: ""
                };
            } else {
                throw err;
            }
        }).then((doc) => {
            doc.data = fileInfo.mei;
            return db.put(doc);
        }).catch((err) => { console.log(err); didError = true; });
        await db.get("img").catch((err) => {
            if (err.name === "not_found") {
                return {
                    _id: "img",
                    data: ""
                };
            }
            else {
                throw err;
            }
        }).then((doc) => {
            doc.data = fileInfo.png;
            return db.put(doc);
        }).catch((err) => { console.log(err); didError = true; });
        if (!didError) {
            let editor = document.createElement("a");
            editor.setAttribute("href", "editor.html");
            editor.style.display = "none";
            document.body.append(editor);
            editor.click();
            document.body.removeChild(editor);
        }
    }
    else {
        // give alert
        console.warn("Missing either MEI or PNG file");
    }
};
