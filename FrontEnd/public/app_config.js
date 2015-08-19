"use strict";

function TAppConfig(){
    this.CurrentUrlRoot = location.protocol+'//'+location.hostname+(location.port ? ':' + location.port: '');

    this.ApiUrl = {};
    //this.ApiUrl.Root = location.protocol+'//'+location.hostname + ':' + 3003;
    this.ApiUrl.Root = location.protocol+'//'+location.hostname + ':' + location.port;
    this.ApiUrl.Commands = "/api/v1/commands";
    this.ApiUrl.FrontPage = "/api/v1/frontpagedoc";
    this.ApiUrl.Docs = "/api/v1/docs";
    this.ApiUrl.Files = "/api/v1/files";
}

