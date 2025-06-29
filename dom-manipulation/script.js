// Initial quotes data
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
    { text: "Stay hungry, stay foolish.", category: "inspiration" },
    { text: "The journey of a thousand miles begins with one step.", category: "life" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const categorySelect = document.getElementById('categorySelect');

// Current filter
let currentCategoryFilter = 'all';

// Initialize the app
function init() {
    // Display a random quote on page load
    showRandomQuote();
    
    // Set up event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    showAddFormBtn.addEventListener('click', createAddQuoteForm);
    
    // Populate category filter
    updateCategoryFilter();
    
    // Set up category filter change listener
    categorySelect.addEventListener('change', function() {
        currentCategoryFilter = this.value;
        showRandomQuote();
    });
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
}

// Create the add quote form (as required by the task)
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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
