import express from "express";
import bodyparser from "body-parser";

const app = express();
const port = 4000;

// In memory data store

let contacts = [
    {
        id: 1,
        name: "Yash",
        phone: "789465130",
        email: "yash@gmail.com"
    },
    {
        id: 2,
        name: "Aarav",
        phone: "9876543210",
        email: "aarav@example.com"
    },
    {
        id: 3,
        name: "Riya",
        phone: "8765432109",
        email: "riya@example.com"
    },
    {
        id: 4,
        name: "Karan",
        phone: "7654321098",
        email: "karan@example.com"
    },
    {
        id: 5,
        name: "Meera",
        phone: "6543210987",
        email: "meera@example.com"
    },
];

let lastId = 5;

// Middleware

app.use(bodyparser.json());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended : true }));

// GET /contacts – Get all contacts.

app.get("/contacts", (req, res) => {
    res.json(contacts);
});

// POST /contacts – Add a new contact.

app.post("/contacts", (req, res) => {
    const newId = lastId +1;
    
    const contact = {
        id : newId,
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
    }

    lastId = newId;
    contacts.push(contact);

    res.status(201).json(contact);
});

// PATCH /contacts/:id – Edit contact details.

app.patch("/contacts/:id", (req, res) => {
    const contact = contacts.find(c => c.id == req.params.id);

    if(req.body.name) contact.name = req.body.name;
    if(req.body.phone) contact.phone = req.body.phone;
    if(req.body.email) contact.email = req.body.email;

    if(!contact) return res.status(404).json({message: `Contact not found.`})

    res.json(contact);
});

// DELETE /contacts/:id – Delete a contact.

app.delete("/contacts/:id", (req, res) => {
    const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
    contacts.splice(index, 1);

    if (index === -1) return res.status(404).json({message: "Unable to delete the contact."})
    res.json({message: "Contact deleted successfully."})
    });

// GET /contacts/:name – Get contact by name.

app.get("/contacts/:name", (req, res) => {

    const query = req.query.name?.toLowerCase() || "";
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query)
    );
    res.json(filteredContacts);
});

// Run a server

app.listen(port, () => {
    console.log(`API server is running at http://localhost:${port}`);
});