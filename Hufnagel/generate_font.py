#! /usr/bin/env python
# -*- coding: utf-8 -*-

# generate_font.py
# generates FONTLOG.txt, OpenType font, and the font metadata JSON

import json
import sys

import fontforge


def validateGlyph(glyph):
    result = g.validate(True)
    report = ''
    if result & 0x1 or True:
        if result & 0x2:
            report += '- OPEN CONTOUR'
        if result & 0x4:
            report += '- INTERSECTION'
        if result & 0x8:
            report += '- WRONG DIRECTION'
        if result & 0x20:
            report += '- missing extrema'
        if result & 0x80:
            report += '- too many points'
        # if result & 0x200:
        #    report += '- invalid glyph name'
        if result & 0x40000:
            report += '- points too far apart'
        if result & 0x200000:
            report += '- DUPLICATE GLYPH NAME'
        if result & 0x400000:
            report += '- DUPLICATE UNICODE POINT'

        if report != '':
            print('%s (%#0.2x) issues: %s' %
                  (g.glyphname, glyph.unicode, report))
    return report


nargs = len(sys.argv)
fontFileName = ''
fontDir = ''
outDir = ''
if nargs != 2:
    fontFileName = 'Hufnagel.sfd'
    path = fontFileName

if fontFileName == '':
    fontFileName = sys.argv[1]
    path = fontFileName
try:
    font = fontforge.open(path)
except EnvironmentError:
    print("Can't open font file %s" % fontFileName)
    sys.exit(1)

# generating OpenType font:
print("Generating OpenType font")
font.generate(font.fontname+'.otf', '', 'opentype')
print("Generating TrueType font")
font.generate(font.fontname+'.ttf')
print("Generating WOFF2 font")
font.generate(font.fontname+'.woff2')
print("Generating SVG font")
font.generate(font.fontname+'.svg')
metadata = {'fontName': font.fontname, 'fontVersion': font.version}

# extracting font log
print("Extracting font log")
fontlog = open('FONTLOG.txt', 'w+')
n = fontlog.write(font.fontlog)
fontlog.close()

# Leipzig's engraving defaults:
engravingDefaults = {
    'arrowShaftThickness': 0.16,
    'barlineSeparation': 0.4,
    'beamSpacing': 0.25,
    'beamThickness': 0.5,
    'bracketThickness': 0.5,
    'dashedBarlineDashLength': 0.5,
    'dashedBarlineGapLength': 0.25,
    'dashedBarlineThickness': 0.16,
    'hairpinThickness': 0.16,
    'legerLineExtension': 0.27,
    'legerLineThickness': 0.16,
    'lyricLineThickness': 0.16,
    'octaveLineThickness': 0.16,
    'pedalLineThickness': 0.16,
    'repeatBarlineDotSeparation': 0.18,
    'repeatEndingLineThickness': 0.16,
    'slurEndpointThickness': 0.1,
    'slurMidpointThickness': 0.22,
    'staffLineThickness': 0.08,
    'stemThickness': 0.076,
    'subBracketThickness': 0.16,
    'textEnclosureThickness': 0.16,
    'thickBarlineThickness': 0.5,
    'thinBarlineThickness': 0.15,
    'tieEndpointThickness': 0.1,
    'tieMidpointThickness': 0.22,
    'tupletBracketThickness': 0.16,
    'hBarThickness': 1.0
}

metadata["engravingDefaults"] = engravingDefaults

with open('glyphnames.json') as smuflGlyphnamesFile:
    smuflGlyphnames = json.load(smuflGlyphnamesFile)
    codepoint_to_name = { data['codepoint']: name for name, data in smuflGlyphnames.items() }

glyphBBoxes = dict()
glyphsWithAnchors = dict()
count = 0
undefCount = 0
for glyph in font:
    g = font[glyph]

    try:
        g.glyphname = codepoint_to_name["U+" + hex(g.unicode)[2:].upper()]
    except KeyError:
        # glyph not in SMuFL range
        continue

    if g.unicode != -1 and g.unicode > 31:
        count += 1
        validateGlyph(g)
        g.addExtrema()
        bbox = [round(bb / 250., 4) for bb in g.boundingBox()]
        bBoxSW = (bbox[0], bbox[1])
        bBoxNE = (bbox[2], bbox[3])
        glyphBBoxes[g.glyphname] = {'bBoxNE': bBoxNE, 'bBoxSW': bBoxSW}
        if len(g.anchorPoints) > 0:
            anchors = dict()
            for item in g.anchorPoints:
                anchors[item[0]] = (round(item[2] / 250., 4),
                                    round(item[3] / 250., 4))
            glyphsWithAnchors[g.glyphname] = anchors
    elif g.unicode == -1:
        undefCount += 1
metadata["glyphBBoxes"] = glyphBBoxes
metadata["glyphsWithAnchors"] = glyphsWithAnchors

output = json.dumps(metadata, sort_keys=True, indent=4, separators=(',', ': '))
jsonFileName = outDir + font.fontname.lower() + "_metadata.json"
with open(jsonFileName, "w") as outfile:
    outfile.write(output)

font.close()
