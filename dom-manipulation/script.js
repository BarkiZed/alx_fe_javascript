let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Philosophy" },
];

// Create form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";
  formContainer.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);
}

// Populate categories in dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categorySelect");
  const categories = new Set(quotes.map(q => q.category));

  categorySelect.innerHTML = '<option value="all">All</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show random quote based on category
function showRandomQuote() {
  const category = document.getElementById("categorySelect").value;
  const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

  const display = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add new quote and update categories
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  alert("Quote added successfully!");
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialization
populateCategories();
createAddQuoteForm();
showRandomQuote();
