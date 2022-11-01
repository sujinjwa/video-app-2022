// const handleEdit = (req, res) => res.send("Edit User");
// const handleDelete = (req, res) => res.send("Delete User");

import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { token } from "morgan";

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

export const getEdit = async (req, res) => {
  // const user = await User.findOne({ email: req.session.user.email });
  // console.log(user);
  return res.render("edit-profile", {
    pageTitle: "Edit Profile",
  });
};

export const postEdit = async (req, res) => {
  // req에서 session과 body를 한번에 받는 방법
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  console.log(isHeroku);
  // console.log(file);
  // const id = req.session.user.id;
  // const { name, email, username, location } = req.body; // form으로부터 받아옴. 이때, form의 input name 태그 이름과 동일하게 받아와야 함

  // const user = await User.findOne({ id: req.session.user.id });
  // const id = user.id;

  // 이미 생성된 동일한 username 또는 email 있는지 확인
  // 이때, 현재 로그인한 유저 본인의 username 혹은 email 값과 동일한 경우는 제외해줘야 함
  const exists = await User.exists({ $or: [{ username }, { email }] });
  // console.log(exists); // exists의  _id 가 출력된다

  const existingUser = await User.findById(_id);

  if (exists && existingUser._id != req.session.user._id) {
    // 만약 동일한 username 혹은 email 이 db에 있다면
    // 그런데 로그인한 유저와 이미 동일한 username 혹은 email 가진 유저가 다른 사람이라면
    return res.status(400).render("edit-profile", {
      errorMessage:
        "This username/email is already taken. Please change your username",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  // session 정보도 같이 업데이트
  // const user = await User.findOne({ id: _id }); // _id 와 동일한 id를 가지는 user (현재 로그인하고 있는 유저) db에서 찾기
  req.session.user = updatedUser; // req.session.user를 find된 위 user로 업데이트
  // console.log(user);

  // // req.session.user 정보 업데이트
  // req.session.user = {
  //   ...req.session.user, // req.session.user의 모든 기존 데이터를 복붙
  //   // // 금방 UI의 form으로부터 받았던 아래 name, email 등의 데이터만 업데이트
  //   name,
  //   email,
  //   username,
  //   location,
  // };
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  // 로그인된 사용자의 정보 중 socialOnly값 확인하기
  // console.log(req.session.user.socialOnly);

  // 만약 현재 로그인된 유저가 깃헙으로 계정 생성한 유저라면
  if (req.session.user.socialOnly === true) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit, Profile",
      errorMessage:
        "You've made your account with Github. So, you don't have password!",
    });
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  // 비밀번호를 바꾸려고 하는 유저가 누구인지 찾고,
  // 동시에 유저가 UI form에 입력한 값 가져오기
  const {
    session: {
      user: { _id, password }, // 현재 로그인된 사용자 확인
    },
    body: { oldPassword, newPassword, newPasswordConfirmation }, // form에서 정보 가져오기
  } = req;

  // oldPassword와 req.session.user.password가 동일한지 확인
  // 1) 노마드 코드
  const ok = await bcrypt.compare(oldPassword, password);

  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The currnet password is incorrect",
    });
  }
  // 2) 내가 작성한 잘못된 코드
  //if (oldPassword != password) {
  //  return res.status(400).render("change-password", {
  //    pageTitle: "Change Password",
  //    errorMessage:
  //      "You've input a wrong password. Please input your password that you've used",
  //  });
  //}
  // newPassword와 newPasswordConfirmation이 동일한지 확인
  if (newPassword != newPasswordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage:
        "The new password does not match the password-confirmation.",
    });
  }

  // 유저 찾기
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save(); // user.save() 를 하면 User.js 파일의 pre save middleware가 작동함
  req.session.user.password = user.password; // 여기서는 user.password가 해시화 돼 있다!

  // 위 조건 두가지 모두 만족하지 않을 경우 새로운 비밀번호로 업데이트
  //await User.findByIdAndUpdate(_id, {
  //  password: await bcrypt.hash(newPassword, 5),
  //});

  // send notification "you've changed your password! good!"
  return res.redirect("logout");
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);

  const pageTitle = "Login";
  // 1번째. 입력한 username이 DB에 존재하는지 확인
  // +) socialOnly 가 false인 유저만 찾기
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    // user가 존재하지 않는다면
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  // 2번째. 입력한 password가 correct한지 확인
  // if else문을 통해 비번이 없는 유저에게 깃헙으로 로그인하라고 안내하기
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    // 비밀번호가 일치하지 않는 경우
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  // 로그인 실행되며 세션 생성
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("Log User In! coming soon!");
  return res.redirect("/");
};

