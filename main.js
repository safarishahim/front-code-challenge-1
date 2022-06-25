const express = require('express')
const cors = require('cors')
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express()
const port = 3009
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors())

app.get('/api/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync('./users.json'));
    const page = Number(req.query.page || 0);
    const rowNumbers = Number(req.query.per_page || 20);
    const startUsers = page * rowNumbers;
    const usersList = users.slice(startUsers, startUsers + rowNumbers);

    res.send({
        users: usersList,
        page,
        total: users.length,
        per_page: rowNumbers,
    })
})

app.post('/api/users', (req, res) => {
    if (!req.body.first_name || !req.body.last_name || !req.body.mobile) {
        res.status(400).send({
            message: 'bad_request',
            status: 201,
        });
        return;
    }

    const users = [...JSON.parse(fs.readFileSync('./users.json'))];
    const newUserId = users.length + 1;

    const newUser = {
        id: newUserId,
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        mobile: req.body.mobile,
        date: new Date().toLocaleDateString(),
    };

    users.push(newUser)


    fs.writeFileSync("users.json", JSON.stringify(users, null, 1), function (err) {
        if (err) throw Error(err);
        console.log('data created')
    })


    res.send({
        message: 'با موفقیت افزوده شد.',
        status: 201,
        data: newUser,
    })
})

app.delete('/api/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync('./users.json'));
    const userId = Number(req.params.id || 0);
    const user = users.find(item => item.id === userId);
    if (!user) {
        res.status(404).send({
            message: 'کاربر یافت نشد',
            status: 404,
        });
        return;
    }

    const usersList = users.filter(item => item.id !== userId);

    fs.writeFileSync("users.json", JSON.stringify(usersList, null, 1), function (err) {
        if (err) throw Error(err);
        console.log('data created')
    })

    res.send({
        message: 'با موفقیت حذف شد.',
        status: 200,
        user_id: userId,
    })
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
