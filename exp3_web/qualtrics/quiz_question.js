/* ===== 貼在「人格測驗」那一題（Text / Graphic 題型）的 JavaScript =====
   作用：嵌入網頁的 Mini-IPIP，作答完成後把分數存進 embedded data，再顯示「下一頁」按鈕。
   使用前：把 BASE_URL 改成你的 GitHub Pages 網址（結尾要有 /）。 */
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

  var expectedOrigin = new URL(BASE_URL, window.location.href).origin;
  var src = BASE_URL + "?mode=quiz&parent=" + encodeURIComponent(window.location.origin);

  var iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.style.width = "100%";
  iframe.style.height = "900px";
  iframe.style.border = "0";
  iframe.setAttribute("scrolling", "no");
  q.getQuestionContainer().appendChild(iframe);

  function onMessage(e) {
    if (e.origin !== expectedOrigin || !e.data || !e.data.type) return;
    if (e.data.type === "exp3:height") {
      iframe.style.height = e.data.h + "px";
    } else if (e.data.type === "exp3:quiz") {
      var f = e.data.fields;
      for (var k in f) {
        if (Object.prototype.hasOwnProperty.call(f, k)) {
          saveED(k, String(f[k]));
        }
      }
      q.showNextButton();
    }
  }
  window.addEventListener("message", onMessage);
  Qualtrics.SurveyEngine.addOnUnload(function () {
    window.removeEventListener("message", onMessage);
  });
});
