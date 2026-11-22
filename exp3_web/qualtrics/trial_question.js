/* ===== 貼在 Loop & Merge 區塊裡「社群畫面」那一題（Text / Graphic 題型）的 JavaScript =====
   作用：依照這一輪的 trial 編號嵌入網頁，跑完一位目標人物（個人頁、貼文頁、相似性題目），
         把資料存進 embedded data（t1_…、t2_…、t3_…，以及 current_post_text），再顯示「下一頁」按鈕。
   使用前：把 BASE_URL 改成你的 GitHub Pages 網址（結尾要有 /）。
   Loop & Merge 的第 1 欄（Field 1）填 1、2、3。 */
Qualtrics.SurveyEngine.addOnload(function () {
  var BASE_URL = "https://the-magical-cui.github.io/exp_3/exp3_web/";
  var q = this;
  // 存 embedded data：新版版面（Simple layout）只能用 setJSEmbeddedData，存成 __js_ 開頭的欄位；
  // 舊版版面用 setEmbeddedData。兩個都呼叫，哪種版面都存得到。
  function saveED(k, v) {
    var SE = Qualtrics.SurveyEngine;
    if (typeof SE.setJSEmbeddedData === "function") { try { SE.setJSEmbeddedData(k, v); } catch (err) {} }
    if (typeof SE.setEmbeddedData === "function") { try { SE.setEmbeddedData(k, v); } catch (err) {} }
  }
  q.hideNextButton();

  // 人格測驗存的欄位：舊版版面叫 self_E，新版版面叫 __js_self_E，哪個有值就用哪個
  function pick(a, b) { return a !== "" ? a : b; }
  var p = {
    mode: "trial",
    t: "${lm://Field/1}",
    cond: "${e://Field/cond}",
    order: "${e://Field/order}",
    list: "${e://Field/list}",
    so: pick("${e://Field/scen_order}", "${e://Field/__js_scen_order}"),
    seed: pick("${e://Field/seed}", "${e://Field/__js_seed}"),
    E: pick("${e://Field/self_E}", "${e://Field/__js_self_E}"),
    A: pick("${e://Field/self_A}", "${e://Field/__js_self_A}"),
    C: pick("${e://Field/self_C}", "${e://Field/__js_self_C}"),
    N: pick("${e://Field/self_N}", "${e://Field/__js_self_N}"),
    O: pick("${e://Field/self_O}", "${e://Field/__js_self_O}"),
    // 受試者自己 20 題的原始作答，用來在「對方是怎樣的人」那幾題標出灰框
    ip: [pick("${e://Field/ipip_1}", "${e://Field/__js_ipip_1}"), pick("${e://Field/ipip_2}", "${e://Field/__js_ipip_2}"), pick("${e://Field/ipip_3}", "${e://Field/__js_ipip_3}"), pick("${e://Field/ipip_4}", "${e://Field/__js_ipip_4}"), pick("${e://Field/ipip_5}", "${e://Field/__js_ipip_5}"), pick("${e://Field/ipip_6}", "${e://Field/__js_ipip_6}"), pick("${e://Field/ipip_7}", "${e://Field/__js_ipip_7}"), pick("${e://Field/ipip_8}", "${e://Field/__js_ipip_8}"), pick("${e://Field/ipip_9}", "${e://Field/__js_ipip_9}"), pick("${e://Field/ipip_10}", "${e://Field/__js_ipip_10}"), pick("${e://Field/ipip_11}", "${e://Field/__js_ipip_11}"), pick("${e://Field/ipip_12}", "${e://Field/__js_ipip_12}"), pick("${e://Field/ipip_13}", "${e://Field/__js_ipip_13}"), pick("${e://Field/ipip_14}", "${e://Field/__js_ipip_14}"), pick("${e://Field/ipip_15}", "${e://Field/__js_ipip_15}"), pick("${e://Field/ipip_16}", "${e://Field/__js_ipip_16}"), pick("${e://Field/ipip_17}", "${e://Field/__js_ipip_17}"), pick("${e://Field/ipip_18}", "${e://Field/__js_ipip_18}"), pick("${e://Field/ipip_19}", "${e://Field/__js_ipip_19}"), pick("${e://Field/ipip_20}", "${e://Field/__js_ipip_20}")].join(","),
    // 受試者性別（m / f），用來配對目標人物帳號的性別；在 Survey Flow 依性別題設定
    g: "${e://Field/gender}",
    parent: window.location.origin
  };
  var qs = [];
  for (var k in p) {
    if (Object.prototype.hasOwnProperty.call(p, k)) qs.push(k + "=" + encodeURIComponent(p[k]));
  }
  var expectedOrigin = new URL(BASE_URL, window.location.href).origin;

  var iframe = document.createElement("iframe");
  iframe.src = BASE_URL + "?" + qs.join("&");
  iframe.style.width = "100%";
  iframe.style.height = "1200px";
  iframe.style.border = "0";
  iframe.setAttribute("scrolling", "no");
  q.getQuestionContainer().appendChild(iframe);

  function onMessage(e) {
    if (e.origin !== expectedOrigin || !e.data || !e.data.type) return;
    if (e.data.type === "exp3:height") {
      iframe.style.height = e.data.h + "px";
    } else if (e.data.type === "exp3:trial") {
      var f = e.data.fields;
      for (var key in f) {
        if (Object.prototype.hasOwnProperty.call(f, key)) {
          saveED(key, String(f[key]));
        }
      }
      q.showNextButton();
    } else if (e.data.type === "exp3:error") {
      // 參數有缺：通常是 embedded data 沒有在 Survey Flow 宣告，或前面的人格測驗沒存到分數
      saveED("trial_error", e.data.problems.join(","));
    }
  }
  window.addEventListener("message", onMessage);
  Qualtrics.SurveyEngine.addOnUnload(function () {
    window.removeEventListener("message", onMessage);
  });
});
