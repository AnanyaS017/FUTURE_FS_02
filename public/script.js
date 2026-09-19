const token = localStorage.getItem("token");

// Protect dashboard page
if (!token) {
    window.location.href = "/login.html";
}


// Elements
const totalLeads = document.getElementById("totalLeads");
const newLeads = document.getElementById("newLeads");
const contactedLeads = document.getElementById("contactedLeads");
const convertedLeads = document.getElementById("convertedLeads");

const leadForm = document.getElementById("leadForm");
const leadMessage = document.getElementById("leadMessage");

const leadsContainer = document.getElementById("leadsContainer");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const logoutBtn = document.getElementById("logoutBtn");


// Common headers
function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}


// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetch("/api/dashboard/stats", {
            headers: getHeaders()
        });

        const data = await response.json();

        if (!data.success) {
            console.error(data.message);
            return;
        }

        totalLeads.textContent = data.stats.totalLeads;
        newLeads.textContent = data.stats.newLeads;
        contactedLeads.textContent = data.stats.contactedLeads;
        convertedLeads.textContent = data.stats.convertedLeads;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


// Load leads
async function loadLeads() {
    try {
        const search = searchInput.value.trim();
        const status = statusFilter.value;

        let url = "/api/leads";

        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (status) {
            params.append("status", status);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (!data.success) {
            leadsContainer.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        displayLeads(data.leads);

    } catch (error) {
        console.error("Load leads error:", error);

        leadsContainer.innerHTML =
            "<p>Failed to load leads.</p>";
    }
}


// Display leads
function displayLeads(leads) {

    if (leads.length === 0) {
        leadsContainer.innerHTML = "<p>No leads found.</p>";
        return;
    }

    leadsContainer.innerHTML = "";

    leads.forEach((lead) => {

        const leadCard = document.createElement("div");

        leadCard.className = "lead-card";

        leadCard.innerHTML = `
            <h3>${lead.name}</h3>

            <p><strong>Email:</strong> ${lead.email}</p>

            <p><strong>Phone:</strong> ${lead.phone}</p>

            <p><strong>Company:</strong> ${lead.company || "N/A"}</p>

            <p><strong>Status:</strong> ${lead.status}</p>

            <p><strong>Source:</strong> ${lead.source || "N/A"}</p>

            <div class="lead-actions">

                <button
                    class="edit-btn"
                    onclick="editLead('${lead._id}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteLead('${lead._id}')"
                >
                    Delete
                </button>

                <button
                    onclick="addNote('${lead._id}')"
                >
                    Add Note
                </button>

                <button
                    onclick="viewNotes('${lead._id}')"
                >
                    View Notes
                </button>

            </div>
        `;

        leadsContainer.appendChild(leadCard);
    });
}


// Add lead
leadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const leadData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        company: document.getElementById("company").value,
        status: document.getElementById("status").value,
        source: document.getElementById("source").value
    };

    try {

        const response = await fetch("/api/leads", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(leadData)
        });

        const data = await response.json();

        if (data.success) {

            leadMessage.textContent =
                "Lead added successfully!";

            leadForm.reset();

            await loadLeads();
            await loadDashboardStats();

        } else {

            leadMessage.textContent = data.message;
        }

    } catch (error) {

        console.error("Add lead error:", error);

        leadMessage.textContent =
            "Failed to add lead.";
    }
});


// Delete lead
async function deleteLead(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this lead?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/api/leads/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        const data = await response.json();

        if (data.success) {

            alert("Lead deleted successfully!");

            await loadLeads();
            await loadDashboardStats();

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error("Delete lead error:", error);

        alert("Failed to delete lead.");
    }
}


// Edit lead
async function editLead(id) {

    const newStatus = prompt(
        "Enter new status: New, Contacted, or Converted"
    );

    if (!newStatus) {
        return;
    }

    const allowedStatuses = [
        "New",
        "Contacted",
        "Converted"
    ];

    if (!allowedStatuses.includes(newStatus)) {

        alert(
            "Invalid status. Use New, Contacted, or Converted."
        );

        return;
    }

    try {

        // Get current lead
        const response = await fetch(`/api/leads/${id}`, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        const lead = data.lead;

        // Update only the status
        const updateResponse = await fetch(`/api/leads/${id}`, {

            method: "PUT",

            headers: getHeaders(),

            body: JSON.stringify({

                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                company: lead.company,
                status: newStatus,
                source: lead.source

            })
        });

        const updateData =
            await updateResponse.json();

        if (updateData.success) {

            alert("Lead updated successfully!");

            await loadLeads();
            await loadDashboardStats();

        } else {

            alert(updateData.message);
        }

    } catch (error) {

        console.error("Edit lead error:", error);

        alert("Failed to update lead.");
    }
}


// Search
searchInput.addEventListener(
    "input",
    loadLeads
);


// Status filter
statusFilter.addEventListener(
    "change",
    loadLeads
);


// Logout
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "/login.html";
});


// Initial loading
loadDashboardStats();
loadLeads();

async function addNote(leadId) {

    const noteText = prompt("Enter your note:");

    if (!noteText || !noteText.trim()) {
        return;
    }

    try {

        const response = await fetch("/api/notes", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                leadId: leadId,
                text: noteText.trim()
            })
        });

        const data = await response.json();

        if (data.success) {

            alert("Note added successfully!");

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error("Add note error:", error);

        alert("Failed to add note.");
    }
}


async function viewNotes(leadId) {

    try {

        const response = await fetch(`/api/notes/${leadId}`, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

        if (data.notes.length === 0) {

            alert("No notes found for this lead.");

            return;
        }

        const notesText = data.notes
            .map((note, index) => {
                return `${index + 1}. ${note.text}`;
            })
            .join("\n\n");

        alert(notesText);

    } catch (error) {

        console.error("View notes error:", error);

        alert("Failed to load notes.");
    }
}