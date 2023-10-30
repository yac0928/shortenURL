//複製連結
const urlField = document.getElementById("urlField")
const copyBtn = document.getElementById("copyBtn")
copyBtn.addEventListener("click", function() {
  urlField.ariaSelected()
  navigator.clipboard.writeText(urlField.value)
    .then(function() {
      alert("Copied: " + urlField.value)
    })
    .catch(function(err) {
      console.log("Failed: " + err)
    })
})