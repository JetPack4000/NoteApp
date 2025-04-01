var express = require('express');
var router = express.Router();
// Fix the code so is is a list not a shopping list, also add a delete secion and a search function on the home screen
let currentlistItem = [
  {
    "id": 1,
    "title": "Buy groceries",
    "body": "Milk, Eggs, Bread",
    "color": "red",
    "starred": false,
    "createdAt": "2025-03-20T08:00:00Z",
    "updatedAt": "2025-03-20T08:00:00Z"
  },
  {
    "id": 2,
    "title": "Meeting notes",
    "body": "Discuss project roadmap and deadlines",
    "color": "yellow",
    "starred": true,
    "createdAt": "2025-03-19T10:00:00Z",
    "updatedAt": "2025-03-19T10:30:00Z"
  }

];

let oldlistItem = [
  
];
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'List item App', currentDate: Date(), data: currentlistItem });
});

router.get('/mylist', function (req, res, next) {
  res.render('viewList', { title: 'My notes', data: currentlistItem, currentDate: Date() });
});

router.get('/additem', function (req, res, next) {
  res.render('addList', { title: 'Add a note', currentDate: Date() });
});
router.post('/additem', function (req, res, next) {
  var title = req.body.title
  var body = req.body.body
  var color = req.body.color
  var starred = req.body.starred
  var newItem = { title: title, body: body, color: color, starred: starred, createdAt: Date().toLocaleString(), updatedAt: Date().toLocaleString() };
  // Generate a new ID for the item
  var newId = currentlistItem.length > 0 ? currentlistItem[currentlistItem.length - 1].id + 1 : 1;
  newItem.id = newId;
  // Add the new item to the list
  currentlistItem.push(newItem);
  res.render('viewList', { title: 'My notes', data: currentlistItem, currentDate: Date(), info: 'New Item added' });
});

router.get('/oldlist', function (req, res, next) {
  res.render('oldList', { title: 'Old notes', data: oldlistItem, currentDate: Date() });
});
router.get('/search', (req, res) => {
  
  const searchQuery = req.query.query ? req.query.query.toLowerCase() : ''; // Get search term

  // Filter notes where the title includes the search term
  const filteredNotes = currentlistItem.filter(note =>
    note.title.toLowerCase().includes(searchQuery) ||
    note.body.toLowerCase().includes(searchQuery)
  );
  console.log("Search Query:", req.query.query);
  console.log("Filtered Notes:", filteredNotes);
  res.render('index', {
    title: "Search Results",
    currentDate: new Date(),
    data: filteredNotes
  });
});
router.get('/edit/:id', (req, res) => {
  const noteId = req.params.id;
  const note = currentlistItem.find(n => n.id == noteId); // Find the note by ID

  if (!note) {
      return res.status(404).send("Note not found");
  }

  res.render('edit', { title: "Edit Note", note });
});
router.post('/update/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, body, color } = req.body;

  let note = currentlistItem.find(n => n.id == noteId);

  if (!note) {
      return res.status(404).send("Note not found");
  }

  // Update note details
  note.title = title;
  note.body = body;
  note.color = color;
  note.updatedAt = new Date().toLocaleString(); // Update timestamp

  res.redirect('/mylist'); // Redirect back to the notes list
});
router.post('/unstar/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10); // Convert ID to a number
  const note = currentlistItem.find(n => n.id === noteId); // Find the note by ID

  if (!note) {
    return res.status(404).send("Note not found");
  }

  note.starred = false; // Unstar the note
  res.redirect('/mylist'); // Redirect back to the notes list

});
router.post('/star/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10); // Convert ID to a number
  const note = currentlistItem.find(n => n.id === noteId); // Find the note by ID

  if (!note) {
    return res.status(404).send("Note not found");
  }

  note.starred = true; // star the note
  res.redirect('/mylist'); // Redirect back to the notes list

});
router.post('/delete/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10); // Convert ID to a number
  const noteIndex = currentlistItem.findIndex(n => n.id === noteId); // Find the index of the note

  if (noteIndex === -1) {
    return res.status(404).send("Note not found");
  }

  currentlistItem.splice(noteIndex, 1); // Remove the note from the array
  res.redirect('/mylist'); // Redirect back to the notes list
});
module.exports = router;
