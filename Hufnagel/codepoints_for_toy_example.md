# Hufnagel 字型 — Code point 整理（給 FontForge 畫字用）

對象：`Hufnag.toy.example/Hufnag toy example.mei`
目的：列出這個 toy example 在 Neon/Verovio 渲染時會用到的所有 SMuFL glyph，方便在 FontForge 裡逐一畫出來。

資料來源（皆已交叉比對）：
- MEI 檔本身的 `@tilt / @curve / <liquescent> / @con` 等屬性
- Verovio 選字邏輯：`src/calcligatureorneumeposfunctor.cpp`（neume/nc）、`src/clef.cpp`、`src/custos.cpp`、`src/view_neume.cpp`（divLine）
- SMuFL 名稱與 code point：`Hufnagel/glyphnames.json`、W3C SMuFL 1.3 plainchant 頁面

---

## 一、總清單（toy example 實際需要的字符）

只需 **11 個 glyph**。很多 neume 類型（podatus / clivis / torculus）其實是用同一批基本字拼出來的。

| Code point | SMuFL 名稱 | 中文/說明 | 類別 | 字型現況 |
|---|---|---|---|---|
| U+E990 | `chantPunctum` | Punctum（方形音符） | 音符 | ✅ 已畫 |
| U+E996 | `chantPunctumVirga` | Virga（帶下行尾的 punctum） | 音符 | ✅ 已畫 |
| U+E997 | `chantPunctumVirgaReversed` | Virga reversed（尾朝上） | 音符 | ✅ 已畫 |
| U+E994 | `chantAuctumAsc` | Punctum auctum, ascending（上行 liquescent） | 音符 | ⬜ 待畫 |
| U+E995 | `chantAuctumDesc` | Punctum auctum, descending（下行 liquescent） | 音符 | ⬜ 待畫 |
| U+E9BE | `chantConnectingLineAsc3rd` | 連接線（liquescent 的尾巴用） | 連接線 | ⬜ 待畫 |
| U+E906 | `chantCclef` | C 譜號 | 譜號 | ⬜ 待畫 |
| U+E902 | `chantFclef` | F 譜號 | 譜號 | ⬜ 待畫 |
| U+E8F4 | `chantDivisioMaior` | 分句線 maior | 分句線 | ⬜ 待畫 |
| U+E8F5 | `chantDivisioMaxima` | 分句線 maxima | 分句線 | ⬜ 待畫 |
| U+EA06 | `chantCustosStemUpPosMiddle` | Custos（行末導示） | custos | ✅ 已畫 |

字型現況依據 `Hufnagel.sfd`，目前已含 4 個字符：E990、E996、E997、EA06。
**toy example 還缺 7 個：E994、E995、E9BE、E906、E902、E8F4、E8F5。**

---

## 二、每個 neume → glyph 對應（逐一拆解）

下表是 MEI 裡每個 `<syllable>`（音節）對應的圖形，以及 Verovio 怎麼把它拆成 SMuFL 字符。
判斷規則：`<liquescent>` 子元素 + `@curve` 決定 liquescent；否則看 `@tilt`（s→virga、n→virga reversed、無→punctum）。

| MEI syl 標籤 | nc 屬性 | 拆成的 glyph |
|---|---|---|
| `punctum` | d，無 tilt | E990 |
| `virga` | c，tilt=s | E996 |
| `liquescent.up` | b，curve=a，liquescent | E994 (+ E9BE×2 尾巴) |
| `liquescent.down` | b，curve=c，liquescent | E995 (+ E9BE×2 尾巴) |
| `distropha` | b、b，無 tilt、**無 strophicus 子元素** | E990 + E990 ⚠️ |
| `podatus2/3/4/5` | 低音無 tilt + 高音 tilt=s | E990 + E996 |
| `clivis2a/3a/4a/5a` | 第1音 tilt=s + 第2音 tilt=n, con=e | E996 + E997 |
| `clivis2b/3b/4b/5b` | 第1音無 tilt + 第2音 tilt=n | E990 + E997 |
| `torculus22/23/33/42` | 無 tilt + tilt=s + tilt=n(con=e) | E990 + E996 + E997 |

