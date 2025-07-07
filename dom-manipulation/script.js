document.addEventListener("DOMContentLoaded", function () {
  let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
    { text: "Coding is the closest thing we have to a superpower.", category: "Technology" }
  ];

  function updateCategoryOptions() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const categorySelect = document.getElementById("categorySelect");
    categorySelect.innerHTML = `<option value="all">All</option>`;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  function showRandomQuote() {
    const selectedCategory = document.getElementById("categorySelect").value;
    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes in this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = filteredQuotes[randomIndex].text;
  }

  function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both quote text and category.");
      return;
    }

    quotes.push({ text, category });

    textInput.value = "";
    categoryInput.value = "";

    updateCategoryOptions();
    alert("Quote added successfully!");
  }

  // ✅ Event Listeners (this will now be detected)
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("categorySelect").addEventListener("change", showRandomQuote);

  // ✅ Initialize
  updateCategoryOptions();
  showRandomQuote();
});
