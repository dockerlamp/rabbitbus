console.log('Consumer started');

// tslint:disable-next-line:no-var-requires
const stats = require('measured').createCollection();

import { factory as durableChannel } from '../lib/message-bus/create-durable-queue-channel';
import { CommandBus } from '../lib/message-bus/CommandBus';
import * as _ from 'lodash';

let startConsumer = async () => {
    let commandBus = new CommandBus(durableChannel);
    await commandBus.addCommandHandler('hello.world.2', async (paylaod) => {
        if (!paylaod.valueV2) {
            throw new Error('Wrong paylaod for hello world v2');
        }
        stats.meter('consume.2').mark();
    });
    await commandBus.addCommandHandler('hello.world.3', async (paylaod) => {
        if (!paylaod.valueV3) {
            throw new Error('Wrong paylaod for hello world v3');
        }
        stats.meter('consume.3').mark();
    });
};

let prevCountMap = [];
startConsumer()
    .then(() => {
        console.log('[*] consumer started');
        setInterval(() => {
            let countMap = _.map(stats.toJSON(), (value: any, key: string) => {
                return key + '|' + value.count;
            });
            if (!_.isEqual(prevCountMap, countMap)) {
                // show stats only if consumerd events count changes
                console.log('[=] consumer stats', stats.toJSON());
                prevCountMap = countMap;
            }
        }, 5000);
    })
    .catch((err) => console.error(err));