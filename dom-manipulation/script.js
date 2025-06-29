let localQuotes = [];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// ✅ Fetch quotes from mock server (using JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    
    // Convert mock data into quote format
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

// ✅ Sync localQuotes with fetched server data
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

  updateCategoryOptions();
}

// ✅ POST new quote to mock server
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
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}

// ✅ Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
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
  alert("✅ Quote added locally and sent to server.");

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // POST to mock server
  postQuoteToServer(newQuote);
}

// ✅ Display a random quote
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

// ✅ Update dropdown with unique categories
function updateCategoryOptions() {
  const categories = [...new Set(localQuotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
syncQuotes();
setInterval(syncQuotes, 15000);
