const express = require('express');
const fs = require('fs');

const app = express()
app.use(express.json());
const portNumber = 80; // http port

app.get('/budget', (req, res) => {
    console.log("=========== Main Budget Page has been reached ===========");
    fs.createReadStream("./pages/budget.html").pipe(res);
});

app.get('/budget.js', (req, res) => {
    console.log("_Budget.js is requested");
    fs.createReadStream("./scripts/budget.js").pipe(res);
});

app.get('/budget/categories.list', (req, res) => {
    console.log("_budget category list has been requested");
    fs.createReadStream("./scripts/categories.list").pipe(res);
});

app.get('/budget/data', (req, res) => {
    console.log("_budget data information has been requested");
    fs.stat("./data/budget_data.tsv", (err, stat) => {
        if (err === null) {
            fs.createReadStream("./data/budget_data.tsv").pipe(res);
        } else {
            res.end();
        }
    });
});

app.post('/budget', (req, res) => {
    let budgetData = req.body.data;
    fs.open("./data/budget_data.tsv", "a", (e, id) => {
        fs.write(id, budgetData + "\r\n", null, 'utf8', () => {
            fs.close(id, () => console.log(`_setting budgets data: ${budgetData}`));
        });
    });
    res.end();
});

app.post('/budget/addcategory', (req, res) => {
    let newCategory = req.body.data;
    fs.open('./scripts/categories.list', 'a', (e, id) => {
        fs.write(id, newCategory + "\r\n", null, 'utf8', () => {
            fs.close(id, () => console.log(`_budget categories has been updated with value: ${newCategory}`));
        });
    });
    res.end();
});

app.post('/budget/remove', (req, res) => {
    let entryToRemove = req.body.data;
    fs.readFile('./data/budget_data.tsv', 'utf8', (e, data) => {
        if (e) {
            console.log(`Removing data entry ${entryToRemove} resulted in failure`);
        } else {
            console.log(`_removing budget data entry: ${entryToRemove}`);
            entryToRemove = entryToRemove.split("\t");
            let newData = data.split(/\r?\n/).filter((entry) => {
                entry = entry.split("\t");
                for (let i = 0; i < entry.length; i+=1) {
                    console.log(`_removingentryeawefawefaweftryentryentry: ${entryToRemove[i]}`);
                    console.log(`_removingeytryentryentry: ${entry[i]}`);
                    if (Number(entryToRemove[i]) && Number(entryToRemove[i]) !== Number(entry[i]) && entryToRemove[i] !== entry[i]) {
                        return true
                    }
                }
                return false;
            });
            newData = newData.join("\r\n");
            fs.writeFile('./data/budget_data.tsv', newData, () => {});
        }
    });
    res.end();
});

app.listen(portNumber, () => {
    console.log(`Starting listening on port ${portNumber}`);
});
