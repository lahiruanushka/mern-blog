// Generate password strength feedback
export default function generatePasswordFeedback(strengthResult) {
  const feedbackMessages = {
    0: "Password is very weak. Use a stronger combination of characters.",
    1: "Password is weak. Add more complexity.",
    2: "Password is moderate. Consider making it stronger.",
    3: "Password is strong, but could be even better.",
    4: "Excellent password strength!",
  };

  // Combine strength message with specific feedback
  const baseMessage = feedbackMessages[strengthResult.score];
  const specificFeedback =
    strengthResult.feedback.suggestions.length > 0
      ? strengthResult.feedback.suggestions.join(" ")
      : "";

  return `${baseMessage} ${specificFeedback}`.trim();
}
