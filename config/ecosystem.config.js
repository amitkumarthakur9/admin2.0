module.exports = {
	apps: [
		{
			name: "my-react-app",
			script: "serve",
			args: ['dist','3000'],
			instances: 'max',
			exec_mode: "cluster",
			watch: false,
			env: {
				NODE_ENV: "production",
				PORT: 3000,
			},
		},
	],
};
