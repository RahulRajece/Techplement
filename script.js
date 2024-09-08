// Fetch a random quote on page load
document.addEventListener("DOMContentLoaded", fetchRandomQuote);

document.getElementById('randomQuoteBtn').addEventListener('click', fetchRandomQuote);
document.getElementById('searchQuoteBtn').addEventListener('click', searchQuoteByAuthor);

async function fetchRandomQuote() {
  const response = await fetch('http://localhost:5000/api/quote');
  const data = await response.json();
  document.getElementById('quoteText').textContent = data.content;
  document.getElementById('quoteAuthor').textContent = `- ${data.author}`;
}

// Search for quotes by author
async function searchQuoteByAuthor() {
  const author = document.getElementById('authorInput').value;
  const response = await fetch(`http://localhost:5000/api/quotes/${author}`);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const randomQuote = data.results[Math.floor(Math.random() * data.results.length)];
    document.getElementById('quoteText').textContent = randomQuote.content;
    document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
  } else {
    document.getElementById('quoteText').textContent = 'No quotes found.';
    document.getElementById('quoteAuthor').textContent = '';
  }
}

// Fetch search history
async function fetchSearchHistory() {
  const response = await fetch('http://localhost:5000/api/history');
  const data = await response.json();
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';

  data.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry.author;
    historyList.appendChild(li);
  });
}

fetchSearchHistory();