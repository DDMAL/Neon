#!/bin/bash
context="\"https://ddmal.music.mcgill.ca/Neon/contexts/1/manifest.jsonld\""
options=""
mkdir -p ../manifests

for file in ../mei/*.mei; do
    filename=$(basename "$file" .mei);
    background="${filename}.png"
    if [[ -f "../img/${background}" ]]; then
        id="https://ddmal.music.mcgill.ca/Neon/manifests/${filename}.jsonld"
        options="${options}\n\"${filename}\","
        echo "{\"@context\":$context,\"@id\":\"$id\",\"title\":\"$filename\",\"image\":\"img/$filename.png\",\"timestamp\":\"$(date +%Y-%m-%dT%H:%M%S%z)\",\"mei_annotations\":[{\"id\":\"$(uuidgen)\",\"type\":\"Annotation\",\"body\":\"mei/$filename.mei\",\"target\":\"img/$filename.png\"}]}" > ../manifests/$filename.jsonld
    fi
done

printf "const selectionOptions = [" > ../index.js
printf "$options" >> ../index.js
printf "];\n" >> ../index.js
cat index-end.js >> ../index.js
