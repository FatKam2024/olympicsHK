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

                createButtonAndDropdown(['All Sports', ...uniqueSports]);
                createTables('All Sports', uniqueDates, events);
                createTables(uniqueSports, uniqueDates, events);

                // Show All Sports by default
                filterSport('All Sports');
            }
        });
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
    });

// Create "All Sports" button and sports dropdown
const createButtonAndDropdown = (uniqueSports) => {
    const buttonsDiv = document.getElementById('buttons');
    
    // Create "All Sports" button
    const allSportsButton = document.createElement('button');
    allSportsButton.innerText = 'All Sports';
    allSportsButton.onclick = () => {
        filterSport('All Sports');
        document.querySelector('#select-sport').selectedIndex = 0;
    };
    allSportsButton.classList.add('active');
    buttonsDiv.appendChild(allSportsButton);

    // Create dropdown for other sports
    const sportDropdown = document.createElement('select');
    sportDropdown.id = 'select-sport';
    sportDropdown.onchange = (e) => {
        if (e.target.value === '') {
            filterSport('All Sports');
        } else {
            filterSport(e.target.value);
        }
    };
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a sport';
    defaultOption.value = '';
    sportDropdown.add(defaultOption);

    // Add sport options
    uniqueSports.slice(1).forEach(sport => {
        const option = document.createElement('option');
        option.text = sport;
        option.value = sport;
        sportDropdown.add(option);
    });

    buttonsDiv.appendChild(sportDropdown);

    // Add dropdown for live channels
    const liveChannelsDropdown = document.createElement('select');
    liveChannelsDropdown.id = 'live-channels';
    liveChannelsDropdown.innerHTML = `
        <option value="">Select a live channel</option>
        <option value="https://www.rthk.hk/timetable/tv31">香港電台31台</option>
        <option value="https://app7.rthk.hk/special/sports32/index.php">香港電台32台</option>
        <option value="https://hoy.tv/live?channel_no=77">HOY 77台</option>
        <option value="https://hoy.tv/live?channel_no=76">HOY 76台</option>
        <option value="https://viu.tv/ch/99">ViuTV99台</option>
        <option value="https://viu.tv/ch/96">ViuTV96台</option>
        <option value="https://news.tvb.com/tc/live/83">TVB新聞台83台</option>
    `;
    liveChannelsDropdown.onchange = (e) => {
        if (e.target.value) {
            window.open(e.target.value, '_blank');
            liveChannelsDropdown.selectedIndex = 0; // Reset the dropdown to default
        }
    };

    buttonsDiv.appendChild(liveChannelsDropdown);
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
// Update the CSS styles
document.head.insertAdjacentHTML('beforeend', `
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
    }

    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    #buttons {
        text-align: center;
        margin-bottom: 20px;
    }

    #buttons button, #buttons select {
        margin: 5px;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #1e88e5;
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    #buttons button:hover, #buttons select:hover {
        background-color: #1565c0;
    }

    #buttons button.active {
        background-color: #0d47a1;
    }

    #buttons select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
        background-repeat: no-repeat;
        background-position-x: 95%;
        background-position-y: 50%;
    }

    #tables {
        max-height: 80vh;
        overflow-y: auto;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
        padding: 12px;
        text-align: left;
    }

    th {
        background-color: #1e88e5;
        color: white;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    td:first-child {
        position: sticky;
        left: 0;
        background-color: #e3f2fd;
        font-weight: bold;
        z-index: 2;
    }

    th:first-child {
        z-index: 3;
    }

    .event {
        margin-bottom: 10px;
        background-color: #e3f2fd;
        padding: 8px;
        border-radius: 5px;
    }

    .event strong {
        color: #0d47a1;
    }

    .event em {
        color: #1565c0;
    }

    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 10px 0;
    }

    td {
        min-width: 200px;
        max-width: 250px;
    }

    td:first-child {
        min-width: 80px;
        max-width: 80px;
    }

    @keyframes highlight {
        0% { background-color: #ffffff; }
        50% { background-color: #bbdefb; }
        100% { background-color: #ffffff; }
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
