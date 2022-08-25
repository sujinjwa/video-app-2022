const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // javascript와 css를 분리하기 위한 plugin

const path = require("path"); // 절대 경로인 path.resolve(__dirname) 을 사용하기 위한 path 모듈

module.exports = {
  entry: {
    main: "./src/client/js/main.js", // 변환되기 전 내가 작성할 코드의 경로
    videoPlayer: "./src/client/js/videoPlayer.js",
  },
  mode: "development", // 개발 중이라는 의미 (코드 압축 X 에러 쉽게 확인 O)
  watch: true, // watch 모드 : 파일 변경 시 자동 컴파일
  plugins: [
    // css 추출해서 js 외 별도의 css 파일 만들어줌
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    // webpack을 통해 변환되는 코드의 파일명(filename), 파일경로(path)
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true, // output folder를 build하기 전 자동 정리(clean: 이전에 설치했거나 불필요한 파일 제거)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
