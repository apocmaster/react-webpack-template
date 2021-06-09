const { default: merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const common = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name]-[contenthash].js",
		publicPath: "",
		clean: true,
		assetModuleFilename: "images/[hash][ext][query]",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/i,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
		}),
	],
};

const development = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.css$/i,
				exclude: /node_modules/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: {
								compileType: "module",
								auto: true,
								localIdentName: "[name]__[local]",
							},
						},
					},
				],
			},
		],
	},
	devServer: {
		contentBase: path.join(__dirname, "../dist"),
		port: 4500,
		hot: true,
		open: "chrome",
	},
	devtool: "eval-source-map",
	plugins: [new webpack.HotModuleReplacementPlugin()],
};

const production = {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.css$/i,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
	devtool: "source-map",
	plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env) => {
	return env.production
		? merge(common, production)
		: merge(common, development);
};
