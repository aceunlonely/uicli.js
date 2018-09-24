var ioc = require('peeriocjs')

var conf = require('./config.json')

conf.verbose = conf.verbose || false


ioc.module("uicli").reg("config",function(){return conf},null,true)