// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)

const bcrypt = require("bcryptjs");
const { ekle, goreBul } = require("../users/users-model");
const { usernameBostami, usernameVarmi, sifreGecerlimi } = require("./auth-middleware");

// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const router = require("express").Router();
router.post("/register",usernameBostami,sifreGecerlimi, async (req, res, next)=>{
  try {
    const addUser = req.body;
    const hash = bcrypt.hashSync(addUser.password, 8);
    addUser.password = hash;
    const lastUser = await ekle(addUser);
    res.status(201).json(lastUser);
  } catch (error) {
    next(error);
  }
})
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post("/login", usernameVarmi, async (req, res, next) => {
  try {

    const { username, password } = req.body;

    const users = await goreBul({ username });
    const logUser = users[0];

    if (bcrypt.compareSync(password, logUser.password)) {

      req.session.user = {
        user_id: logUser.user_id,
        username: logUser.username
      };

      res.status(200).json({
        message: `Hoşgeldin ${logUser.username}!`
      });

    } else {
      next({
        status: 401,
        message: "Geçersiz kriter"
      });
    }

  } catch (error) {
    next(error);
  }
});

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.get("/logout", async (req,res,next)=>{
  try {
    if(req.session.user){
      req.session.destroy(err=>{
        if(err){next(err)}else{res.status(200).json({message: "Çıkış yapildi"})}
      })
    }else{
      res.status(200).json({message: "Oturum bulunamadı!"})
    }
  } catch (error) {
    next(error);
  }
})

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;