另外整頁還有（非 neume，但 toy example 有用到）：
- 兩個譜號：`shape="F"` → E902、`shape="C"` → E906
- 兩條分句線：`form="maxima"` → E8F5、`form="maior"` → E8F4
- 一個 custos（行末，pname=a）→ EA06

---

## 三、給你畫字時的重點提醒

1. **真正要新畫的只有 7 個**（見第一節 ⬜）。其中音符類只有 2 個 liquescent（E994 上行、E995 下行）＋ 連接線 E9BE。

2. **podatus / clivis / torculus 不必各自畫**。它們都是 E990 / E996 / E997 三個基本字 + 位置位移拼出來的，所以畫好這三個基本字（已完成）就涵蓋了所有這些 ligature 的「組成元件」。Verovio 靠 `m_yOffset` 把上下音錯位，不是靠獨立 glyph。

3. **⚠️ `distropha` 目前不是 strophicus**。MEI 裡這個音節沒有 `<strophicus>` 子元素，所以 Verovio 會當成兩個普通 punctum（E990）畫，而不是 `chantStrophicus`(E99F) 或 `medRenStrophicusCMN`(EA29)。如果你預期它要長成 strophicus，要回去改 MEI（加 `<strophicus>`），不是改字型。

4. **liquescent 的尾巴（E9BE）**：Verovio 預設 (`liquescentWithoutTails=false`) 會在 auctum 字後面再疊兩段連接線當尾巴。若 Neon 端開了 no-tails 選項，就只需要 E994/E995 本體，可暫時不畫 E9BE。

5. **bounding box**：目前 `hufnagel_metadata.json` 只有 `chantPunctum` 的 bBox。新畫的字存進 `.sfd` 後，跑 `generate_font.py` 會自動依 glyph 重算 bBox 並輸出 otf/ttf/woff2/svg 與 metadata，不用手填。

---

## 五、Ligature（合併斜線）專用格子 — toggle ligature 才會用到

clivis 2a~5a 在 toggle ligature 後，會變成「一條斜線」的單一圖形。
畫法：把完整斜線圖形畫進「斜線格」，對應的「entry line 格」做成空白零寬字。

| clivis | 下行音程 | 斜線格（畫圖形） | SMuFL 名稱 | entry line 格（做空白零寬） | SMuFL 名稱 | 字型現況 |
|---|---|---|---|---|---|---|
| 2a | 2度 | U+E9B9 | `chantLigaturaDesc2nd` | U+E9B4 | `chantEntryLineAsc2nd` | ⬜ 待畫 |
| 3a | 3度 | U+E9BA | `chantLigaturaDesc3rd` | U+E9B5 | `chantEntryLineAsc3rd` | ⬜ 待畫 |
| 4a | 4度 | U+E9BB | `chantLigaturaDesc4th` | U+E9B6 | `chantEntryLineAsc4th` | ⬜ 待畫 |
| 5a | 5度 | U+E9BC | `chantLigaturaDesc5th` | U+E9B7 | `chantEntryLineAsc5th` | ⬜ 待畫 |

要點：
- **E9B9 / E9BA / E9BB / E9BC**：畫整條 oblique 斜線。
- **E9B4 / E9B5 / E9B6 / E9B7**：做成空白零寬字（無輪廓、Width=0），避免 Verovio 在第一音位置多畫東西。
- **E9B8**（entry line 6度）目前用不到，之後若加下行六度 clivis 再補。
- 依據：Neon `src/utils/Select.ts` 用 `E9B[45678]`（第一半）與 `E9B[9ABC]`（第二半）認 ligature；Verovio `calcligatureorneumeposfunctor.cpp` 依下行音程選字。

空白零寬字的 .sfd 寫法（沒有 SplineSet 區塊即空白）：

```
StartChar: uniE9B4
Encoding: 59828 59828 4
Width: 0
Flags: W
LayerCount: 2
EndChar
```

---

## 六、關於 Google 試算表

`Copy of Hufnagelschrift examples` 這份試算表內容是以圖片/canvas 呈現，純文字與 CSV 匯出都抓不到內容，研判是 Hufnagel 字形的**視覺範例圖**（給你比對字該長什麼樣），不是 code point 對照表。若你要我把裡面的範例圖也納進來比對，麻煩把圖片貼上來或截圖給我。
