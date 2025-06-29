let localQuotes = [];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Load from localStorage on page load
function loadFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      localQuotes = JSON.parse(storedQuotes);
    } catch (e) {
      console.error("Error parsing localStorage data", e);
      localQuotes = [];
    }
  }
}

// ✅ Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(localQuotes));
}

// ✅ Fetch from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const serverQuotes = data.slice(0, 10).map(post => ({
      id: post.id,
      text: post.title,
      category: "Server",
      updatedAt: Date.now()
    }));
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// ✅ Sync with server and update localStorage
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = [];

  serverQuotes.forEach(serverQuote => {
    const index = localQuotes.findIndex(q => q.id === serverQuote.id);

    if (index === -1) {
      localQuotes.push(serverQuote);
    } else if (localQuotes[index].updatedAt < serverQuote.updatedAt) {
      localQuotes[index] = serverQuote;
      conflicts.push(serverQuote);
    }
  });

  if (conflicts.length > 0) {
    alert(`⚠️ ${conflicts.length} quote(s) updated from server.`);
  }

  saveToLocalStorage(); // ✅ Save updated list
  updateCategoryOptions();

  alert("Quotes synced with server!");
}

// ✅ POST to mock server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote posted:", result);
  } catch (error) {
    console.error("POST failed:", error);
  }
}

// ✅ Add new quote (with POST and localStorage)
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and category.");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category,
    updatedAt: Date.now()
  };

  localQuotes.push(newQuote);
  saveToLocalStorage(); // ✅ Update localStorage
  updateCategoryOptions();
  alert("✅ Quote added locally and sent to server.");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  postQuoteToServer(newQuote);
}

// ✅ Display random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filtered = localQuotes;

  if (selectedCategory !== "all") {
    filtered = localQuotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - [${quote.category}]`;
}

// ✅ Update dropdown
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

// ✅ Initialization
loadFromLocalStorage();
updateCategoryOptions();
syncQuotes();
setInterval(syncQuotes, 15000);
