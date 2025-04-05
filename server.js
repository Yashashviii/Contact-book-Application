import express from "express";
import bodyparser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";


// Middleware
app.use(bodyparser.json());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended : true }));

// Route to render the main page

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(`${API_URL}/contacts`);
        res.render("index.ejs", { contacts : response.data });
    } catch(error) {
        res.status(500).json({message : "Error fetching contacts"})
    }
});

// Create a new contact

app.post("/contacts", async (req, res) => {
    try {
        const response = await axios.post(`http://localhost:4000/contacts`, req.body);
        res.redirect("/");

    } catch (error) {
        res.status(500).json({message: "Error creating contact"})
    }
});

// PATCH - Edit contact details

app.post("/contacts/:id", async (req, res) => {
    try {
        const response = await axios.patch(`${API_URL}/contacts/${req.params.id}`, req.body);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({message: "Failed to update the contact."});
    }
});


// Delete a contact

app.get("/contacts/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${API_URL}/contacts/${req.params.id}`);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({message: "Error deleting a contact."});
    }
})

console.log("Registered routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});


// Search a contact by name


    app.get("/contacts/search", async (req, res) => {
        try {
            const { name } = req.query;
            if (!name) return res.status(400).json({ message: "Please provide a search query." });
    
            const { data: contacts } = await axios.get(`${API_URL}/contacts`);
            if (!Array.isArray(contacts)) throw new Error("Contacts data is not an array!");
    
            const filteredContacts = contacts.filter(contact =>
                contact.name.toLowerCase().includes(name.toLowerCase())
            );
    
            res.render("index.ejs", { contacts: filteredContacts });
        } catch (error) {
            res.status(500).send(`Error searching contacts: ${error.message}`);
        }
    });
    


// Run a server

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});