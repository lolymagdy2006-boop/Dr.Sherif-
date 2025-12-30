function checkMCQ(qName, correct, feedbackId) {
  const options = document.getElementsByName(qName);
  let chosen = null;

  options.forEach(option => {
    if (option.checked) {
      chosen = option.value;
    }
  });

  const feedback = document.getElementById(feedbackId);
  feedback.classList.add("show");

  if (chosen === correct) {
    feedback.textContent = "✔ Correct answer.";
    feedback.className = "feedback show correct";
  } else {
    feedback.textContent = feedback.dataset.explain;
    feedback.className = "feedback show wrong";
  }
}
