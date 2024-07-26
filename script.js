// ... (previous JavaScript code remains unchanged)

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

    #buttons button {
        margin: 5px;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: #4CAF50;
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    #buttons button:hover {
        background-color: #45a049;
    }

    #buttons button.active {
        background-color: #357a38;
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
        background-color: #4CAF50;
        color: white;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    td:first-child {
        position: sticky;
        left: 0;
        background-color: #e8f5e9;
        font-weight: bold;
        z-index: 2;
    }

    th:first-child {
        z-index: 3;
    }

    .event {
        margin-bottom: 10px;
        background-color: #f1f8e9;
        padding: 8px;
        border-radius: 5px;
    }

    .event strong {
        color: #1b5e20;
    }

    .event em {
        color: #33691e;
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
        50% { background-color: #c8e6c9; }
        100% { background-color: #ffffff; }
    }
</style>
`);

// ... (rest of the JavaScript code remains unchanged)