// 깃헙 로그인 버튼 클릭 시 사용자를 깃헙으로 보내고, 깃헙 id 요청
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  // configuration 객체
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false, // 계정 없을 시 회원가입 허용 여부
    scope: "read:user user:email", // scope = 이 url로 뭘 할건가?
    // scope: "read:user user:email", // 꼭 공백으로 나눠주어야 함
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  // 유저가 깃헙에서 돌아오면 "/github/finish" 에 "?code=xxx"가 붙여진 uri를 받게 됨
  // 이때, code는 유저가 승인했음을 깃헙이 우리에게 알려주는 것임
  // await 사용하므로 async 꼭 써줘야 함!
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, // 깃헙이 우리에게 uri로 준 code "?code=xxx"에서 xxx 부분
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  // 위에서 생성된 finalURL로 깃헙에게 POST request 보냄
  // 모든 게 올바르다면, 이 request로, 깃헙은 우리에게 access_token을 줌
  const tokenRequest = await (
    await fetch(finalUrl, {
      // fetch를 통해 데이터 받아오기
      method: "POST", // finalUrl에 POST 요청
      headers: {
        Accept: "application/json",
      },
    })
  ).json(); // .json : 그 데이터에서 JSON 추출하기
  // console.log(json);
  // res.send(JSON.stringify(json)); // 프론트엔드에서 보기

  // access_token이 있어야 github API와 상호작용할 수 있다!!
  // 따라서, acess_token은 api와 상호작용하기 위한 용도!
  if ("access_token" in tokenRequest) {
    // 깃헙 API에 접근하기
    // GET url을 통해서 인증을 위한 access_token을 보내줘야 한다!
    const { access_token } = tokenRequest; // json 안에 있는 access_token 저장
    const apiUrl = "https://api.github.com";
    // 유저 프로필 받기 위해 깃헙에 GET 요청 (GET 맞나?)
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        // 여기에 method: "GET" 해도 되나?
        headers: {
          Authorization: `token ${access_token}`, // access_token을 fetch 안의 headers로 보냄
        },
      })
    ).json();
    // console.log(userData); // 간혹 userData에서 email을 null로 보내줄 수도 있다

    // 따라서 email API에도 요청을 보내줘야 한다
    // access_token으로, 깃헙에 email 데이터 요청
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(emailData); // emailData : array 타입
    // 유저의 이메일 중에서 primary 와 verified가 모두 true 인 이메일(emailObj) 찾기
    const emailObj = emailData.find(
      (email) => email.primary == true && email.verified == true
    );

    // 만약 primary이면서, verified한 이메일을 가진 유저를 찾지 못한 경우
    if (!emailObj) {
      // 나중에는 notification 설정할 예정
      // nofitication : 유저에게 깃헙으로 로그인했다는 걸 알려주기 위함
      return res.redirect("/login"); //logn 화면으로 리디렉션
    }

    // emailObj 를 가진 user의 email이 이미 데이터베이스에 있는지 찾기
    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      // 해당 email로 유저가 없으므로, 새로운 계정 생성하도록 해주어야 함
      // 이때, 새로운 계정이란 깃헙 계정을 생성한다는 게 아니라,
      // 우리 wetube 페이지에서 계정을 생성하도록 해준다는 말!
      // 해당 emailObj.email 과 깃헙이 보낸 데이터를 통해서! 새로운 user 계정 생성!
      user = await User.create({
        // User.create()은 새로 만든 user를 return 시켜줌
        name: userData.name, // access_token 을 통해 깃헙으로부터 가져온 유저의 public 정보 중 name으로 선언
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email, // userData가 아니라 emailObj에서 가져온 email 로 선언
        password: "", //깃헙이 무작위 password를 줌
        socialOnly: true, // true : 깃헙 로그인 통해 만들어진 계정임
        location: userData.location,
      });
    }
    // 새로 생성된 위 user 또는 데이터베이스에 이미 있는 user 모두를 로그인 시켜줘야 함
    // 그 유저가 이메일로 로그인했는지, 깃헙으로 로그인했는지는 상관하지 않고
    // 로그인 시켜준다
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/"); // 로그인된 상태로 Home으로 리디렉션
  } else {
    // access token 없다면 로그인 페이지로 리디렉션됨
    // 이때, login.pug 템플릿을 render 하는 게 아니라, /login uri로 리디렉션 되는 것임!
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy(); // 세션 없애기
  req.flash("info", "Bye Bye");
  return res.redirect("/"); // 홈 화면으로 리디렉션
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  // const videos = await Video.find({ owner: user._id }); // onwer가 동일한 모든 videos 찾기
  // console.log(user);
  return res.render("profile", {
    pageTitle: user.name,
    user,
  });
};
