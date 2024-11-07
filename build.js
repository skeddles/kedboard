const fs = require('fs');
const sass = require('sass');

// if ./build doesn't exist, create it

if (!fs.existsSync('./build')) {
	  fs.mkdirSync('./build');
}

const javascript = fs.readFileSync('./script.js', 'utf8');
const scss = fs.readFileSync('./style.scss', 'utf8');
const html = fs.readFileSync('./index.html', 'utf8');

// compile sass to css
const css = sass.renderSync({
	  data: scss
}).css.toString();

const output = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>kedboard</title>
	<style>${css}</style>
</head>
<body>
	${html}
	<script>${javascript}</script>
</body>
</html>
`;

fs.writeFileSync('./build/index.html', output);