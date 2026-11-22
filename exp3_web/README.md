# 實驗三：人格測驗＋社群情境（GitHub Pages × Qualtrics）

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 正式網頁。依網址參數決定模式（見下方）。 |
| `demo.html` | 給自己看的展示版：上方有工具列，可指定組別、順序、拉丁方格。 |
| `qualtrics/quiz_question.js` | 貼在 Qualtrics「人格測驗」那一題的 JavaScript。 |
| `qualtrics/trial_question.js` | 貼在 Loop & Merge 區塊裡「社群畫面」那一題的 JavaScript。 |
| `qualtrics/mock_qualtrics.html` | 本機測試用：模擬 Qualtrics，原封不動地跑上面兩段 JavaScript。 |

### `index.html` 的三種模式

- `?mode=quiz`：只做 Mini-IPIP 和結果頁，按「完成」把分數傳回 Qualtrics。
- `?mode=trial&t=1&cond=…&order=…&list=…&so=…&seed=…&E=…&A=…&C=…&N=…&O=…`：只跑一位目標人物（個人頁、貼文頁、相似性題目，不含道德判斷），結束後把資料傳回 Qualtrics。參數由 `trial_question.js` 自動帶入。
- 沒有 `mode`：完整展示流程（含 7 點恰當性評分），資料顯示在最後一頁。

## 一、放上 GitHub Pages

1. 在 GitHub 開一個新的 repository（例如 `exp3`），把 `index.html`、`demo.html`、`qualtrics/` 上傳。
2. Settings → Pages → Source 選 `Deploy from a branch`，branch 選 `main`、資料夾選 `/ (root)`，存檔。
3. 等一兩分鐘，網址會是 `https://你的帳號.github.io/exp3/`。先直接打開 `demo.html` 確認能跑。
4. 把兩個 Qualtrics JavaScript 檔案最上面的 `BASE_URL` 改成這個網址（結尾要有 `/`）。

## 二、Qualtrics 設定

### 先確認版面：Simple layout（新版）要多一個步驟

在 Survey → Look & Feel → Layout 可以看到用的是哪種版面。

- **Simple layout**：JavaScript 存的欄位，Qualtrics 只接受 `__js_` 開頭的名稱。宣告欄位請用 `qualtrics/embedded_data_fields_simple_layout.txt`（`cond`、`order`、`list`、`gender` 不加前綴，其他都加 `__js_`）。道德判斷頁的 piping 也要用 `__js_` 版本：`${e://Field/__js_current_handle}`、`${e://Field/__js_current_post_text}`。
- **其他版面（Flat、Classic 等）**：用 `qualtrics/embedded_data_fields.txt`，名稱不加前綴。

兩支 JavaScript 兩種版面都能用，不用改。

### Survey Flow（由上到下）

1. **Embedded Data**：宣告下面所有欄位（值留空）。沒有宣告的欄位，JavaScript 存不進去。完整清單一行一個，在 `qualtrics/embedded_data_fields.txt`。
   - 分派：`cond`、`order`、`list`、`gender`
   - 人格測驗：`seed`、`scen_order`、`self_E`、`self_A`、`self_C`、`self_N`、`self_O`、`ipip_1` … `ipip_20`
   - 每個 trial（`t1_`、`t2_`、`t3_` 各一組，每組 14 個）：`target_E`、`target_A`、`target_C`、`target_N`、`target_O`、`ps`、`ti_E`、`ti_A`、`ti_C`、`ti_N`、`ti_O`、`profile_ms`、`post_ms`、`ps_ms`
   - 其他：`current_post_text`、`current_handle`、`trial_error`
2. **Randomizer**：放 12 個 Embedded Data 元素，每個設定一組 `cond`、`order`、`list`（2 × 2 × 3），Randomly present **1**，勾選 **Evenly Present**。
   - `cond`：`similar` / `dissimilar`
   - `order`：`profileFirst` / `behaviorFirst`
   - `list`：`1` / `2` / `3`
