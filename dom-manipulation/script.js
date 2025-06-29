// Simulated server data (would typically come from an API)
let serverQuotes = [
  { id: 1, text: "Be yourself; everyone else is already taken.", category: "Wisdom", updatedAt: 1 },
  { id: 2, text: "So many books, so little time.", category: "Books", updatedAt: 1 }
];

// Local quotes data with timestamps
let localQuotes = [...serverQuotes.map(q => ({ ...q }))];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Generate unique IDs and timestamps
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
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
    alert("Both quote and category are required.");
    return;
  }

  const newQuote = {
    id: generateId(),
    text,
    category,
    updatedAt: Date.now()
  };

  localQuotes.push(newQuote);
  updateCategoryOptions();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added locally! Syncing with server...");
}

// Sync local quotes with simulated server
function syncWithServer() {
  let conflicts = [];

  // Step 1: Check for conflicts (same id, different content)
  serverQuotes.forEach(serverQuote => {
    const localIndex = localQuotes.findIndex(q => q.id === serverQuote.id);

    if (localIndex === -1) {
      // New quote from server
      localQuotes.push(serverQuote);
    } else {
      const localQuote = localQuotes[localIndex];
      if (localQuote.updatedAt < serverQuote.updatedAt) {
        // Server wins (conflict)
        localQuotes[localIndex] = serverQuote;
        conflicts.push(serverQuote);
      }
    }
  });

  // Step 2: Update UI
  if (conflicts.length > 0) {
    alert(`⚠️ Conflict detected. ${conflicts.length} quotes updated from server.`);
  } else {
    console.log("✅ No conflicts. Data in sync.");
  }

  updateCategoryOptions();
}

// Build unique categories in dropdown
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

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
updateCategoryOptions();
syncWithServer();

// Periodic sync every 15 seconds (simulating server fetch)
setInterval(syncWithServer, 15000);
