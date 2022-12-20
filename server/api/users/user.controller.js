require('dotenv').config()
const pool = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const { register, getUserByEmail, getAllUsers, userById, profile } = require('./user.service');
module.exports = {
    createUser: (req, res) => {
        const { userName, firstName, lastName, email, password } = req.body;
        if (!userName || !firstName || !lastName || !email || !password)
            return res.status(400).json({ msg: 'Not all fields have been provided!' })
        if (password.length < 8)
            return res.status(400).json({ msg: 'Password must be atleast 8 characters!' })
        pool.query(`SELECT * FROM registration WHERE user_email = ?`, [email], (err, result) => {
            if (err) {
                return res
                    .status(err)
                    .json({ msg: 'database connection err' })

            }
            if (result.length > 0) {
                return res
                    .status(400)
                    .json({ msg: 'An account with this email already exists' });
            } else {
                const salt = bcrypt.genSaltSync();
                req.body.password = bcrypt.hashSync(password, salt);
                register(req.body, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res
                            .status(500)
                            .json({ msg: "database connection error" });
                    }
                    pool.query("SELECT * FROM registration WHERE user_email=?", [email], (err, result) => {
                        if (err) {
                            return res
                                .status(err)
                                .json({ msg: "database connection error" })
                        }
                        req.body.userId = result[0].user_id;
                        console.log(req.body);
                        profile(req.body, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res
                                    .status(400)
                                    .json({ msg: "database connection error" })
                            }
                            return res
                                .status(200)
                                .json({
                                    msg: "New user added successfully",
                                    data: result
                                })

                        })
                    }

                    );
                });
            }
        })
    },
    getUsers: (req, res) => {
        getAllUsers((err, result) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ msg: "database connection error" })
            }
            return res
                .status(200)
                .json({ data: result });
        })
    },
    getUserById: (req, res) => {
        userById(req.id, (err, result) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ msg: "database connection error" });
            }
            if (!result) {
                return res.status(404).json({ msg: "Record not found" });
            }
            return res.status(200).json({ data: result })

        })


    },
    login: (req, res)=>{
        const{email, password}= req.body;
        //validation
        if(!email||!password)
        return res
        .status(400)
        .json({msg: "Not all fields have been provided!"})
        getUserByEmail(email, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).json({msg:"database connection err"})
            }
            if(!result){
                return res
                .status(404)
                .json({msg:"No account with this email has been registred"})
            }
            const isMatch= bcrypt.compareSync(password, result.user_password);
            if(!isMatch)
            return res
            .status(404)
            .json({msg: "Invalid Credentials"})
            const token= jwt.sign({id:result.user_id}, process.env.JWT_SECRET, { expiresIn: "1hr"});
            return res.json({
                token,
                user: {
                    id: result.user_id,
                    display_name: result.user_name
                }
            })
        })
    }

}