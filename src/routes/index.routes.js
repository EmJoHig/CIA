import { Router } from "express";
import { renderIndex, renderAbout } from "../controllers/index.controller";
const Handlebars = require('handlebars');
const moment = require('moment');

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

var DateFormats = {
    soloFecha: "DD/MM/YYYY",
    soloHora: "HH:mm",
    completo: "DD/MM/YYYY HH:mm"
};

Handlebars.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] === expression;
    });
});

Handlebars.registerHelper('formatDate', function (datetime, format) {
    if (moment) {
        // can use other formats like 'lll' too
        format = DateFormats[format] || format;
        return moment(datetime).format(format);
      }
      else {
        return datetime;
      }
});



export default router;
