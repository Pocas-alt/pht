const fs = require('fs');
const path = require('path');
const prompt = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => prompt.question(question, resolve));
}

(async () => {
    const filePath = path.join(__dirname, 'changelog.json');
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

    const date = await ask("Įveskite datą (pvz. 2025-05-23): ");
    const tag = await ask("Įveskite tipą (new, fix, update, improvement, planned): ");
    const title = await ask("Pavadinimas: ");
    const description = await ask("Aprašymas: ");

    data.unshift({ date, tag, title, description }); // add at the beginning
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    console.log("✅ Įrašas pridėtas į changelog.json");
    prompt.close();
})();