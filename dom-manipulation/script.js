// Simulated "server" quote data (pretend this comes from a backend)
let serverQuotes = [
  { id: 1, text: "Be yourself; everyone else is already taken.", category: "Wisdom", updatedAt: 1 },
  { id: 2, text: "So many books, so little time.", category: "Books", updatedAt: 1 }
];

// Local storage of quotes
let localQuotes = [...serverQuotes.map(q => ({ ...q }))];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Step 1: Simulate fetching quotes from a server
function fetchQuotesFromServer() {
  // In a real app, you'd fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(serverQuotes);
    }, 500); // simulate network delay
  });
}

// ✅ Step 2: Sync local quotes with "server"
async function syncWithServer() {
  const fetchedQuotes = await fetchQuotesFromServer();
  let conflicts = [];

  fetchedQuotes.forEach(serverQuote => {
    const localIndex = localQuotes.findIndex(q => q.id === serverQuote.id);
    if (localIndex === -1) {
      localQuotes.push(serverQuote);
    } else {
      const localQuote = localQuotes[localIndex];
      if (localQuote.updatedAt < serverQuote.updatedAt) {
        localQuotes[localIndex] = serverQuote;
        conflicts.push(serverQuote);
      }
    }
  });

  if (conflicts.length > 0) {
    alert(`⚠️ ${conflicts.length} quote(s) updated from the server due to conflict.`);
  }

  updateCategoryOptions();
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filtered = localQuotes;

  if (selectedCategory !== "all") {
    filtered = localQuotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - [${quote.category}]`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category,
    updatedAt: Date.now()
  };

  localQuotes.push(newQuote);
  updateCategoryOptions();
  alert("Quote added locally. Sync pending.");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Update categories dropdown
function updateCategoryOptions() {
  const categories = [...new Set(localQuotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
updateCategoryOptions();
syncWithServer();

// Sync every 15 seconds
setInterval(syncWithServer, 15000);
