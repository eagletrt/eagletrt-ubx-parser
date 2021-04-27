const fs = require('fs');
const path = require('path');
const { Logger } = require('euberlog');

const utils = require('./utils');
const { TYPE, INPUTS } = require('./config.json');

const logger = new Logger();

INPUTS.forEach(input => {
    logger.info(`READING inputs/${input}.ubx`);

    const inputPath = path.join(__dirname, 'inputs', `${input}.ubx`);
    const rows = fs.readFileSync(inputPath, 'utf-8').split('\n');

    const GGA = utils.getGGA(rows);
    const GLL = utils.getGLL(rows);
    const RMC = utils.getRMC(rows);
    const data = utils.getData(GGA, GLL, RMC);

    const outputExtension = (TYPE === 'CSV' ? 'csv' : 'json');
    const outputPath = path.join(__dirname, 'outputs', outputExtension, `${input}.${outputExtension}`);
    const outputText = TYPE === 'CSV' ? utils.getCsvData(data) : utils.getJsonData(data);
    fs.writeFileSync(outputPath, outputText);

    logger.success(`WRITTEN outputs/${input}.${outputExtension}`);
    logger.br();
}); 