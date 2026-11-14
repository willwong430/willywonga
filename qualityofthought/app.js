// Picks one quote per calendar day (viewer's local date), cycling through quotes.json.
(function () {
  var today = new Date();
  var dateEl = document.getElementById('date');
  dateEl.textContent = today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Whole days since a fixed epoch, using local Y/M/D so the quote flips at local midnight.
  var dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);

  fetch('quotes.json')
    .then(function (r) { return r.json(); })
    .then(function (quotes) {
      var q = quotes[dayNumber % quotes.length];
      document.getElementById('quote').textContent = q.text;
      document.getElementById('author').textContent = q.author;
    })
    .catch(function () {
      document.getElementById('quote').textContent = 'The quality of your life is the quality of your thoughts.';
    });
})();