3. 知情同意、人口變項等區塊。性別題一定要放在人格測驗之前。
   - 性別題後面接兩個 **Branch**：選「男」→ Embedded Data `gender` = `m`；選「女」→ `gender` = `f`。其他選項不用設定，網頁會改用看不出性別的帳號。
   - 帳號：男 `kevin_0412`、`jason.lin`、`eric_hsu23`；女 `amy_0412`、`vivian.lin`、`emily_hsu23`；其他 `rainyday_0412`、`midnight.noodle`、`sleepy_hsu23`（依 trial 位置固定，見 index.html 的 `HANDLE_SETS`）。
4. **人格測驗區塊**：一題 Text / Graphic（內容可以留空），JavaScript 貼 `quiz_question.js`。
5. **Loop & Merge 區塊**（3 輪，Field 1 依序填 `1`、`2`、`3`，**不要**勾選隨機順序；情境順序已經由網頁隨機決定）：
   - 第 1 頁：一題 Text / Graphic，JavaScript 貼 `trial_question.js`。
   - 換頁（Page Break）。
   - 第 2 頁起：道德判斷題（可直接從實驗二複製）。題目上方放這段文字，讓受試者看得到貼文：
     ```
     ${e://Field/current_handle} 的貼文：
     ${e://Field/current_post_text}
     ```
6. 後測、操弄檢核、懷疑探測、事後說明。

### 資料對照

- Loop & Merge 裡的道德判斷題，Qualtrics 匯出時會加上 `1_`、`2_`、`3_` 前綴，對應 `t1_`、`t2_`、`t3_`。
- 每個 trial 的情境：`scen_order` 的第 n 個；動機：用 `list` 和情境查 `LATIN`（見下表）。
- `ti_*`：對目標人物作答的 Mini-IPIP 題，原始分數 1–5、未反向計分，題號見 index.html 的 `TARGET_ITEMS`（E 6、A 2、C 8、N 4、O 20），可直接跟同題號的 `ipip_*` 比。
- 客觀距離（MAD、剖面相關）用 `self_*` 和 `target_*` 在 R 裡算。

| list | 雨傘 umbrella | 組內互評 report | 工作 work |
|---|---|---|---|
| 1 | 過失 negligence | 自私 selfish | 惡意 malicious |
| 2 | 自私 selfish | 惡意 malicious | 過失 negligence |
| 3 | 惡意 malicious | 過失 negligence | 自私 selfish |

## 三、測試

### 本機（不用上傳）

在這個資料夾開一個本機伺服器，再打開模擬頁面：

```
python3 -m http.server 8765
```

瀏覽器打開 `http://localhost:8765/qualtrics/mock_qualtrics.html?cond=dissimilar&order=behaviorFirst&list=2`，
從人格測驗一路做到三個 trial 結束，下方會即時顯示存進 embedded data 的值。

### 正式上線前

1. 先在 Qualtrics 做一個只有「人格測驗」一題的測試問卷，確認：網頁有出現、高度會自動調整、按「完成」後「下一頁」按鈕會出現、匯出的資料裡有 `self_E` 等欄位。
2. 再接上 Loop & Merge，跑完整流程，用手機和電腦各試一次。
3. 匯出資料，確認 `t1_` … `t3_` 都有值。如果 `trial_error` 有值，代表某些參數沒傳進去（通常是欄位沒在 Survey Flow 宣告）。

## 四、生成規則（摘要）

- 目標剖面：`makeTargetProfileV3()`，參數在 `V3_OPTS`。三位目標輪流擔任不同角色，彼此不同但維持高／低相似。
- 拉丁方格：`LATIN`；情境貼文：`SCENARIOS`；填充貼文：`FILLERS`。
- 同一位受試者的三個 trial 用同一個 `seed`，所以分開載入也會得到一致的填充貼文和目標剖面。
