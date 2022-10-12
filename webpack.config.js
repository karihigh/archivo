const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: { frontend: ["./src/index.js", "./src/sass/main.scss"] },
	plugins: [
		new MiniCssExtractPlugin({ filename: "[name].css" }),
		new HtmlWebpackPlugin({
			title: "Archivo Carteles",
			template: "src/index.html",
		}),
	],
	mode: "development",
	output: {
		filename: "[name][contenthash].js",
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "[name][ext]",
		clean: true,
	},
	devServer: {
		static: "./dist",
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.html$/i,
				use: ["html-loader"],
			},
			{
				test: /\.s?css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								["@babel/preset-env", { targets: "defaults" }],
								"@babel/preset-react",
							],
						},
					},
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
};
