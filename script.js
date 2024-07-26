// Function to fetch and parse CSV data
fetch('OlympicsHK.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const events = results.data.map(row => ({
                    sport: row['Type'],
                    date: row['Date'],
                    time: row['HK Time'],
                    event: row['Event'],
                    player: row['Player']
                }));
                const uniqueDates = [...new Set(events.map(e => e.date))];
                const uniqueSports = [...new Set(events.map(e => e.sport))];

                createButtons(['All Sports', ...uniqueSports]);
                createTables('All Sports', uniqueDates, events);
                createTables(uniqueSports, uniqueDates, events);

                // Show the first sport by default
                if (uniqueSports.length > 0) {
                    filterSport('All Sports');
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
    });

// Create buttons for sports
const createButtons = (uniqueSports) => {
    const buttonsDiv = document.getElementById('buttons');
    uniqueSports.forEach((sport, index) => {
        const button = document.createElement('button');
        button.innerText = sport;
        button.onclick = () => filterSport(sport);
        if (index === 0) button.classList.add('active');
        buttonsDiv.appendChild(button);
    });
};

// Create tables for each sport
const createTables = (uniqueSports, uniqueDates, events) => {
    const tablesDiv = document.getElementById('tables');
    if (typeof uniqueSports === 'string') {
        // For 'All Sports' table
        const table = document.createElement('table');
        table.id = uniqueSports;
        table.classList.add('hidden');
        table.innerHTML = generateTableHTML(uniqueDates, events);
        tablesDiv.appendChild(table);
    } else {
        // For individual sport tables
        uniqueSports.forEach(sport => {
            const table = document.createElement('table');
            table.id = sport;
            table.classList.add('hidden');
            table.innerHTML = generateTableHTML(uniqueDates, events.filter(event => event.sport === sport));
            tablesDiv.appendChild(table);
        });
    }
};

// Generate HTML for each table
const generateTableHTML = (uniqueDates, events) => {
    let tableHTML = '<thead><tr><th>Time</th>';
    uniqueDates.forEach(date => {
        const [day, month, year] = date.split('/');
        const dateObj = new Date(`${year}-${month}-${day}`);
        const dayStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'short' });
        tableHTML += `<th class="date-header">${dayStr}<br>${weekday}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    timeSlots.forEach(slot => {
        let row = `<tr><td>${slot}</td>`;
        let rowHasEvent = false;
        uniqueDates.forEach(date => {
            const slotStartHour = parseInt(slot.split(':')[0]);
            const slotEvents = events.filter(event => {
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                return event.date === date && eventHour === slotStartHour;
            });
            if (slotEvents.length > 0) rowHasEvent = true;
            const eventsList = slotEvents.map(event => `
                <div class="event">
                    <strong>${event.time}</strong><br>
                    ${event.event}<br>
                    <em>${event.player}</em>
                </div>
            `).join('<hr>');
            row += `<td>${eventsList}</td>`;
        });
        row += '</tr>';
        if (rowHasEvent) tableHTML += row;
    });

    tableHTML += '</tbody>';
    return tableHTML;
};

// Filter events by sport
const filterSport = (sport) => {
    const tables = document.querySelectorAll('#tables table');
    tables.forEach(table => {
        if (table.id === sport) {
            table.classList.remove('hidden');
        } else {
            table.classList.add('hidden');
        }
    });

    // Update active button with highlight effect
    const buttons = document.querySelectorAll('#buttons button');
    buttons.forEach(button => {
        if (button.innerText === sport) {
            button.classList.add('active');
            button.style.animation = 'highlight 0.5s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        } else {
            button.classList.remove('active');
        }
    });
};

// Add this to your existing CSS or create a new <style> tag in your HTML
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes highlight {
        0% { background-color: #ffffff; }
        50% { background-color: #ffff00; }
        100% { background-color: #ffffff; }
    }

    #tables {
        max-height: 80vh;
        overflow-y: auto;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        font-size: 14px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    td:first-child {
        position: sticky;
        left: 0;
        background-color: #f2f2f2;
        z-index: 2;
    }

    th:first-child {
        z-index: 3;
    }

    .event {
        margin-bottom: 10px;
    }

    .event:last-child {
        margin-bottom: 0;
    }

    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 10px 0;
    }

    #buttons button {
        margin: 5px;
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid #ddd;
        background-color: #f8f8f8;
        transition: all 0.3s ease;
    }

    #buttons button:hover {
        background-color: #e8e8e8;
    }

    #buttons button.active {
        background-color: #4CAF50;
        color: white;
    }

    td {
        min-width: 200px;
        max-width: 250px;
    }

    td:first-child {
        min-width: 80px;
        max-width: 80px;
    }
</style>
`);

// Wrap tables in a container for horizontal scrolling
document.addEventListener('DOMContentLoaded', () => {
    const tablesDiv = document.getElementById('tables');
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tablesDiv.parentNode.insertBefore(tableContainer, tablesDiv);
    tableContainer.appendChild(tablesDiv);
});
