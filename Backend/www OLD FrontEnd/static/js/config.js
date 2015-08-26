console.log(document.currentScript);

var CurrentUrlRoot = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

var SiteUrl = new Object();
//SiteUrl.Root = "http://localhost:1313";
SiteUrl.Root = "/";

var ApiUrl = new Object();
ApiUrl.Root = CurrentUrlRoot;
//ApiUrl.Root = "http://localhost:3003";
ApiUrl.Commands = "/api/v1/commands"
ApiUrl.FrontPage = "/api/v1/frontpagedoc"
ApiUrl.Docs = "/api/v1/docs";
ApiUrl.Files = "/api/v1/files";
