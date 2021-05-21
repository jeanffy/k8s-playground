const http = require('http');
const os = require('os');

const version = '1.0';

const server = http.createServer(async (req, res) => {
  const url = process.env.NODUL_API_URL || 'http://localhost:3000';
  res.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        h2 { color: yellow; }
        pre { background-color: darkgray; padding: 10px; color: white; }
      </style>
      <script>
        function callApi() {
          const xmlHttp = new XMLHttpRequest();
          xmlHttp.onload = () => {
            console.log(document.getElementsByTagName('pre'));
            document.getElementsByTagName('pre')[0].innerHTML = xmlHttp.responseText;
          };
          xmlHttp.open('GET', '${url}', true);
          xmlHttp.send();
        }
      </script>
    </head>
    <body>
      <h2>Nodul Front version ${version}</h2>
      <table>
        <tr><td>Hostname</td><td>${os.hostname()}</td></tr>
        <tr><td>API URL</td><td>${url}</td></tr>
      </table>
      <p>Response from API:</p>
      <pre>Request in progress...</pre>
      <script>callApi();</script>
    </body>
    </html>
  `);
  res.end();
});

const port = process.env.NODUL_FRONT_PORT || 4000;

server.listen(port, () => {
  console.log(`Frontend listening at port ${port}`);
});
