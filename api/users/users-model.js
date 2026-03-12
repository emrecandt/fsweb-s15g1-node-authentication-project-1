
const db = require("../../data/db-config")



/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
const allUsers = await db("users").select("user_id", "username");
return allUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  return await db("users").where(filtre);
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
const user = await db("users").select("user_id", "username").where("user_id", user_id).first();
return user;
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
const [newUserId] = await db("users").insert({username: user.username, password: user.password});
const newUser = await idyeGoreBul(newUserId);
return newUser;
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports={
  bul,
  goreBul,
  idyeGoreBul,
  ekle
}