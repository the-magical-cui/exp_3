/* ===== 貼在 Loop & Merge 區塊裡「社群畫面」那一題（Text / Graphic 題型）的 JavaScript =====
   作用：依照這一輪的 trial 編號嵌入網頁，跑完一位目標人物（個人頁、貼文頁、相似性題目），
         把資料存進 embedded data（t1_…、t2_…、t3_…，以及 current_post_text），再顯示「下一頁」按鈕。
   使用前：把 BASE_URL 改成你的 GitHub Pages 網址（結尾要有 /）。
   Loop & Merge 的第 1 欄（Field 1）填 1、2、3。 */
Qualtrics.SurveyEngine.addOnload(function () {
  var BASE_URL = "https://YOUR-ACCOUNT.github.io/YOUR-REPO/";
  var q = this;
  q.hideNextButton();

  var p = {
    mode: "trial",
    t: "${lm://Field/1}",
    cond: "${e://Field/cond}",
    order: "${e://Field/order}",
    list: "${e://Field/list}",
    so: "${e://Field/scen_order}",
    seed: "${e://Field/seed}",
    E: "${e://Field/self_E}",
    A: "${e://Field/self_A}",
    C: "${e://Field/self_C}",
    N: "${e://Field/self_N}",
    O: "${e://Field/self_O}",
    // 受試者自己 20 題的原始作答，用來在「對方是怎樣的人」那幾題標出灰框
    ip: ["${e://Field/ipip_1}", "${e://Field/ipip_2}", "${e://Field/ipip_3}", "${e://Field/ipip_4}", "${e://Field/ipip_5}", "${e://Field/ipip_6}", "${e://Field/ipip_7}", "${e://Field/ipip_8}", "${e://Field/ipip_9}", "${e://Field/ipip_10}", "${e://Field/ipip_11}", "${e://Field/ipip_12}", "${e://Field/ipip_13}", "${e://Field/ipip_14}", "${e://Field/ipip_15}", "${e://Field/ipip_16}", "${e://Field/ipip_17}", "${e://Field/ipip_18}", "${e://Field/ipip_19}", "${e://Field/ipip_20}"].join(","),
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
          Qualtrics.SurveyEngine.setEmbeddedData(key, String(f[key]));
        }
      }
      q.showNextButton();
    } else if (e.data.type === "exp3:error") {
      // 參數有缺：通常是 embedded data 沒有在 Survey Flow 宣告，或前面的人格測驗沒存到分數
      Qualtrics.SurveyEngine.setEmbeddedData("trial_error", e.data.problems.join(","));
    }
  }
  window.addEventListener("message", onMessage);
  Qualtrics.SurveyEngine.addOnUnload(function () {
    window.removeEventListener("message", onMessage);
  });
});
