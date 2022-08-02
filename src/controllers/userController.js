// const handleEdit = (req, res) => res.send("Edit User");
// const handleDelete = (req, res) => res.send("Delete User");

import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  // req.body에서 데이터 꺼내오기
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";

  // 비밀번호 옳게 작성했는지 확인
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  // 이미 생성된 동일한 username 또는 email 있는지 확인
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    // 만약 동일한 username 또는 email이 이미 db에 있다면
    return res.status(400).render("join", {
      pageTitle,
      errorMessage:
        "This username/email is already taken. Please change your username",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage:
        "This username/email is already taken. Please change your username",
    });
  }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);

  // 1번째. 입력한 username이 DB에 존재하는지 확인
  const exists = await User.exists({ username });
  if (!exists) {
    // user가 존재하지 않는다면
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }

  // 2번째. 입력한 password가 correct한지 확인

  res.end();
};
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`See User #${req.params.id}`);
};
