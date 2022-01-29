const express = require("express")
const app = express()

const mysql = require("mysql")
const bcrypt = require("bcrypt")
const saltRaunds = 10

app.use(express.json())

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "fiska290889",
    database: "miniproject_api",
    port: "3307"
})

// Cek koneksi mysql
// db.connect(function (err) {
//     if (err) throw err;
//     db.query("SELECT * FROM merchant", function (err, result, fields) {
//         if (err) {
//             console.log(err)
//         }
//         console.log(result);
//     });
// });

app.get("/merchant", function (req, res) {
    db.query("SELECT * FROM merchant", function (err, result) {
        if (err) {
            res.send(404);
        }
        res.send(result)
    })
})


app.post('/merchant', function (req, res) {
    const merchantId = req.body.merchantId
    const password = req.body.password
    const name = req.body.name
    const address = req.body.address
    const join_date = req.body.join_date
    const phone_number = req.body.phone_number
    db.query(
        "insert into merchant (merchantId, password, name,address, join_date, phone_number) values (?,?,?,?,?,?)",
        [merchantId, password, name, address, join_date, phone_number],
        (err, result) => {
            if (err) {
                res.send(400);
            }
            res.send("Merchant ditambah")
        }
    )
})


app.post('/product', function (req, res) {
    const id = req.body.id
    const product_name = req.body.product_name
    const quantity = req.body.quantity
    const price = req.body.price
    db.query(
        "insert into product (id, product_name,quantity,price) values (?,?,?,?)",
        [id, product_name, quantity, price],
        (err, result) => {
            if (err) {
                res.send(400)
            }
            res.send("product ditambahkan")
        }
    )
})


app.get("/product", function (req, res) {
    db.query("SELECT * FROM product", function (err, result) {
        if (err) {
            res.send(400);;
        }
        console.log(result);
        res.send(result)
    })
})

app.delete("/product/:id", function (req, res) {
    const id = req.params.id
    console.log(id);
    db.query("delete FROM product where id= ?", [id], function (err, result) {
        if (err) { res.send(404); }
        res.send("product dihapus")
    })
})

app.post("/login/", function (req, res) {
    const merchantId = req.body.merchantId
    const password = req.body.password
    db.query("select * from merchant where merchantId=?", merchantId,
        function (err, result) {
            if (err) { res.send({ err: err }); }
            if (result.length > 0) {
                console.log(result[0].password);
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        res.send(result)

                    } else { res.send("kombinasi password/email salah!") }
                })
            }
            else {
                res.send("Merchant tidak terdaftar")
            }
        }
    )
})


// app.put("/product/:id", function (req, res) {
//     const id = req.params.id
//     const product_name = req.params.product_name
//     console.log(id);
//     db.query("update product set product_name=? where id= ?", [id,product_name], function (err, result) {
//         if (err) {
//             console.log(err);
//         }
//         res.send("product dihapus")
//     })
// })



app.listen(4006)

