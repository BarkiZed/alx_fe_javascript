// Initial quotes data
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const categorySelect = document.getElementById('categorySelect');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importQuotesBtn = document.getElementById('importQuotes');
const importFileInput = document.getElementById('importFile');
const clearStorageBtn = document.getElementById('clearStorage');

// Current filter
let currentCategoryFilter = 'all';

// Initialize the app
function init() {
    // Load quotes from local storage
    loadQuotes();
    
    // If no quotes in storage, load default quotes
    if (quotes.length === 0) {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
            { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
            { text: "Stay hungry, stay foolish.", category: "inspiration" },
            { text: "The journey of a thousand miles begins with one step.", category: "life" }
        ];
        saveQuotes();
    }
    
    // Display a random quote on page load
    showRandomQuote();
    
    // Set up event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    showAddFormBtn.addEventListener('click', createAddQuoteForm);
    exportQuotesBtn.addEventListener('click', exportToJsonFile);
    importQuotesBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importFromJsonFile);
    clearStorageBtn.addEventListener('click', clearAllQuotes);
    
    // Populate category filter
    updateCategoryFilter();
    
    // Set up category filter change listener
    categorySelect.addEventListener('change', function() {
        currentCategoryFilter = this.value;
        showRandomQuote();
    });
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    // Store last update time in session storage
    sessionStorage.setItem('lastUpdated', new Date().toISOString());
}

// Display a random quote
function showRandomQuote() {
    let filteredQuotes = quotes;
    
    // Filter by category if not 'all'
    if (currentCategoryFilter !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === currentCategoryFilter);
    }
    
    // If no quotes match the filter, show a message
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `
            <p class="quote-text">No quotes found in this category.</p>
            <p class="quote-category"></p>
        `;
        return;
    }
    
    // Get a random quote from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Update the DOM
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">— ${randomQuote.category}</p>
    `;
    
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Create the add quote form
function createAddQuoteForm() {
    // Check if form already exists
    if (document.getElementById('addQuoteForm')) {
        document.getElementById('addQuoteForm').style.display = 'block';
        return;
    }

    // Create form container
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteForm';
    formContainer.className = 'form-container';
    formContainer.innerHTML = `
        <h3>Add New Quote</h3>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="hideAddForm()">Cancel</button>
    `;
    
    // Add form to the DOM
    document.body.appendChild(formContainer);
}

// Hide the add quote form
function hideAddForm() {
    const form = document.getElementById('addQuoteForm');
    if (form) {
        form.style.display = 'none';
        // Clear the form fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    }
}

// Add a new quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    
    if (text && category) {
        // Add the new quote to the array
        quotes.push({ text, category });
        
        // Save to local storage
        saveQuotes();
        
        // Update the category filter
        updateCategoryFilter();
        
        // Hide the form and clear fields
        hideAddForm();
        
        // Show the new quote
        showRandomQuote();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Update the category filter dropdown
function updateCategoryFilter() {
    // Get all unique categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Update the dropdown
    categorySelect.innerHTML = categories.map(category => 
        `<option value="${category}" ${category === currentCategoryFilter ? 'selected' : ''}>
            ${category}
        </option>`
    ).join('');
}

// Export quotes to JSON file using Blob
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'quotes.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    
    // Clean up
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
}

// Renamed to exactly match the requirement
function exportToJsonFile() {
    exportToJson();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedQuotes)) {
                throw new Error('Imported data is not an array');
            }
            
            // Check each quote has required fields
            for (const quote of importedQuotes) {
                if (!quote.text || !quote.category) {
                    throw new Error('Some quotes are missing required fields');
                }
            }
            
            // Add imported quotes to our collection
            quotes.push(...importedQuotes);
            saveQuotes();
            updateCategoryFilter();
            showRandomQuote();
            
            alert(`Successfully imported ${importedQuotes.length} quotes!`);
        } catch (error) {
            alert('Error importing quotes: ' + error.message);
            console.error('Import error:', error);
        }
        
        // Reset file input
        event.target.value = '';
    };
    fileReader.readAsText(file);
}

// Clear all quotes from storage
function clearAllQuotes() {
    if (confirm('Are you sure you want to delete all quotes? This cannot be undone.')) {
        quotes = [];
        localStorage.removeItem('quotes');
        updateCategoryFilter();
        showRandomQuote();
        alert('All quotes have been cleared.');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
